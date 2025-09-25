const heroHighlights = [
  'Adaptive daily quests tuned to your goals and recovery',
  'Rolling RPE intelligence that nudges difficulty up or down',
  'Mobile-first logging so every set and note lives in one place'
];

const IntroHero = () => {
  const highlightList = heroHighlights.map((item) => (
    <li key={item}>{item}</li>
  ));

  return (
    <section aria-labelledby="hero-title">
      <span className="badge">QuestFit · Next.js</span>
      <h1 id="hero-title">Turn training into quests you actually want to finish</h1>
      <p>
        QuestFit balances enjoyment, fatigue, and progression to build a training plan that feels
        like a quest log. No spreadsheets. No second-guessing. Just smart suggestions and a clean
        log to keep the story going.
      </p>
      <ul>{highlightList}</ul>
    </section>
  );
};

export default IntroHero;
