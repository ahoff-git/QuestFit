import type { DailyCheckIn, UserProfile, WorkoutLog } from './domain-types';

export const sampleUserProfile: UserProfile = {
  goals: ['pectoralis_major', 'latissimus_dorsi', 'rectus_abdominis'],
  preferredQuestSize: 5
};

export const defaultDailyCheckIn: DailyCheckIn = {
  date: '2024-05-20',
  overallFeeling: 'normal',
  soreMuscles: ['hamstrings'],
  notes: 'Hamstrings tight after long run.'
};

export const sampleLogs: WorkoutLog[] = [
  {
    exerciseId: 'bench_press',
    date: '2024-05-18',
    sets: 4,
    reps: 6,
    weight: 85,
    difficulty: 8,
    enjoyment: 4,
    feltIn: ['pectoralis_major', 'triceps_brachii'],
    notes: 'Last set grindy but solid bar path.'
  },
  {
    exerciseId: 'bench_press',
    date: '2024-05-11',
    sets: 4,
    reps: 6,
    weight: 82.5,
    difficulty: 7,
    enjoyment: 4,
    feltIn: ['pectoralis_major'],
    notes: 'Felt smooth; ready for small bump.'
  },
  {
    exerciseId: 'squat',
    date: '2024-05-17',
    sets: 5,
    reps: 5,
    weight: 110,
    difficulty: 9,
    enjoyment: 3,
    feltIn: ['quadriceps', 'erector_spinae'],
    notes: 'Back felt taxed, keep load steady.'
  },
  {
    exerciseId: 'squat',
    date: '2024-05-10',
    sets: 5,
    reps: 5,
    weight: 107.5,
    difficulty: 8,
    enjoyment: 3,
    feltIn: ['quadriceps'],
    notes: 'Solid depth but knees caved a bit.'
  },
  {
    exerciseId: 'deadlift',
    date: '2024-05-14',
    sets: 3,
    reps: 5,
    weight: 130,
    difficulty: 8,
    enjoyment: 3,
    feltIn: ['hamstrings', 'erector_spinae'],
    notes: 'Grip slipping on final set.'
  },
  {
    exerciseId: 'deadlift',
    date: '2024-05-07',
    sets: 3,
    reps: 5,
    weight: 125,
    difficulty: 7,
    enjoyment: 3,
    feltIn: ['hamstrings'],
    notes: 'Moved quickly, grip solid.'
  },
  {
    exerciseId: 'overhead_press',
    date: '2024-05-16',
    sets: 4,
    reps: 5,
    weight: 50,
    difficulty: 7,
    enjoyment: 4,
    feltIn: ['anterior_deltoid', 'triceps_brachii'],
    notes: 'Felt it in upper traps more than usual.'
  },
  {
    exerciseId: 'overhead_press',
    date: '2024-05-09',
    sets: 4,
    reps: 5,
    weight: 47.5,
    difficulty: 6,
    enjoyment: 4,
    feltIn: ['anterior_deltoid'],
    notes: 'Great pop, ready to push.'
  },
  {
    exerciseId: 'pull_up',
    date: '2024-05-15',
    sets: 4,
    reps: 8,
    weight: 0,
    difficulty: 7,
    enjoyment: 5,
    feltIn: ['latissimus_dorsi', 'biceps_brachii'],
    notes: 'Added slight pause at top.'
  },
  {
    exerciseId: 'pull_up',
    date: '2024-05-08',
    sets: 4,
    reps: 8,
    weight: 0,
    difficulty: 6,
    enjoyment: 5,
    feltIn: ['latissimus_dorsi'],
    notes: 'Could add load next time.'
  },
  {
    exerciseId: 'plank',
    date: '2024-05-13',
    sets: 3,
    reps: 45,
    weight: null,
    difficulty: 6,
    enjoyment: 4,
    feltIn: ['rectus_abdominis', 'obliques'],
    notes: 'Steady breathing, minor shaking.'
  },
  {
    exerciseId: 'plank',
    date: '2024-05-06',
    sets: 3,
    reps: 40,
    weight: null,
    difficulty: 5,
    enjoyment: 4,
    feltIn: ['rectus_abdominis'],
    notes: 'Could extend duration slightly.'
  },
  {
    exerciseId: 'barbell_row',
    date: '2024-05-12',
    sets: 4,
    reps: 8,
    weight: 70,
    difficulty: 7,
    enjoyment: 4,
    feltIn: ['latissimus_dorsi', 'rhomboids'],
    notes: 'Lower back tight by end.'
  },
  {
    exerciseId: 'lunge',
    date: '2024-05-11',
    sets: 3,
    reps: 10,
    weight: 30,
    difficulty: 6,
    enjoyment: 3,
    feltIn: ['quadriceps', 'gluteus_maximus'],
    notes: 'Balance wobbly on left side.'
  },
  {
    exerciseId: 'dip',
    date: '2024-05-10',
    sets: 3,
    reps: 10,
    weight: 0,
    difficulty: 7,
    enjoyment: 4,
    feltIn: ['pectoralis_major', 'triceps_brachii'],
    notes: 'Shoulders pinched slightly at bottom.'
  }
];
