import { cn } from '~/lib/utils';
import { Accordion, AccordionContent, AccordionHeader, AccordionItem, } from "./Accordion";
import { Check, AlertTriangle } from 'lucide-react';

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className={cn(
        'flex flex-row gap-1 items-center px-3 py-1 rounded-full border',
        score > 69
          ? 'bg-green-500/10 border-green-500/20 text-green-400'
          : score > 39
            ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400',
      )}
    >
      {score > 69 ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
      <p className="text-xs font-bold">
        {score}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex flex-row gap-4 items-center py-2 text-white">
      <p className="text-lg font-semibold">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: 'good' | 'improve'; tip: string; explanation: string }[];
}) => {
  return (
    <div className="flex flex-col gap-6 items-center w-full pt-4">
      {/* Quick Tips Grid */}
      <div className="bg-white/5 w-full rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 border border-white/5">
        {tips.map((tip, index) => (
          <div className="flex flex-row gap-3 items-center" key={index}>
            <div className={`p-1.5 rounded-full ${tip.type === 'good' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {tip.type === 'good' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
            <p className="text-sm font-medium text-gray-300">{tip.tip}</p>
          </div>
        ))}
      </div>

      {/* Detailed Cards */}
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index + tip.tip}
            className={cn(
              'flex flex-col gap-2 rounded-xl p-5 border transition-all hover:bg-white/5',
              tip.type === 'good'
                ? 'bg-green-500/5 border-green-500/20'
                : 'bg-yellow-500/5 border-yellow-500/20',
            )}
          >
            <div className="flex flex-row gap-3 items-center">
              {tip.type === 'good' ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              )}
              <p className={`text-lg font-semibold ${tip.type === 'good' ? 'text-green-400' : 'text-yellow-400'}`}>
                {tip.tip}
              </p>
            </div>
            <p className="text-text-muted text-sm leading-relaxed pl-8">{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="flex flex-col gap-4 w-full text-white">
      <Accordion>
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
