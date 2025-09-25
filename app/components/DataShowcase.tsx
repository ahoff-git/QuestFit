import type { Exercise, MuscleMap } from '@/lib/data-loader';

type DataShowcaseProps = {
  exercises: Exercise[];
  muscleMap: MuscleMap;
  configSnippet: string;
};

const DataShowcase = ({ exercises, muscleMap, configSnippet }: DataShowcaseProps) => {
  const exerciseExamples = exercises.slice(0, 6);
  const muscleEntries = Object.entries(muscleMap).slice(0, 4);

  return (
    <section aria-labelledby="data-title">
      <h2 id="data-title">Data building blocks</h2>
      <div className="grid two-column">
        <div>
          <h3>Exercises (sample)</h3>
          <ul>
            {exerciseExamples.map((exercise) => (
              <li key={exercise.id}>
                <strong>{exercise.label}</strong>
                <span> · {exercise.id}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Muscle map glimpse</h3>
          <ul>
            {muscleEntries.map(([exerciseId, entry]) => (
              <li key={exerciseId}>
                <strong>{exerciseId}</strong>
                <span>
                  {' '}
                  → {entry.primary.join(', ')} (primary) · {entry.synergists.join(', ')} (assist)
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="code-block" style={{ gridColumn: '1 / -1' }}>
          <h3>Quest config</h3>
          <pre>
            <code>{configSnippet}</code>
          </pre>
        </div>
      </div>
    </section>
  );
};

export default DataShowcase;
