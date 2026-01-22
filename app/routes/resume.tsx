
import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useState, useRef } from 'react';
import { usePuterStore } from '~/lib/puter';
import Summary from '~/components/Summary';
import ATS from '~/components/ATS';
import Details from '~/components/Details';
import { ChevronLeft, Download, Share2 } from 'lucide-react';
import gsap from 'gsap';

export const meta = () => [
  { title: 'AutoRes.AI | Review ' },
  { name: 'description', content: 'Detailed overview of your resume' },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);
      console.log({ resumeUrl, imageUrl, feedback: data.feedback });
    };

    loadResume();
  }, [id]);

  // Intro Animation
  // Intro Animation
  useEffect(() => {
    if (imageUrl && feedback) {
      const ctx = gsap.context(() => {
        gsap.from(imageRef.current, {
          x: -50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });

        gsap.from(contentRef.current?.children || [], {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power3.out'
        });
      }, contentRef); // Scope to contentRef or just use cleanup
      return () => ctx.revert();
    }
  }, [imageUrl, feedback]);

  return (
    <main className="min-h-screen bg-brand-dark pt-0">

      {/* Navigation */}
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-white/10 px-4 md:px-8 py-4 mb-8">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium hidden md:inline">Back to Dashboard</span>
            <span className="font-medium md:hidden">Back</span>
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full text-text-muted hover:text-white transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="primary-button !py-2 !px-4 flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Download PDF</span>
                <span className="md:hidden">PDF</span>
              </a>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

          {/* Left Column: Resume Visual */}
          <section className="lg:col-span-4 xl:col-span-5 relative order-2 lg:order-1">
            <div ref={imageRef} className="lg:sticky lg:top-28">
              <div className="glass-card p-2 rounded-xl h-[50vh] lg:h-[80vh] overflow-hidden group">
                {imageUrl ? (
                  <div className="w-full h-full rounded-lg overflow-y-auto scrollbar-hide bg-white/5">
                    <img
                      src={imageUrl}
                      className="w-full h-auto object-contain"
                      alt="Resume Preview"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center animate-pulse">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                  <p className="text-white font-medium">Scroll to View</p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Analysis */}
          <section ref={contentRef} className="lg:col-span-8 xl:col-span-7 space-y-8 order-1 lg:order-2">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold text-white">Analysis Report</h1>
              <p className="text-text-muted">AI-generated insights to improve your resume impact.</p>
            </div>

            {feedback ? (
              <div className="space-y-6">
                {/* Summary Section */}
                <div className="glass-card p-6 md:p-8">
                  <Summary feedback={feedback} />
                </div>

                {/* ATS Section */}
                <div className="glass-card p-6 md:p-8 border-l-4 border-l-brand-secondary">
                  <ATS
                    score={feedback.ATS.score || 0}
                    suggestions={feedback.ATS.tips || []}
                  />
                </div>

                {/* Detailed Breakdown */}
                <div className="glass-card p-6 md:p-8">
                  <Details feedback={feedback} />
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                <img src="/images/resume-scan-2.gif" className="w-48 opacity-80 mix-blend-screen" />
                <p className="text-lg text-text-muted animate-pulse">Analysing document structure and content...</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};
export default Resume;
