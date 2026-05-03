import { Leaf, Stethoscope } from 'lucide-react';

interface HeaderProps {
  onLogoClick: () => void;
}

export default function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-brand-teal-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button 
          id="logo-btn"
          onClick={onLogoClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-brand-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-teal-600/20">
            <Leaf size={22} />
          </div>
          <span className="font-bold text-xl tracking-tight text-brand-teal-900 italic">FolliScan<span className="text-brand-teal-600 font-medium not-italic">AI</span></span>
        </button>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-bold text-slate-500 hover:text-brand-teal-600 transition-colors uppercase tracking-wider">Dashboard</a>
          <a href="#" className="text-sm font-bold text-slate-500 hover:text-brand-teal-600 transition-colors uppercase tracking-wider">Intake</a>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2 text-xs font-bold text-brand-teal-700 bg-brand-teal-100/50 px-4 py-2 rounded-full border border-brand-teal-100 uppercase tracking-widest">
            <Stethoscope size={14} />
            Clinical Grade
          </div>
        </nav>
      </div>
    </header>
  );
}
