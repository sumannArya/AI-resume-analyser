import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Suggestion {
  type: 'good' | 'improve';
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine background gradient based on score (Dark Mode Versions)
  const gradientClass =
    score > 69
      ? 'from-green-500/10 border-green-500/20'
      : score > 49
        ? 'from-yellow-500/10 border-yellow-500/20'
        : 'from-red-500/10 border-red-500/20';

  const textClass =
    score > 69
      ? 'text-green-400'
      : score > 49
        ? 'text-yellow-400'
        : 'text-red-400';

  const subtitle =
    score > 69 ? 'Great Job!' : score > 49 ? 'Good Start' : 'Needs Improvement';

  return (
    <div
      className={`bg-gradient-to-b ${gradientClass} border border-transparent rounded-2xl w-full p-2`}
    >
      {/* Top section */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-full bg-white/5 ${textClass}`}>
          {score > 69 ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">ATS Score: <span className={textClass}>{score}/100</span></h2>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6">
        <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>{subtitle}</h3>
        <p className="text-text-muted mb-6">
          How well your resume parses in Applicant Tracking Systems.
        </p>

        {/* Suggestions list */}
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
              {suggestion.type === 'good' ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 text-yellow-400 shrink-0" />
              )}
              <p className="text-gray-300 text-sm">
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-text-muted text-sm italic">
        * Optimization Tip: Use standard headings and simple layouts for best results.
      </p>
    </div>
  );
};

export default ATS;
