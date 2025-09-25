import DataShowcase from '@/app/components/DataShowcase';
import DesignPrinciples from '@/app/components/DesignPrinciples';
import FeatureGrid from '@/app/components/FeatureGrid';
import IntroHero from '@/app/components/IntroHero';
import WorkflowTimeline from '@/app/components/WorkflowTimeline';
import { loadExerciseList, loadMuscleMap, loadQuestConfigExcerpt } from '@/lib/data-loader';

const HomePage = async () => {
  const [exercises, muscleMap, configSnippet] = await Promise.all([
    loadExerciseList(),
    loadMuscleMap(),
    loadQuestConfigExcerpt()
  ]);

  return (
    <>
      <IntroHero />
      <FeatureGrid />
      <WorkflowTimeline />
      <DataShowcase
        exercises={exercises}
        muscleMap={muscleMap}
        configSnippet={configSnippet}
      />
      <DesignPrinciples />
    </>
  );
};

export default HomePage;
