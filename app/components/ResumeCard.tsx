import { Link } from 'react-router';
import ScoreCircle from '~/components/ScoreCircle';
import { useEffect, useState, useRef } from 'react';
import { usePuterStore } from '~/lib/puter';
import gsap from 'gsap';
import { ExternalLink, Building2, Briefcase } from 'lucide-react';

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState('');
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };

    loadResume();
  }, [imagePath]);

  // Hover Animation
  const onMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -10,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
      boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.3)'
    });
  };

  const onMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
      boxShadow: 'none'
    });
  };

  return (
    <Link
      to={`/resume/${id}`}
      ref={cardRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="glass-card flex flex-col p-5 gap-6 h-[480px] w-full"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1 pr-4">
          <div className="flex items-center gap-2 text-brand-primary">
            <Building2 className="w-4 h-4" />
            <h2 className="font-bold text-white truncate max-w-[200px]">
              {companyName || 'Unknown Company'}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <Briefcase className="w-4 h-4" />
            <h3 className="text-sm truncate max-w-[200px]">
              {jobTitle || 'No Title Provided'}
            </h3>
          </div>
        </div>
        <ScoreCircle score={feedback.overallScore} />
      </div>

      <div className="relative flex-1 rounded-xl overflow-hidden border border-white/10 bg-black/50 group">
        {resumeUrl ? (
          <img
            src={resumeUrl}
            alt="resume preview"
            className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5 animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin"></div>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 pointer-events-none" />

        <div className="absolute bottom-4 right-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
          <div className="bg-white text-brand-dark rounded-full p-2">
            <ExternalLink className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
};
export default ResumeCard;
