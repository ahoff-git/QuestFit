const heroHighlights = [
  'Hook up your exercise catalog and QuestFit handles the daily curation.',
  'Soreness, RPE, and enjoyment feedback loop straight into tomorrow’s plan.',
  'Ship a polished planner experience without wrestling spreadsheets again.'
];

const heroSignals = [
  { value: '90 sec', label: 'Average time to spin up a fresh quest' },
  { value: 'RPE 7', label: 'Difficulty target baked into progression rules' },
  { value: '3-6 lifts', label: 'Configurable quest length per athlete' }
];

const heroActions = [
  { label: 'Launch the planner demo', href: '#quest-planner-title', variant: 'primary' as const },
  { label: 'See rollout checklist', href: '#implementation-guide', variant: 'secondary' as const }
];

const IntroHero = () => {
  const highlightList = heroHighlights.map((item) => (
    <li key={item}>{item}</li>
  ));

  const signalCards = heroSignals.map((signal) => (
    <div key={signal.label} className="metric-card">
      <strong>{signal.value}</strong>
      <span>{signal.label}</span>
    </div>
  ));

  const actionButtons = heroActions.map((action) => (
    <a
      key={action.href}
      href={action.href}
      className={action.variant === 'primary' ? 'primary-button' : 'secondary-button'}
    >
      {action.label}
    </a>
  ));

  return (
    <section aria-labelledby="hero-title" className="hero">
      <span className="badge">QuestFit · Adaptive strength planning</span>
      <h1 id="hero-title">An adaptive coach brain you can drop into your product</h1>
      <p>
        QuestFit keeps athletes in the sweet spot—enough challenge to progress, enough guardrails to
        protect recovery. Bring your own exercises, and the quest engine personalises every session.
      </p>
      <ul>{highlightList}</ul>
      <div className="hero-actions">{actionButtons}</div>
      <div className="hero-metrics">{signalCards}</div>
    </section>
  );
};

export default IntroHero;
