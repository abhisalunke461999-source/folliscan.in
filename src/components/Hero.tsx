import { motion } from 'motion/react';
import { Camera, ChevronRight, Activity, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8 px-4 py-1.5 rounded-full bg-brand-teal-50 border border-brand-teal-100 text-brand-teal-700 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2"
      >
        <Zap size={14} fill="currentColor" />
        FolliScan Core v2.4 Active
      </motion.div>
      
      <h1 className="text-5xl md:text-7xl font-bold text-slate-800 tracking-tighter leading-[0.9] mb-8 font-display italic">
        Hair Restoration <br />
        <span className="text-brand-teal-600 not-italic">Powered by AI.</span>
      </h1>
      
      <p className="text-lg text-slate-500 max-w-2xl mb-12 leading-relaxed font-medium">
        Professional-grade scalp analysis from the comfort of your home. 
        Detect thinning patterns, audit your nutrition, and build a growth protocol.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-20">
        <button 
          id="get-started-btn"
          onClick={onStart}
          className="px-10 py-5 bg-brand-teal-600 text-white rounded-2xl font-bold shadow-xl shadow-brand-teal-600/30 hover:bg-brand-teal-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-lg"
        >
          Begin Case Analysis
          <ChevronRight size={22} />
        </button>
        <button 
          className="px-10 py-5 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all text-lg shadow-sm"
        >
          View Case ID #FSC
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {[
          { icon: <Camera />, title: "Pattern Mapping", desc: "Computer vision follicle tracking" },
          { icon: <Activity />, title: "Nutrient Audit", desc: "Trace mineral gap analysis" },
          { icon: <ShieldCheck />, title: "HIPAA Compliant", desc: "Encrypted health-data standards" },
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm text-left hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 text-brand-teal-600 mb-6 bg-brand-teal-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{feature.icon}</div>
            <h3 className="font-bold text-slate-800 mb-2 text-lg">{feature.title}</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
