const steps = [
  {
    title: 'Check in',
    detail: 'Log fatigue, soreness, and focus so the day’s quest starts in the right lane.'
  },
  {
    title: 'Generate the quest',
    detail: 'Filter unsafe options, weight goals and enjoyment, then pick rep schemes and loads.'
  },
  {
    title: 'Complete & log',
    detail: 'Track sets, RPE, enjoyment, and “felt it in” notes while you train.'
  },
  {
    title: 'Update state',
    detail: 'Refresh progression curves, adjust enjoyment bias, and queue corrective work if needed.'
  }
];

const WorkflowTimeline = () => {
  const timeline = steps.map((step) => (
    <div key={step.title}>
      <strong>{step.title}</strong>
      <span>{step.detail}</span>
    </div>
  ));

  return (
    <section aria-labelledby="workflow-title">
      <h2 id="workflow-title">Quest loop</h2>
      <div className="table-like">{timeline}</div>
    </section>
  );
};

export default WorkflowTimeline;
