import { usePuterStore } from '~/lib/puter';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import gsap from 'gsap';
import { Sparkles, ArrowRight } from 'lucide-react';

export const meta = () => [
  { title: 'AutoRes.AI | Auth' },
  { name: 'description', content: 'Log into your account' },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split('next=')[1];
  const navigate = useNavigate();

  const leftRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);
  }, [auth.isAuthenticated, next]);

  // Intro Animation
  // Intro Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        x: -50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      });

      gsap.from(formRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-brand-dark flex overflow-hidden lg:grid lg:grid-cols-2">
      {/* Left Column: Brand / Visuals */}
      <section className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-card to-brand-dark overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-secondary/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div ref={leftRef}>
          <div className="flex items-center gap-3 mb-20 text-brand-primary/80">
            <Sparkles className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight text-white">AutoRes.AI</span>
          </div>

          <h1 className="text-7xl font-bold leading-tight text-white mb-6">
            Refine Your <br />
            <span className="text-gradient">Professional Story</span>
          </h1>
          <p className="text-xl text-text-muted max-w-md leading-relaxed">
            Join thousands of professionals using AI to optimize their resumes for ATS and land their dream jobs.
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-white/30 font-medium">
          <span>© 2024 AutoRes.AI</span>
          <span>•</span>
          <span>Powered by Puter</span>
        </div>
      </section>

      {/* Right Column: Auth Form */}
      <section className="relative w-full flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="absolute inset-0 bg-[url('/images/bg-auth.svg')] bg-cover opacity-10 pointer-events-none" />

        <div ref={formRef} className="w-full max-w-md space-y-8 glass-card p-10 relative z-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-text-muted">Sign in to access your resume dashboard</p>
          </div>

          <div className="pt-4">
            {isLoading ? (
              <button className="primary-button w-full opacity-70 cursor-wait">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <div className="text-center space-y-4">
                    <p className="text-green-400 font-medium">You are currently logged in</p>
                    <button
                      className="w-full py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-white transition-colors"
                      onClick={auth.signOut}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    className="primary-button w-full group"
                    onClick={auth.signIn}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Sign In with Puter
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                )}
              </>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-text-muted">
              By continuing, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Auth;
