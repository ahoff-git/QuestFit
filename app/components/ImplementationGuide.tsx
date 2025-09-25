const steps = [
  {
    title: 'Wire in your catalog',
    description: 'Swap the sample JSON in /data with your exercise IDs and muscle mappings.',
    outcome: 'QuestFit immediately understands how to balance volume across your movements.'
  },
  {
    title: 'Tune guardrails',
    description: 'Adjust quest_config.ts to match the loads, rep ranges, and cooldown rules your program expects.',
    outcome: 'Difficulty adjustments stay within bounds you trust.'
  },
  {
    title: 'Embed the planner',
    description: 'Drop <QuestPlanner /> into your product shell and connect usePersistentState to your storage.',
    outcome: 'Athletes get the full daily quest flow with zero spreadsheet exports.'
  },
  {
    title: 'Automate feedback loops',
    description: 'Pipe enjoyment, soreness, and performance data back to your analytics stack.',
    outcome: 'Keep iterating on training bias without touching the UI.'
  }
];

const ImplementationGuide = () => {
  const stepItems = steps.map((step) => (
    <li key={step.title}>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
      <span>{step.outcome}</span>
    </li>
  ));

  return (
    <section aria-labelledby="implementation-guide-title" id="implementation-guide">
      <h2 id="implementation-guide-title">Roll it out in an afternoon</h2>
      <ol className="guide-list">{stepItems}</ol>
      <p className="guide-footnote">
        Need a deeper integration? Fork the repo, connect to Supabase or SQLite, and reuse the same quest engine rules.
      </p>
    </section>
  );
};

export default ImplementationGuide;
