import type { QuestConfig, UserProfile, WorkoutLog } from '@/lib/domain-types';
import { formatList, formatMuscleName } from '@/lib/format';
import { average } from '@/lib/math';

type ValueCalloutsProps = {
  logs: WorkoutLog[];
  userProfile: UserProfile;
  config: QuestConfig;
};

const ValueCallouts = ({ logs, userProfile, config }: ValueCalloutsProps) => {
  const sessionsCaptured = logs.length;
  const enjoymentAverage = average(logs.map((log) => log.enjoyment));
  const difficultyAverage = average(logs.map((log) => log.difficulty));
  const focusMuscles = userProfile.goals.map(formatMuscleName);

  const callouts = [
    {
      title: 'Sessions captured',
      value: `${sessionsCaptured}`,
      description: `Every set, rep, and rating is ready for the quest engine — currently averaging ${enjoymentAverage.toFixed(1)}/5 enjoyment.`
    },
    {
      title: 'Difficulty trend',
      value: `RPE ${difficultyAverage.toFixed(1)}`,
      description: `QuestFit tunes toward the target RPE ${config.difficultyTarget} while respecting soreness and deload rules.`
    },
    {
      title: 'Priority muscles',
      value: focusMuscles.length > 0 ? focusMuscles.join(' • ') : 'Set your priorities',
      description: focusMuscles.length > 0
        ? `Daily quests rotate focus across ${formatList(focusMuscles)} without breaking cooldown windows.`
        : 'Add goal muscles to let quests bias toward what matters most.'
    }
  ];

  const calloutCards = callouts.map((callout) => (
    <article key={callout.title} className="value-card">
      <h3>{callout.title}</h3>
      <strong>{callout.value}</strong>
      <p>{callout.description}</p>
    </article>
  ));

  return (
    <section aria-labelledby="value-title">
      <h2 id="value-title">What the engine is already tracking for you</h2>
      <div className="value-grid">{calloutCards}</div>
    </section>
  );
};

export default ValueCallouts;
