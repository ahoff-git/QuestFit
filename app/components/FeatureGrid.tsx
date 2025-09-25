import type { ReactNode } from 'react';

type Feature = {
  title: string;
  description: string;
  detail: ReactNode;
};

const features: Feature[] = [
  {
    title: 'Quest generation',
    description: 'Balances goals, enjoyment, soreness, recovery, and corrective needs.',
    detail: (
      <ul>
        <li>Filters unsafe movements, weights preferred ones, and keeps variety high.</li>
        <li>Rotates rep schemes to cover strength, muscle, and endurance stimuli.</li>
      </ul>
    )
  },
  {
    title: 'Progression engine',
    description: 'Learns from your recent RPE scores to scale exercises automatically.',
    detail: (
      <ul>
        <li>Rolling averages keep difficulty on target and add decay after missed days.</li>
        <li>Soreness feedback dials load down before fatigue becomes injury.</li>
      </ul>
    )
  },
  {
    title: 'Logging that matters',
    description: 'Captures context so the algorithm can respond with smarter quests.',
    detail: (
      <ul>
        <li>Enjoyment and “felt it in” fields feed preference and misfire logic.</li>
        <li>Notes stay attached to each session for future reviews.</li>
      </ul>
    )
  }
];

const FeatureGrid = () => {
  const featureCards = features.map((feature) => (
    <div key={feature.title}>
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
      {feature.detail}
    </div>
  ));

  return (
    <section aria-labelledby="feature-title">
      <h2 id="feature-title">System pillars</h2>
      <div className="grid two-column">{featureCards}</div>
    </section>
  );
};

export default FeatureGrid;
