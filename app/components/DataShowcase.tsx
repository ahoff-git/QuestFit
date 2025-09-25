import type { Exercise, MuscleMap } from '@/lib/domain-types';
import { formatMuscleName } from '@/lib/format';

type DataShowcaseProps = {
  exercises: Exercise[];
  muscleMap: MuscleMap;
  configSnippet: string;
};

const DataShowcase = ({ exercises, muscleMap, configSnippet }: DataShowcaseProps) => {
  const exerciseExamples = exercises.slice(0, 6);
  const muscleEntries = Object.entries(muscleMap).slice(0, 4);
  const totalExercises = exercises.length;
  const totalMuscles = new Set(
    Object.values(muscleMap).flatMap((entry) => [...entry.primary, ...entry.synergists])
  ).size;
  const repSchemeCount = (configSnippet.match(/label:/g) ?? []).length;

  const summaryStats = [
    { title: 'Exercises available', value: totalExercises },
    { title: 'Muscles tracked', value: totalMuscles },
    { title: 'Rep scheme presets', value: repSchemeCount }
  ];

  const summaryCards = summaryStats.map((stat) => (
    <div key={stat.title} className="stat-card">
      <strong>{stat.value}</strong>
      <span>{stat.title}</span>
    </div>
  ));

  return (
    <section aria-labelledby="data-title">
      <h2 id="data-title">Data building blocks</h2>
      <div className="stat-grid">{summaryCards}</div>
      <div className="grid two-column">
        <div>
          <h3>Exercise catalog snapshot</h3>
          <ul className="data-list">
            {exerciseExamples.map((exercise) => {
              const mapping = muscleMap[exercise.id];
              const primary = mapping?.primary.slice(0, 2).map(formatMuscleName).join(', ');
              return (
                <li key={exercise.id}>
                  <strong>{exercise.label}</strong>
                  <span> · {exercise.id}</span>
                  {primary ? <small>Primary: {primary}</small> : null}
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h3>Muscle map glimpse</h3>
          <ul className="data-list">
            {muscleEntries.map(([exerciseId, entry]) => (
              <li key={exerciseId}>
                <strong>{exerciseId}</strong>
                <span>
                  {' '}
                  → {entry.primary.map(formatMuscleName).join(', ')} (primary) ·{' '}
                  {entry.synergists.map(formatMuscleName).join(', ')} (assist)
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="code-block" style={{ gridColumn: '1 / -1' }}>
          <h3>Quest config controls</h3>
          <pre>
            <code>{configSnippet}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};

export default DataShowcase;
