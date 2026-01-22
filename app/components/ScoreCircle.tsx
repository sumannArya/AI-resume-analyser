import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const ScoreCircle = ({ score = 0 }: { score: number }) => {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const progress = score / 100;
    const strokeDashoffset = circumference * (1 - progress);

    // Animate Stroke
    if (circleRef.current) {
      gsap.fromTo(circleRef.current,
        { strokeDashoffset: circumference },
        { strokeDashoffset: strokeDashoffset, duration: 2, ease: "power4.out" }
      );
    }

    // Animate Number
    if (textRef.current) {
      gsap.fromTo(textRef.current,
        { innerText: 0 },
        {
          innerText: score,
          duration: 2,
          snap: { innerText: 1 },
          ease: "power4.out"
        }
      );
    }
  }, [score, circumference]);

  // Color logic based on score
  const getGradientId = () => {
    if (score >= 80) return "grad-high";
    if (score >= 50) return "grad-med";
    return "grad-low";
  };

  return (
    <div className="relative w-[100px] h-[100px] flex items-center justify-center">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        className="transform -rotate-90 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
          fill="transparent"
        />

        <defs>
          <linearGradient id="grad-high" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>

          <linearGradient id="grad-med" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>

          <linearGradient id="grad-low" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>

        {/* Progress circle */}
        <circle
          ref={circleRef}
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke={`url(#${getGradientId()})`}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference} // Initial State
          strokeLinecap="round"
        />
      </svg>

      {/* Score Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-baseline">
          <span ref={textRef} className="text-2xl font-bold text-white">0</span>
          <span className="text-xs text-text-muted font-medium">/100</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreCircle;
