import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, User, Moon, Zap, Utensils } from 'lucide-react';
import { IntakeData } from '../types';

interface IntakeFormProps {
  onSubmit: (data: IntakeData) => void;
}

export default function IntakeForm({ onSubmit }: IntakeFormProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<IntakeData>>({
    age: 25,
    gender: 'Male',
    sleepHours: 7,
    stressLevel: 5,
    dietType: 'Standard',
    consumedFoods: []
  });

  const [currentFood, setCurrentFood] = useState('');

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const addFood = () => {
    if (currentFood.trim()) {
      setData(prev => ({
        ...prev,
        consumedFoods: [...(prev.consumedFoods || []), currentFood.trim()]
      }));
      setCurrentFood('');
    }
  };

  const steps = [
    {
      title: "Patient Profile",
      icon: <User size={24} />,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 italic">Biological Age</label>
            <input 
              type="number" 
              value={Number.isNaN(data.age) ? '' : data.age} 
              onChange={e => setData({...data, age: e.target.value === '' ? NaN : parseInt(e.target.value)})}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-brand-teal-600 focus:border-transparent outline-none transition-all p-4 bg-slate-50/50 font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 italic">Biological Sex</label>
            <div className="grid grid-cols-2 gap-3">
              {['Male', 'Female'].map(g => (
                <button
                  key={g}
                  onClick={() => setData({...data, gender: g})}
                  className={`py-4 rounded-2xl border font-bold transition-all ${data.gender === g ? 'bg-brand-teal-600 border-brand-teal-600 text-white shadow-lg shadow-brand-teal-600/30' : 'bg-white border-slate-200 text-slate-600 hover:border-brand-teal-200 hover:bg-slate-50'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Neural Vitals",
      icon: <Moon size={24} />,
      content: (
        <div className="space-y-8">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Circadian Sleep (Hours)</label>
            <div className="flex items-center gap-6">
              <input 
                type="range" min="3" max="12" step="1"
                value={Number.isNaN(data.sleepHours) ? 7 : data.sleepHours} 
                onChange={e => setData({...data, sleepHours: parseInt(e.target.value) || 0})}
                className="flex-1 accent-brand-teal-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-16 h-12 flex items-center justify-center bg-brand-teal-50 border border-brand-teal-100 rounded-xl font-bold text-brand-teal-900">{data.sleepHours}h</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Cortisol/Stress Index (1-10)</label>
            <div className="flex items-center gap-6">
              <input 
                type="range" min="1" max="10" step="1"
                value={Number.isNaN(data.stressLevel) ? 5 : data.stressLevel} 
                onChange={e => setData({...data, stressLevel: parseInt(e.target.value) || 0})}
                className="flex-1 accent-brand-teal-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-16 h-12 flex items-center justify-center bg-brand-teal-50 border border-brand-teal-100 rounded-xl font-bold text-brand-teal-900">{data.stressLevel}/10</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Nutrient Audit",
      icon: <Utensils size={24} />,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 italic">Last 24h Intake Logs</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Salmon, Spinach, Pumpkin Seeds..."
                value={currentFood}
                onChange={e => setCurrentFood(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && addFood()}
                className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-brand-teal-600 outline-none bg-slate-50/50 font-bold text-slate-800"
              />
              <button 
                onClick={addFood}
                className="px-6 py-4 bg-brand-teal-100 text-brand-teal-700 rounded-2xl font-bold hover:bg-brand-teal-200 transition-all font-mono shadow-sm"
              >
                LOG
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {data.consumedFoods?.map((food, i) => (
                <span key={i} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-bold flex items-center gap-2 shadow-sm uppercase tracking-widest hover:border-red-200 hover:text-red-600 transition-colors cursor-default group">
                  {food}
                  <button onClick={() => setData({...data, consumedFoods: data.consumedFoods?.filter((_, idx) => idx !== i)})} className="opacity-40 group-hover:opacity-100">×</button>
                </span>
              ))}
              {data.consumedFoods?.length === 0 && (
                <div className="w-full py-10 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 text-sm font-medium">Add foods to begin nutrient audit...</div>
              )}
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal-50 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-12 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand-teal-50 text-brand-teal-600 rounded-2xl flex items-center justify-center shadow-sm border border-brand-teal-100">
            {steps[step].icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-none mb-1.5">{steps[step].title}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Diagnostic Phase {step + 1} of {steps.length}</p>
          </div>
        </div>
        
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${i <= step ? 'bg-brand-teal-600' : 'bg-slate-100'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[280px] relative z-10"
        >
          {steps[step].content}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-12 relative z-10">
        <button
          onClick={prev}
          disabled={step === 0}
          className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        
        {step < steps.length - 1 ? (
          <button
            onClick={next}
            className="flex items-center gap-2 px-10 py-4 bg-brand-teal-900 text-white rounded-2xl font-bold shadow-xl shadow-brand-teal-900/10 hover:translate-x-1 transition-all"
          >
            Phase Complete
            <ChevronRight size={20} />
          </button>
        ) : (
          <button
            onClick={() => onSubmit(data as IntakeData)}
            className="flex items-center gap-3 px-12 py-5 bg-brand-teal-600 text-white rounded-2xl font-bold shadow-2xl shadow-brand-teal-600/30 hover:bg-brand-teal-700 hover:scale-[1.02] transition-all"
          >
            Start Neural Scan
            <Zap size={22} fill="white" />
          </button>
        )}
      </div>
    </div>
  );
}
