import ScoreGauge from '~/components/ScoreGauge';
import ScoreBadge from '~/components/ScoreBadge';

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 70
      ? 'text-green-400'
      : score > 49
        ? 'text-yellow-400'
        : 'text-red-400';

  return (
    <div className="w-full">
      <div className="flex flex-row gap-2 items-center bg-white/5 rounded-xl p-4 w-full justify-between hover:bg-white/10 transition-colors">
        <div className="flex flex-row gap-3 items-center">
          <p className="text-lg font-medium text-white">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-xl font-bold">
          <span className={textColor}>{score}</span>/100
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8 border-b border-white/10 pb-8">
        <ScoreGauge score={feedback.overallScore} />

        <div className="flex flex-col gap-2 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white">Your Resume Score</h2>
          <p className="text-sm text-text-muted">
            This score is calculated based on Tone, Content, Structure, and Skills.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
        <Category title="Content" score={feedback.content.score} />
        <Category title="Structure" score={feedback.structure.score} />
        <Category title="Skills" score={feedback.skills.score} />
      </div>
    </div>
  );
};
export default Summary;
