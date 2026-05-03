import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Utensils, 
  Stethoscope, 
  Zap, 
  Download, 
  Share2,
  Calendar,
  Waves,
  FlaskConical,
  RefreshCcw,
  Sparkles
} from 'lucide-react';
import { FullDiagnosis, IntakeData } from '../types';
import { CONDITION_DETAILS } from '../constants';

interface DiagnosisViewProps {
  diagnosis: FullDiagnosis;
  user: IntakeData;
  onRestart: () => void;
}

export default function DiagnosisView({ diagnosis, user, onRestart }: DiagnosisViewProps) {
  const details = CONDITION_DETAILS[diagnosis.scan.condition];

  return (
    <div className="space-y-8 pb-20">
      {/* Summary Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal-50 rounded-full -mr-32 -mt-32 opacity-40 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="px-4 py-1.5 rounded-full bg-brand-teal-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-brand-teal-600/20">
              <Sparkles size={14} />
              Diagnostic Complete
            </span>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Case #FSC-{(Math.random() * 10000).toFixed(0)}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight tracking-tight font-display italic">{details.title}</h1>
          <p className="text-slate-500 mb-10 max-w-2xl leading-relaxed text-lg font-medium">{details.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diagnosis.scan.observations.map((obs, i) => (
              <div key={i} className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 border-l-4 border-l-brand-teal-600">
                <CheckCircle2 className="text-brand-teal-600 flex-shrink-0" size={20} />
                <span className="text-sm font-bold text-slate-700">{obs}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Diet Audit */}
        <section className="md:col-span-12 lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center border border-slate-100">
              <Utensils size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Nutrient Gaps</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Bio-Trace Audit</p>
            </div>
          </div>

          <div className="space-y-8 flex-1">
            {diagnosis.diet.missingNutrients.map((n, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-3">
                  <span className="text-slate-500">{n}</span>
                  <span className={i === 0 ? "text-red-500" : "text-amber-500"}>{i === 0 ? "Deficient" : "Low"}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: i === 0 ? "25%" : "50%" }}
                    className={`h-full ${i === 0 ? "bg-red-400" : "bg-amber-400"}`} 
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Foods to Prioritize</h3>
              <div className="flex flex-wrap gap-2">
                {diagnosis.diet.foodsToAdd.map((food, i) => (
                  <span key={i} className="px-3 py-1.5 bg-brand-teal-50 border border-brand-teal-100 text-brand-teal-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">{food}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Treatment Protocol */}
        <section className="md:col-span-12 lg:col-span-7 bg-brand-teal-900 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-brand-teal-900/20">
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 text-brand-teal-400 rounded-2xl flex items-center justify-center border border-white/5 backdrop-blur-md">
                <Stethoscope size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Personalized Protocol</h2>
                <p className="text-[10px] text-brand-teal-400 font-bold uppercase tracking-[0.25em]">Phase 1: Induction (Wk 1-4)</p>
              </div>
            </div>
            <span className="text-[10px] bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 font-bold uppercase tracking-widest">Protocol v2.4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
              <p className="text-brand-teal-300 text-[10px] font-bold uppercase tracking-widest mb-3">Topical Solution</p>
              <p className="text-sm font-medium leading-relaxed opacity-90 italic">"{diagnosis.treatment.topical.join(', ')}"</p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
              <p className="text-brand-teal-300 text-[10px] font-bold uppercase tracking-widest mb-3">Maintenance</p>
              <p className="text-sm font-medium leading-relaxed opacity-90 italic">"{diagnosis.treatment.maintenance.join(', ')}"</p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors md:col-span-2">
              <p className="text-brand-teal-300 text-[10px] font-bold uppercase tracking-widest mb-3">Supplementary Support</p>
              <div className="flex flex-wrap gap-2">
                {diagnosis.treatment.supplements.map((sub, i) => (
                  <span key={i} className="px-3 py-1 bg-brand-teal-600/30 border border-brand-teal-600/50 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">{sub}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Action Bar */}
      <footer className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 bg-white p-6 rounded-3xl border border-slate-200">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-brand-teal-100 flex items-center justify-center text-brand-teal-600 italic font-display">H</div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Cellular Density</p>
            <p className="text-lg font-bold text-slate-800">Normal</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-50 border border-red-100">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold">!</div>
          <div>
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-0.5">Shedding Phase</p>
            <p className="text-lg font-bold text-red-600">Telogen</p>
          </div>
        </div>
        
        <div className="md:col-span-2 flex items-center justify-end gap-3">
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all text-sm uppercase tracking-widest">
            <Download size={18} />
            PDF
          </button>
          <button 
            onClick={onRestart}
            className="flex items-center gap-3 px-8 py-4 bg-brand-teal-600 text-white rounded-2xl font-bold hover:bg-brand-teal-700 transition-all shadow-xl shadow-brand-teal-600/20 text-sm uppercase tracking-widest"
          >
            <RefreshCcw size={18} />
            Reset Case
          </button>
        </div>
      </footer>
    </div>
  );
}
