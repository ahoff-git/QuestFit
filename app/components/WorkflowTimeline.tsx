const steps = [
  {
    title: 'Check in',
    detail: 'Athlete records soreness, energy, schedule constraints, and any priorities for the day.',
    outcome: 'QuestFit converts that snapshot into guardrails for the generator.'
  },
  {
    title: 'Generate the quest',
    detail: 'Engine scores every eligible exercise using goals, cooldown windows, and preference data.',
    outcome: 'Picks 3-6 lifts with rep schemes, loads, and focus cues in under two seconds.'
  },
  {
    title: 'Complete & log',
    detail: 'Athlete logs sets, RPE, enjoyment, and misfire notes from mobile or desktop.',
    outcome: 'No extra tooling — everything routes back into the quest engine.'
  },
  {
    title: 'Update state',
    detail: 'QuestFit recalculates rolling difficulty, volume per muscle, and adherence streaks.',
    outcome: 'Next session inherits smarter suggestions without anyone exporting spreadsheets.'
  }
];

const WorkflowTimeline = () => {
  const timeline = steps.map((step) => (
    <div key={step.title}>
      <strong>{step.title}</strong>
      <span>{step.detail}</span>
      <small>{step.outcome}</small>
    </div>
  ));

  return (
    <section aria-labelledby="workflow-title">
      <h2 id="workflow-title">How a daily quest comes together</h2>
      <div className="table-like">{timeline}</div>
    </section>
  );
};

export default WorkflowTimeline;
