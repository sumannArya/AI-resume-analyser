import type { Route } from './+types/home';
import Navbar from '~/components/Navbar';
import ResumeCard from '~/components/ResumeCard';
import { usePuterStore } from '~/lib/puter';
import { Link, useNavigate } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Upload, FileText, ArrowRight } from 'lucide-react';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'AutoRes.AI | Dashboard' },
    { name: 'description', content: 'Track your resume ATS scores' },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // Animation Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list('resume:*', true)) as KVItem[];
      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume,
      );
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(heroRef.current?.children || [], {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
      });

      // Grid Animation (runs when loading finishes)
      if (!loadingResumes && resumes.length > 0) {
        gsap.from(gridRef.current?.children || [], {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(1.2)'
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loadingResumes, resumes.length]);

  return (
    <main ref={containerRef} className="relative min-h-screen">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2" />

      <Navbar />

      <section className="container mx-auto px-4 pb-12 pt-24 md:pb-20 md:pt-32">
        {/* Header Section */}
        <div ref={heroRef} className="flex flex-col items-center text-center mb-10 md:mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm font-medium text-brand-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            AI-Powered Resume Analysis
          </div>

          <h1 className="max-w-4xl text-4xl md:text-6xl font-bold leading-tight">
            Track Your Applications & <br />
            <span className="text-gradient">Optimize Your Score</span>
          </h1>

          {!loadingResumes && resumes?.length === 0 ? (
            <p className="max-w-2xl text-lg md:text-xl text-text-muted px-4">
              Upload your first resume to get instant feedback on ATS compatibility, tone, and content.
            </p>
          ) : (
            <p className="max-w-2xl text-lg md:text-xl text-text-muted">
              Review your submissions and check AI-powered feedback.
            </p>
          )}
        </div>

        {/* Loading State */}
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-primary rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-6 text-text-muted animate-pulse">Scanning database...</p>
          </div>
        )}

        {/* Content Grid */}
        {!loadingResumes && resumes.length > 0 && (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10">
            <Link
              to="/upload"
              className="group relative inline-flex h-14 md:h-16 items-center justify-center overflow-hidden rounded-full bg-brand-primary px-8 md:px-10 font-medium text-white transition-all duration-300 hover:w-64 hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            >
              <div className="inline-flex items-center gap-3 transition-all duration-300 group-hover:gap-4">
                <Upload className="h-5 w-5 md:h-6 md:w-6" />
                <span className="text-lg md:text-xl">Upload Resume</span>
                <ArrowRight className="h-0 w-0 opacity-0 transition-all duration-300 group-hover:h-6 group-hover:w-6 group-hover:opacity-100" />
              </div>
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
