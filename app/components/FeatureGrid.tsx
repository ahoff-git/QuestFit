import type { ReactNode } from 'react';

type Feature = {
  title: string;
  description: string;
  detail: ReactNode;
};

const features: Feature[] = [
  {
    title: 'Adaptive quest builder',
    description: 'Generate a full-day prescription in seconds based on today’s check-in.',
    detail: (
      <ul>
        <li>Cooldown windows and soreness tags prevent overloading fatigued muscle groups.</li>
        <li>Rep scheme presets keep volume balanced across strength, hypertrophy, and skill work.</li>
      </ul>
    )
  },
  {
    title: 'Progression autopilot',
    description: 'Rolling RPE, enjoyment, and attendance data drive intelligent load changes.',
    detail: (
      <ul>
        <li>Configurable increase/decrease caps stop jumps from outrunning technique.</li>
        <li>Missed days trigger gentle deloads so athletes ease back in without guesswork.</li>
      </ul>
    )
  },
  {
    title: 'Context-rich logging',
    description: 'Capture what mattered during the session and surface it in future quests.',
    detail: (
      <ul>
        <li>“Felt it in” tags tune misfire detection and corrective suggestions.</li>
        <li>Notes stay attached to history, giving coaches clarity without extra tooling.</li>
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
      <h2 id="feature-title">Why teams drop QuestFit into their stack</h2>
      <div className="grid two-column">{featureCards}</div>
    </section>
  );
};

export default FeatureGrid;
