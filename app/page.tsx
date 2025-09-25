import DataShowcase from '@/app/components/DataShowcase';
import FeatureGrid from '@/app/components/FeatureGrid';
import IntroHero from '@/app/components/IntroHero';
import ValueCallouts from '@/app/components/ValueCallouts';
import QuestPlanner from '@/app/components/QuestPlanner';
import WorkflowTimeline from '@/app/components/WorkflowTimeline';
import ImplementationGuide from '@/app/components/ImplementationGuide';
import { loadExerciseList, loadMuscleMap, loadQuestConfigExcerpt } from '@/lib/data-loader';
import { questConfig } from '@/lib/quest-config';
import { defaultDailyCheckIn, sampleLogs, sampleUserProfile } from '@/lib/sample-data';

const HomePage = async () => {
  const [exercises, muscleMap, configSnippet] = await Promise.all([
    loadExerciseList(),
    loadMuscleMap(),
    loadQuestConfigExcerpt()
  ]);

  return (
    <>
      <IntroHero />
      <ValueCallouts logs={sampleLogs} userProfile={sampleUserProfile} config={questConfig} />
      <FeatureGrid />
      <WorkflowTimeline />
      <QuestPlanner
        exercises={exercises}
        muscleMap={muscleMap}
        logs={sampleLogs}
        config={questConfig}
        userProfile={sampleUserProfile}
        initialCheckIn={defaultDailyCheckIn}
      />
      <DataShowcase
        exercises={exercises}
        muscleMap={muscleMap}
        configSnippet={configSnippet}
      />
      <ImplementationGuide />
    </>
  );
};

export default HomePage;
