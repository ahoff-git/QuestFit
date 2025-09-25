import type {
  DailyCheckIn,
  Exercise,
  MuscleMap,
  QuestPlan,
  QuestRecommendation,
  QuestConfig,
  UserProfile,
  WorkoutLog
} from './domain-types';
import { groupLogsByExercise } from './log-helpers';
import { average, clamp } from './math';

const MILLISECONDS_PER_DAY = 86_400_000;

const parseDate = (value: string) => new Date(`${value}T00:00:00Z`);

const daysBetween = (later: string, earlier: string) => {
  const laterDate = parseDate(later);
  const earlierDate = parseDate(earlier);
  const diff = laterDate.getTime() - earlierDate.getTime();
  return Math.floor(diff / MILLISECONDS_PER_DAY);
};

const enjoymentBias = (enjoyment: number, config: QuestConfig) => {
  const centredEnjoyment = enjoyment - 3; // 3 is neutral on a 1-5 scale
  const scaled = (centredEnjoyment / 2) * (config.enjoymentBiasWeight / 2);
  return 1 + scaled;
};

const recencyBoost = (daysSince: number | null, cooldownDays: number) => {
  if (daysSince === null) {
    return 1.1; // unseen exercises get a gentle boost
  }

  if (daysSince <= cooldownDays) {
    return 0.25;
  }

  const normalised = clamp(daysSince / 7, 0, 1);
  return 1 + normalised * 0.3;
};

const sorenessPenalty = (targetMuscles: string[], soreMuscles: string[], scale: number) => {
  const intersects = targetMuscles.some((muscle) => soreMuscles.includes(muscle));
  return intersects ? scale : 1;
};

const calculateWeeklyVolume = (
  logs: WorkoutLog[],
  muscleMap: MuscleMap,
  referenceDate: string
) => {
  const reference = parseDate(referenceDate).getTime();
  const windowStart = reference - 6 * MILLISECONDS_PER_DAY;
  const totals = new Map<string, number>();

  logs.forEach((log) => {
    const timestamp = parseDate(log.date).getTime();

    if (timestamp < windowStart) {
      return;
    }

    const mapEntry = muscleMap[log.exerciseId];

    if (!mapEntry) {
      return;
    }

    const involvedMuscles = new Set([...mapEntry.primary, ...mapEntry.synergists]);

    involvedMuscles.forEach((muscle) => {
      const current = totals.get(muscle) ?? 0;
      totals.set(muscle, current + log.sets);
    });
  });

  return totals;
};

const applyVolumeGuardrail = (
  primaryMuscles: string[],
  weeklyVolume: Map<string, number>,
  config: QuestConfig
) => {
  const cap = config.weeklySetCap;
  const utilisationValues = primaryMuscles.map((muscle) => {
    const totalSets = weeklyVolume.get(muscle) ?? 0;
    return totalSets / cap;
  });

  if (utilisationValues.length === 0) {
    return 1;
  }

  const highestUtilisation = Math.max(...utilisationValues);

  if (highestUtilisation <= 0.8) {
    return 1;
  }

  const overload = Math.min(highestUtilisation - 0.8, 1);
  const penalty = 1 - overload * config.volumePenaltyWeight;
  return clamp(penalty, 0.35, 1);
};

const pickRepScheme = (index: number, config: QuestConfig) => {
  const scheme = config.repSchemeOptions[index % config.repSchemeOptions.length];
  const midpoint = Math.round((scheme.reps[0] + scheme.reps[1]) / 2);
  const sets = scheme.intensity === 'high' ? 5 : scheme.intensity === 'moderate' ? 4 : 3;

  return {
    schemeLabel: `${scheme.label} · ${scheme.reps[0]}-${scheme.reps[1]} reps`,
    reps: midpoint,
    sets
  };
};

const applyProgression = ({
  history,
  config,
  overallFeeling,
  isSore,
  daysSince
}: {
  history: WorkoutLog[];
  config: QuestConfig;
  overallFeeling: DailyCheckIn['overallFeeling'];
  isSore: boolean;
  daysSince: number | null;
}) => {
  const recent = history.slice(0, config.smoothingWindow);
  const averageDifficulty = average(recent.map((log) => log.difficulty));
  const latest = recent[0];

  if (!latest) {
    return { targetLoad: 'Intro session', suggestedSets: 3, suggestedReps: 8 };
  }

  const baselineLoad = latest.weight ?? 0;
  const isTimedHold = latest.weight === null;
  const isBodyweight = latest.weight === 0;
  const repGuess = Math.round(average(recent.map((log) => log.reps)) || latest.reps);
  const setGuess = Math.round(average(recent.map((log) => log.sets)) || latest.sets);

  const difficultyDelta = config.difficultyTarget - averageDifficulty;
  const adjustmentLimit = difficultyDelta > 0 ? config.maxIncreaseStep : config.maxDecreaseStep;
  const rawAdjustment = clamp(Math.abs(difficultyDelta) / 5, 0, adjustmentLimit);
  const direction = difficultyDelta >= 0 ? 1 : -1;

  const deloadCandidate = typeof daysSince === 'number' && daysSince > config.deloadAfterDaysMissed;
  let intensityModifier = 1 + direction * rawAdjustment;

  if (overallFeeling === 'hard') {
    intensityModifier *= 0.9;
  }

  if (overallFeeling === 'easy') {
    intensityModifier *= 1.05;
  }

  if (isSore) {
    intensityModifier *= config.sorenessScalingFactor;
  }

  if (deloadCandidate) {
    intensityModifier *= 0.9;
  }

  if (isTimedHold) {
    const adjustedSeconds = Math.max(10, Math.round(repGuess * intensityModifier));
    return {
      targetLoad: `${adjustedSeconds} sec hold`,
      suggestedSets: setGuess,
      suggestedReps: repGuess
    };
  }

  let adjustedLoad = baselineLoad;

  if (!isBodyweight && !isTimedHold && baselineLoad > 0) {
    adjustedLoad = baselineLoad * intensityModifier;
  }

  const bodyweightSuggestion = direction > 0
    ? 'Bodyweight + light band'
    : 'Bodyweight focus on tempo';

  const roundedLoad = !isBodyweight && baselineLoad > 0
    ? `${Math.round(adjustedLoad / 2.5) * 2.5} kg`
    : bodyweightSuggestion;

  return {
    targetLoad: roundedLoad,
    suggestedSets: setGuess,
    suggestedReps: repGuess
  };
};

