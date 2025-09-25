export type Exercise = {
  id: string;
  label: string;
};

export type MuscleMapEntry = {
  primary: string[];
  synergists: string[];
};

export type MuscleMap = Record<string, MuscleMapEntry>;

export type WorkoutLog = {
  exerciseId: string;
  date: string; // ISO date string
  sets: number;
  reps: number;
  weight: number | null;
  difficulty: number; // RPE 1-10
  enjoyment: number; // 1-5
  feltIn: string[];
  notes?: string;
};

export type DailyCheckIn = {
  date: string;
  overallFeeling: 'easy' | 'normal' | 'hard';
  soreMuscles: string[];
  notes?: string;
};

export type UserProfile = {
  goals: string[];
  preferredQuestSize: number;
};

export type QuestConfig = {
  smoothingWindow: number;
  enjoymentBiasWeight: number;
  difficultyTarget: number;
  maxIncreaseStep: number;
  maxDecreaseStep: number;
  sorenessScalingFactor: number;
  cooldownDaysPerMuscle: number;
  deloadAfterDaysMissed: number;
  repSchemeOptions: Array<{
    label: string;
    reps: [number, number];
    intensity: 'high' | 'moderate' | 'low';
  }>;
};

export type QuestRecommendation = {
  exerciseId: string;
  exerciseLabel: string;
  focus: string;
  sets: number;
  reps: number;
  targetLoad: string;
  repScheme: string;
  notes: string[];
};

export type QuestPlan = {
  generatedAt: string;
  summary: {
    feeling: DailyCheckIn['overallFeeling'];
    soreMuscles: string[];
  };
  recommendations: QuestRecommendation[];
};
