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
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        opacity: 0,
        y: 20,
        duration: 1.2,
        ease: 'power3.out'
      });

      gsap.from(formRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="relative min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Visuals (Absolute) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Background Orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-brand-secondary/10 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[url('/images/bg-auth.svg')] bg-cover opacity-10" />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

        {/* Left Side: Text/Brand */}
        <div ref={leftRef} className="text-center lg:text-left space-y-8">
          <div className="flex items-center justify-center lg:justify-start gap-3 text-brand-primary">
            <div className="p-2 bg-brand-primary/10 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AutoRes.AI</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white">
            Refine Your <br />
            <span className="text-gradient">Professional Story</span>
          </h1>

          <p className="text-xl text-text-muted/80 leading-relaxed max-w-lg mx-auto lg:mx-0">
            Join thousands of professionals using AI to optimize their resumes for ATS compatibility and land their dream jobs easier and faster.
          </p>

          <div className="hidden lg:flex items-center gap-6 text-sm text-white/40 font-medium pt-8">
            <span>© 2024 AutoRes.AI</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>Powered by Puter</span>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full flex justify-center lg:justify-end">
          <div ref={formRef} className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-brand-primary/5 relative z-10">
            <div className="text-center space-y-3 mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="text-text-muted">Sign in to access your intelligent resume dashboard</p>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <button className="w-full py-4 px-6 rounded-xl bg-brand-primary/20 border border-brand-primary/20 text-brand-primary font-medium cursor-wait flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating with Puter...</span>
                </button>
              ) : (
                <>
                  {auth.isAuthenticated ? (
                    <div className="text-center space-y-6">
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 font-medium flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        You are currently logged in
                      </div>
                      <button
                        className="w-full py-4 px-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 font-medium"
                        onClick={auth.signOut}
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 text-white font-bold text-lg shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all duration-300 flex items-center justify-center gap-3 group"
                      onClick={auth.signIn}
                    >
                      <span>Sign In with Puter</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-text-muted/60 max-w-xs mx-auto">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
