'use client';

import type { FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type {
  DailyCheckIn,
  Exercise,
  MuscleMap,
  QuestConfig,
  QuestPlan,
  UserProfile,
  WorkoutLog
} from '@/lib/domain-types';
import { groupLogsByExercise, sortLogsByMostRecent } from '@/lib/log-helpers';
import { average } from '@/lib/math';
import { usePersistentState } from '@/lib/persistent-state';
import { generateQuestPlan } from '@/lib/quest-engine';

type LogDraft = {
  date: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weight: string;
  duration: string;
  difficulty: number;
  enjoyment: number;
  feltIn: string[];
  notes: string;
  isTimedHold: boolean;
};

type ProgressRow = {
  exerciseId: string;
  label: string;
  lastPerformed: string;
  averageDifficulty: number;
  averageEnjoyment: number;
  trend: number;
};

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

const formatMuscleLabel = (muscle: string) => muscle.replaceAll('_', ' ');

const formatSummary = (plan: QuestPlan) => {
  const feelingLabel = feelingOptions.find((option) => option.value === plan.summary.feeling)?.label ?? 'Steady day';
  const sorenessLabel = plan.summary.soreMuscles.length > 0
    ? plan.summary.soreMuscles.map(formatMuscleLabel).join(', ')
    : 'None';

  return `${feelingLabel} · Sore: ${sorenessLabel}`;
};

const createLogDraft = (date: string, defaultExerciseId: string): LogDraft => ({
  date,
  exerciseId: defaultExerciseId,
  sets: 3,
  reps: 8,
  weight: '',
  duration: '30',
  difficulty: 7,
  enjoyment: 3,
  feltIn: [],
  notes: '',
  isTimedHold: false
});

const computeProgressRows = (
  logs: WorkoutLog[],
  exercisesById: Map<string, string>,
  smoothingWindow: number
): ProgressRow[] => {
  const grouped = groupLogsByExercise(logs);
  const rows: ProgressRow[] = [];

  grouped.forEach((exerciseLogs, exerciseId) => {
    const recent = exerciseLogs.slice(0, smoothingWindow);

    if (recent.length === 0) {
      return;
    }

    const label = exercisesById.get(exerciseId) ?? exerciseId;
    const averageDifficulty = average(recent.map((log) => log.difficulty));
    const averageEnjoyment = average(recent.map((log) => log.enjoyment));
    const lastPerformed = exerciseLogs[0]?.date ?? '';
    const previous = recent.slice(1);
    const previousAverage = previous.length > 0 ? average(previous.map((log) => log.difficulty)) : averageDifficulty;
    const trend = averageDifficulty - previousAverage;

    rows.push({
      exerciseId,
      label,
      lastPerformed,
      averageDifficulty,
      averageEnjoyment,
      trend
    });
  });

  return rows
    .sort((a, b) => (a.lastPerformed < b.lastPerformed ? 1 : -1))
    .slice(0, 5);
};

const QuestPlanner = ({
  exercises,
  muscleMap,
  logs: initialLogs,
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
  const defaultExerciseId = exercises[0]?.id ?? '';
  const muscleOptions = useMemo(() => buildMuscleOptions(muscleMap), [muscleMap]);
  const [checkIn, setCheckIn] = usePersistentState<DailyCheckIn>('questfit.check-in', initialCheckIn);
  const [logs, setLogs] = usePersistentState<WorkoutLog[]>('questfit.logs', initialLogs);
  const [logDraft, setLogDraft] = useState<LogDraft>(() => createLogDraft(checkIn.date, defaultExerciseId));

  useEffect(() => {
    setLogDraft((previous) => ({ ...previous, date: checkIn.date }));
  }, [checkIn.date]);

  const sortedLogs = useMemo(() => sortLogsByMostRecent(logs), [logs]);
  const exercisesById = useMemo(
    () => new Map(exercises.map((exercise) => [exercise.id, exercise.label])),
    [exercises]
  );

  const questPlan = useMemo(
    () =>
      generateQuestPlan({
        exercises,
        muscleMap,
        logs: sortedLogs,
        checkIn,
        userProfile,
        config
      }),
    [checkIn, config, exercises, muscleMap, sortedLogs, userProfile]
  );

  const progressRows = useMemo(
    () => computeProgressRows(sortedLogs, exercisesById, config.smoothingWindow),
    [config.smoothingWindow, exercisesById, sortedLogs]
  );

  const handleFeelingChange = (value: DailyCheckIn['overallFeeling']) => {
    setCheckIn((previous) => ({ ...previous, overallFeeling: value }));
  };

  const handleCheckInDateChange = (value: string) => {
    setCheckIn((previous) => ({ ...previous, date: value }));
  };

  const handleCheckInNotesChange = (value: string) => {
    setCheckIn((previous) => ({ ...previous, notes: value }));
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

  const handleDraftChange = useCallback(<K extends keyof LogDraft>(field: K, value: LogDraft[K]) => {
    setLogDraft((previous) => ({ ...previous, [field]: value }));
  }, []);

  const toggleFeltInMuscle = (muscle: string) => {
    setLogDraft((previous) => {
      const isSelected = previous.feltIn.includes(muscle);
      const feltIn = isSelected
        ? previous.feltIn.filter((item) => item !== muscle)
        : [...previous.feltIn, muscle];

      return { ...previous, feltIn };
    });
  };

  const toggleTimedHold = (checked: boolean) => {
    setLogDraft((previous) => ({
      ...previous,
      isTimedHold: checked,
      weight: checked ? '' : previous.weight
    }));
  };

  const handleLogSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const weightValue = logDraft.isTimedHold ? null : logDraft.weight === '' ? 0 : Number(logDraft.weight);
    const repsValue = logDraft.isTimedHold ? Number(logDraft.duration || 0) : logDraft.reps;

    const newLog: WorkoutLog = {
      exerciseId: logDraft.exerciseId || defaultExerciseId,
      date: logDraft.date,
      sets: logDraft.sets,
      reps: repsValue,
      weight: weightValue,
      difficulty: logDraft.difficulty,
      enjoyment: logDraft.enjoyment,
      feltIn: logDraft.feltIn,
      notes: logDraft.notes.trim() ? logDraft.notes.trim() : undefined
    };

    setLogs((previous) => sortLogsByMostRecent([newLog, ...previous]));
    setLogDraft((previous) => ({
      ...createLogDraft(checkIn.date, previous.exerciseId || defaultExerciseId),
      feltIn: previous.feltIn,
      exerciseId: previous.exerciseId || defaultExerciseId,
      isTimedHold: previous.isTimedHold,
      duration: previous.isTimedHold ? previous.duration : '30'
    }));
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
          aria-label={formatMuscleLabel(muscle)}
        />
        <span>{formatMuscleLabel(muscle)}</span>
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

  const feltInChips = muscleOptions.map((muscle) => {
    const checked = logDraft.feltIn.includes(muscle);

    return (
      <label key={`felt-${muscle}`} className={`chip ${checked ? 'chip--active' : ''}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => toggleFeltInMuscle(muscle)}
          aria-label={`Felt it in ${formatMuscleLabel(muscle)}`}
        />
        <span>{formatMuscleLabel(muscle)}</span>
      </label>
    );
  });

  const progressCards = progressRows.map((row) => {
    const trendLabel = row.trend === 0
      ? 'Stable'
      : row.trend > 0
        ? `▲ +${row.trend.toFixed(1)} RPE`
        : `▼ ${row.trend.toFixed(1)} RPE`;

    return (
      <div key={row.exerciseId} className="progress-card">
        <header>
          <strong>{row.label}</strong>
          <span>{row.lastPerformed}</span>
        </header>
        <dl>
          <div>
            <dt>Rolling RPE</dt>
            <dd>{row.averageDifficulty.toFixed(1)}</dd>
          </div>
          <div>
            <dt>Enjoyment</dt>
            <dd>{row.averageEnjoyment.toFixed(1)}/5</dd>
          </div>
          <div>
            <dt>Trend</dt>
            <dd>{trendLabel}</dd>
          </div>
        </dl>
      </div>
    );
  });

  return (
    <section aria-labelledby="quest-planner-title">
      <h2 id="quest-planner-title">Daily quest builder</h2>
      <p>
        Update how you feel today and QuestFit will adapt the prescription, dialing exercises up or down while respecting
        recovery. Log the session to feed the progression engine and track momentum over time.
      </p>
      <div className="grid two-column">
        <div className="control-panel">
          <h3>Daily check-in</h3>
          <fieldset>
            <legend>Basics</legend>
            <label className="field">
              <span>Date</span>
              <input
                type="date"
                value={checkIn.date}
                onChange={(event) => handleCheckInDateChange(event.target.value)}
              />
            </label>
            <label className="field">
              <span>Notes</span>
              <textarea
                rows={3}
                value={checkIn.notes ?? ''}
                onChange={(event) => handleCheckInNotesChange(event.target.value)}
                placeholder="Sleep, stress, or anything the coach brain should know."
              />
            </label>
          </fieldset>
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
          <form className="logger-form" onSubmit={handleLogSubmit}>
            <h3>Log the session</h3>
            <div className="field">
              <label htmlFor="log-date">Log date</label>
              <input
                id="log-date"
                type="date"
                value={logDraft.date}
                onChange={(event) => handleDraftChange('date', event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="exercise-select">Exercise</label>
              <select
                id="exercise-select"
                value={logDraft.exerciseId}
                onChange={(event) => handleDraftChange('exerciseId', event.target.value)}
              >
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid form-grid">
              <label className="field">
                <span>Sets</span>
                <input
                  type="number"
                  min={1}
                  value={logDraft.sets}
                  onChange={(event) => handleDraftChange('sets', Number(event.target.value))}
                />
              </label>
              <label className="field">
                <span>{logDraft.isTimedHold ? 'Seconds' : 'Reps'}</span>
                <input
                  type="number"
                  min={0}
                  value={logDraft.isTimedHold ? logDraft.duration : String(logDraft.reps)}
                  onChange={(event) =>
                    logDraft.isTimedHold
                      ? handleDraftChange('duration', event.target.value)
                      : handleDraftChange('reps', Number(event.target.value))
                  }
                />
              </label>
              <label className="field">
                <span>Load (kg)</span>
                <input
                  type="number"
                  min={0}
                  step={2.5}
                  value={logDraft.weight}
                  onChange={(event) => handleDraftChange('weight', event.target.value)}
                  placeholder="0 for bodyweight"
                  disabled={logDraft.isTimedHold}
                />
              </label>
            </div>
            <label className="field checkbox-field">
              <input
                type="checkbox"
                checked={logDraft.isTimedHold}
                onChange={(event) => toggleTimedHold(event.target.checked)}
              />
              <span>Timed hold instead of load</span>
            </label>
            <div className="grid form-grid">
              <label className="field">
                <span>RPE / difficulty</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={logDraft.difficulty}
                  onChange={(event) => handleDraftChange('difficulty', Number(event.target.value))}
                />
              </label>
              <label className="field">
                <span>Enjoyment (1-5)</span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={logDraft.enjoyment}
                  onChange={(event) => handleDraftChange('enjoyment', Number(event.target.value))}
                />
              </label>
            </div>
            <div className="field">
              <span>Felt it in</span>
              <div className="chip-grid">{feltInChips}</div>
            </div>
            <label className="field">
              <span>Notes</span>
              <textarea
                rows={3}
                value={logDraft.notes}
                onChange={(event) => handleDraftChange('notes', event.target.value)}
                placeholder="Technical focus, wins, or anything odd."
              />
            </label>
            <button type="submit" className="primary-button">
              Save log
            </button>
          </form>
        </div>
        <div className="quest-results">
          <header>
            <h3>Today&apos;s quest</h3>
            <span className="badge subtle">{formatSummary(questPlan)}</span>
          </header>
          <div className="quest-grid">{questItems}</div>
          <div className="progress-panel">
            <h4>Progress pulse</h4>
            {progressCards.length > 0 ? (
              <div className="progress-grid">{progressCards}</div>
            ) : (
              <p>No history yet. Log a session to start tracking momentum.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestPlanner;
