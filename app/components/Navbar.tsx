import { Link, useLocation, useNavigate } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Home, Upload, Sparkles, LogOut, Menu, X } from 'lucide-react';
import { usePuterStore } from '~/lib/puter';

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { auth: { signOut } } = usePuterStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
    setIsMenuOpen(false);
  };

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
    <nav ref={navRef} className="navbar relative z-50">
      <div className="flex items-center justify-between w-full">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-brand-primary/20 p-2 rounded-lg group-hover:bg-brand-primary/30 transition-colors">
            <Sparkles className="w-5 h-5 text-brand-primary" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            AutoRes<span className="text-brand-primary">.AI</span>
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-text-muted hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-white ${isActive('/') ? 'text-white' : 'text-text-muted'}`}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white text-text-muted hover:bg-brand-white/5 px-3 py-1.5 rounded-lg cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

          <Link
            to="/upload"
            className="primary-button flex items-center gap-2 !py-2 !px-6 text-sm"
          >
            <Upload className="w-4 h-4" />
            Analyze Resume
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-brand-dark/95 backdrop-blur-xl border-b border-white/10 p-4 md:hidden flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 ${isActive('/') ? 'text-white bg-white/5' : 'text-text-muted'}`}
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link
            to="/upload"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 text-text-muted hover:text-white"
          >
            <Upload className="w-5 h-5" />
            Analyze Resume
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 text-text-muted hover:text-white text-left w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;