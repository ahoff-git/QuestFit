import type { WorkoutLog } from './domain-types';

export const sortLogsByMostRecent = (logs: WorkoutLog[]) =>
  [...logs].sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));

export const groupLogsByExercise = (logs: WorkoutLog[]) => {
  const grouped = new Map<string, WorkoutLog[]>();

  logs.forEach((log) => {
    const exerciseLogs = grouped.get(log.exerciseId) ?? [];
    exerciseLogs.push(log);
    grouped.set(log.exerciseId, exerciseLogs);
  });

  grouped.forEach((exerciseLogs, key) => {
    grouped.set(key, sortLogsByMostRecent(exerciseLogs));
  });

  return grouped;
};
