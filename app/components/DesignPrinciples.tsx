const principles = [
  {
    title: 'Modular by design',
    description: 'Quest generation leans on config files and data tables, so tuning is editing JSON, not code.'
  },
  {
    title: 'Stateful yet portable',
    description: 'Local-first storage today, easy to swap to SQLite or Supabase without rewriting UI.'
  },
  {
    title: 'Readable intelligence',
    description: 'Progression rules stay close to the data they influence, making adjustments safe and transparent.'
  }
];

const DesignPrinciples = () => {
  const principleItems = principles.map((principle) => (
    <li key={principle.title}>
      <strong>{principle.title}.</strong> {principle.description}
    </li>
  ));

  return (
    <section aria-labelledby="principles-title">
      <h2 id="principles-title">Why it stays flexible</h2>
      <ul>{principleItems}</ul>
    </section>
  );
};

export default DesignPrinciples;
