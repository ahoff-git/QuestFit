'use client';

import { useMemo, useState } from 'react';

import type {
  DailyCheckIn,
  Exercise,
  MuscleMap,
  QuestConfig,
  QuestPlan,
  UserProfile,
  WorkoutLog
} from '@/lib/domain-types';
import { generateQuestPlan } from '@/lib/quest-engine';

const feelingOptions: Array<{ label: string; value: DailyCheckIn['overallFeeling']; description: string }> = [
  { label: 'Easy day', value: 'easy', description: 'Feeling energetic and ready to push.' },
  { label: 'Steady day', value: 'normal', description: 'Baseline energy and recovery.' },
  { label: 'Hard day', value: 'hard', description: 'Tired, stressed, or still recovering.' }
];

const buildMuscleOptions = (muscleMap: MuscleMap) => {
  const muscles = new Set<string>();

  Object.values(muscleMap).forEach((entry) => {
    entry.primary.forEach((muscle) => muscles.add(muscle));
    entry.synergists.forEach((muscle) => muscles.add(muscle));
  });

  return Array.from(muscles).sort((a, b) => a.localeCompare(b));
};

const formatSummary = (plan: QuestPlan) => {
  const feelingLabel = feelingOptions.find((option) => option.value === plan.summary.feeling)?.label ?? 'Steady day';
  const sorenessLabel = plan.summary.soreMuscles.length > 0
    ? plan.summary.soreMuscles.map((muscle) => muscle.replaceAll('_', ' ')).join(', ')
    : 'None';

  return `${feelingLabel} · Sore: ${sorenessLabel}`;
};

const QuestPlanner = ({
  exercises,
  muscleMap,
  logs,
  config,
  userProfile,
  initialCheckIn
}: {
  exercises: Exercise[];
  muscleMap: MuscleMap;
  logs: WorkoutLog[];
  config: QuestConfig;
  userProfile: UserProfile;
  initialCheckIn: DailyCheckIn;
}) => {
  const muscleOptions = useMemo(() => buildMuscleOptions(muscleMap), [muscleMap]);
  const [checkIn, setCheckIn] = useState<DailyCheckIn>(initialCheckIn);

  const questPlan = useMemo(
    () =>
      generateQuestPlan({
        exercises,
        muscleMap,
        logs,
        checkIn,
        userProfile,
        config
      }),
    [checkIn, config, exercises, logs, muscleMap, userProfile]
  );

  const handleFeelingChange = (value: DailyCheckIn['overallFeeling']) => {
    setCheckIn((previous) => ({ ...previous, overallFeeling: value }));
  };

  const toggleSoreMuscle = (muscle: string) => {
    setCheckIn((previous) => {
      const isSelected = previous.soreMuscles.includes(muscle);
      const soreMuscles = isSelected
        ? previous.soreMuscles.filter((item) => item !== muscle)
        : [...previous.soreMuscles, muscle];

      return { ...previous, soreMuscles };
    });
  };

  const clearSoreness = () => {
    setCheckIn((previous) => ({ ...previous, soreMuscles: [] }));
  };

  const questItems = questPlan.recommendations.map((recommendation) => {
    const noteItems = recommendation.notes.map((note, index) => (
      <li key={`${recommendation.exerciseId}-note-${index}`}>{note}</li>
    ));

    return (
      <article key={recommendation.exerciseId} className="quest-card">
        <header>
          <h3>{recommendation.exerciseLabel}</h3>
          <p>{recommendation.focus}</p>
        </header>
        <dl>
          <div>
            <dt>Rep scheme</dt>
            <dd>{recommendation.repScheme}</dd>
          </div>
          <div>
            <dt>Prescription</dt>
            <dd>
              {recommendation.sets} sets · {recommendation.reps} reps · {recommendation.targetLoad}
            </dd>
          </div>
        </dl>
        <footer>
          <span>Notes</span>
          <ul>{noteItems}</ul>
        </footer>
      </article>
    );
  });

  const sorenessChips = muscleOptions.map((muscle) => {
    const checked = checkIn.soreMuscles.includes(muscle);

    return (
      <label key={muscle} className={`chip ${checked ? 'chip--active' : ''}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => toggleSoreMuscle(muscle)}
          aria-label={muscle.replaceAll('_', ' ')}
        />
        <span>{muscle.replaceAll('_', ' ')}</span>
      </label>
    );
  });

  const feelingChoices = feelingOptions.map((option) => (
    <label key={option.value} className={`choice ${checkIn.overallFeeling === option.value ? 'choice--active' : ''}`}>
      <input
        type="radio"
        name="overallFeeling"
        value={option.value}
        checked={checkIn.overallFeeling === option.value}
        onChange={() => handleFeelingChange(option.value)}
      />
      <div>
        <strong>{option.label}</strong>
        <p>{option.description}</p>
      </div>
    </label>
  ));

  return (
    <section aria-labelledby="quest-planner-title">
      <h2 id="quest-planner-title">Daily quest builder</h2>
      <p>
        Update how you feel today and QuestFit will adapt the prescription, dialing exercises up or down
        while respecting recovery.
      </p>
      <div className="grid two-column">
        <div className="control-panel">
          <h3>Daily check-in</h3>
          <fieldset>
            <legend>How are you feeling?</legend>
            <div className="choice-grid">{feelingChoices}</div>
          </fieldset>
          <fieldset>
            <legend>Sore or sensitive muscles</legend>
            <div className="chip-grid">{sorenessChips}</div>
            <button type="button" onClick={clearSoreness} className="link-button">
              Clear selections
            </button>
          </fieldset>
        </div>
        <div className="quest-results">
          <header>
            <h3>Today&apos;s quest</h3>
            <span className="badge subtle">{formatSummary(questPlan)}</span>
          </header>
          <div className="quest-grid">{questItems}</div>
        </div>
      </div>
    </section>
  );
};

export default QuestPlanner;
