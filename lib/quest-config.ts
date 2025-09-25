import type { QuestConfig as QuestConfigShape } from './domain-types';

export const questConfig: QuestConfigShape = {
  smoothingWindow: 5,
  enjoymentBiasWeight: 1.5,
  difficultyTarget: 7,
  maxIncreaseStep: 0.2,
  maxDecreaseStep: 0.15,
  sorenessScalingFactor: 0.5,
  cooldownDaysPerMuscle: 2,
  deloadAfterDaysMissed: 5,
  repSchemeOptions: [
    { label: 'Low Rep', reps: [3, 5], intensity: 'high' },
    { label: 'Mid Rep', reps: [6, 10], intensity: 'moderate' },
    { label: 'High Rep', reps: [12, 20], intensity: 'low' }
  ]
};