const collectNotes = ({
  latest,
  muscleMapEntry,
  isSore
}: {
  latest: WorkoutLog | undefined;
  muscleMapEntry: MuscleMap[string];
  isSore: boolean;
}) => {
  const notes: string[] = [];

  if (latest?.notes) {
    notes.push(`Last time: ${latest.notes}`);
  }

  const feltMisfire = latest?.feltIn.some((muscle) => !muscleMapEntry.primary.includes(muscle)) ?? false;

  if (feltMisfire) {
    notes.push('Add light activation for support muscles before sets.');
  }

  if (feltMisfire && latest) {
    const offTargetMuscles = latest.feltIn.filter((muscle) => !muscleMapEntry.primary.includes(muscle));
    const suggestions = offTargetMuscles
      .map((muscle) => muscleMapEntry.commonMisfires?.[muscle] ?? [])
      .flat();

    if (suggestions.length > 0) {
      notes.push(`Support work: ${suggestions.join(' · ')}`);
    }
  }

  if (isSore) {
    notes.push('Dial effort back because these muscles are sore.');
  }

  if (notes.length === 0) {
    notes.push('Focus on crisp technique and controlled tempo.');
  }

  return notes;
};

export const generateQuestPlan = ({
  exercises,
  muscleMap,
  logs,
  checkIn,
  userProfile,
  config
}: {
  exercises: Exercise[];
  muscleMap: MuscleMap;
  logs: WorkoutLog[];
  checkIn: DailyCheckIn;
  userProfile: UserProfile;
  config: QuestConfig;
}): QuestPlan => {
  const logsByExercise = groupLogsByExercise(logs);
  const weeklyVolume = calculateWeeklyVolume(logs, muscleMap, checkIn.date);
  const scored: Array<{ recommendation: QuestRecommendation; score: number }> = [];

  exercises.forEach((exercise, index) => {
    const mapEntry = muscleMap[exercise.id];

    if (!mapEntry) {
      return;
    }

    const history = logsByExercise.get(exercise.id) ?? [];
    const averageEnjoyment = average(history.map((log) => log.enjoyment)) || 3;
    const primaryTargets = mapEntry.primary;
    const sorePenalty = sorenessPenalty(primaryTargets, checkIn.soreMuscles, config.sorenessScalingFactor);
    const lastLog = history[0];
    const daysSince = lastLog ? daysBetween(checkIn.date, lastLog.date) : null;
    const repPlan = pickRepScheme(index, config);
    const progression = applyProgression({
      history,
      config,
      overallFeeling: checkIn.overallFeeling,
      isSore: sorePenalty < 1,
      daysSince
    });

    const goalOverlap = primaryTargets.filter((muscle) => userProfile.goals.includes(muscle)).length;
    const goalBoost = 1 + goalOverlap * 0.25;
    const recency = recencyBoost(daysSince, config.cooldownDaysPerMuscle);
    const enjoyment = enjoymentBias(averageEnjoyment, config);
    const feelingFactor = checkIn.overallFeeling === 'easy' ? 1.05 : checkIn.overallFeeling === 'hard' ? 0.9 : 1;
    const volumeGuardrail = applyVolumeGuardrail(primaryTargets, weeklyVolume, config);
    const misfireSupport = progression.targetLoad.includes('Intro')
      ? 1
      : (lastLog?.feltIn.some((muscle) => !primaryTargets.includes(muscle)) ?? false)
        ? config.misfireSupportBoost
        : 1;
    const randomiser = 1 + (Math.random() - 0.5) * config.randomisationTemperature;
    const score = goalBoost * recency * enjoyment * sorePenalty * feelingFactor * volumeGuardrail * misfireSupport * randomiser;
    const focus = `Primary: ${primaryTargets.join(', ')}${mapEntry.synergists.length ? ` · Support: ${mapEntry.synergists.join(', ')}` : ''}`;
    const notes = collectNotes({
      latest: lastLog,
      muscleMapEntry: mapEntry,
      isSore: sorePenalty < 1
    });

    const recommendation: QuestRecommendation = {
      exerciseId: exercise.id,
      exerciseLabel: exercise.label,
      focus,
      sets: repPlan.sets ?? progression.suggestedSets,
      reps: repPlan.reps ?? progression.suggestedReps,
      targetLoad: progression.targetLoad,
      repScheme: repPlan.schemeLabel,
      notes
    };

    scored.push({ recommendation, score });
  });

  const sortedRecommendations = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, userProfile.preferredQuestSize)
    .map((entry) => entry.recommendation);

  const plan: QuestPlan = {
    generatedAt: checkIn.date,
    summary: {
      feeling: checkIn.overallFeeling,
      soreMuscles: checkIn.soreMuscles
    },
    recommendations: sortedRecommendations
  };

  return plan;
};
