import { promises as fs } from 'fs';
import path from 'path';

import type { Exercise, MuscleMap } from './domain-types';

const resolveDataPath = (fileName: string) =>
  path.join(process.cwd(), 'data', fileName);

const readJsonFile = async <T>(fileName: string): Promise<T> => {
  const filePath = resolveDataPath(fileName);
  const contents = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(contents) as T;
};

export const loadExerciseList = async (): Promise<Exercise[]> =>
  readJsonFile<Exercise[]>('exercise_list.json');

export const loadMuscleMap = async (): Promise<MuscleMap> =>
  readJsonFile<MuscleMap>('muscle_map.json');

export const loadQuestConfigExcerpt = async (): Promise<string> => {
  const filePath = path.join(process.cwd(), 'docs', 'quest_config.ts');
  const contents = await fs.readFile(filePath, 'utf-8');
  const codeBlockMatch = contents.match(/```ts([\s\S]*?)```/);
  const snippet = codeBlockMatch ? codeBlockMatch[1] : contents;
  return snippet.trim();
};
