import { Link, useLocation } from 'react-router';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Home, Upload, Sparkles } from 'lucide-react';

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        delay: 0.5
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav ref={navRef} className="navbar">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-brand-primary/20 p-2 rounded-lg group-hover:bg-brand-primary/30 transition-colors">
          <Sparkles className="w-5 h-5 text-brand-primary" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">
          AutoRes<span className="text-brand-primary">.AI</span>
        </span>
      </Link>

      <div className="flex items-center gap-8">
        <Link
          to="/"
          className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${isActive('/') ? 'text-white' : 'text-text-muted'
            }`}
        >
          <Home className="w-4 h-4" />
          Home
        </Link>

        <Link
          to="/upload"
          className="primary-button flex items-center gap-2 !py-2 !px-6 text-sm"
        >
          <Upload className="w-4 h-4" />
          Analyze Resume
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;