/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  ClipboardList, 
  Activity, 
  Leaf, 
  ChevronRight, 
  ChevronLeft,
  RefreshCcw,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { IntakeData, FullDiagnosis, ScanResult } from './types';
import { auditDiet, getTreatmentPlan } from './constants';
import { analyzeScalp } from './lib/gemini';

// Sub-components
import Header from './components/Header';
import Hero from './components/Hero';
import IntakeForm from './components/IntakeForm';
import Scanner from './components/Scanner';
import DiagnosisView from './components/DiagnosisView';

type AppState = 'intro' | 'intake' | 'scanner' | 'analyzing' | 'result';

export default function App() {
  const [step, setStep] = useState<AppState>('intro');
  const [intake, setIntake] = useState<IntakeData | null>(null);
  const [diagnosis, setDiagnosis] = useState<FullDiagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIntakeSubmit = (data: IntakeData) => {
    setIntake(data);
    setStep('scanner');
  };

  const handleScanComplete = async (imageBase64: string) => {
    if (!intake) return;
    setStep('analyzing');
    setError(null);

    try {
      const scanResult = await analyzeScalp(imageBase64, intake.age, intake.gender);
      const dietAudit = auditDiet(intake.consumedFoods);
      const treatmentPlan = getTreatmentPlan(scanResult.condition, intake.age);

      setDiagnosis({
        scan: scanResult,
        diet: dietAudit,
        treatment: treatmentPlan
      });
      setStep('result');
    } catch (err) {
      setError("Analysis failed. Please try again.");
      setStep('scanner');
    }
  };

  const resetApp = () => {
    setStep('intro');
    setIntake(null);
    setDiagnosis(null);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-800 font-sans selection:bg-brand-teal-100 italic-selection">
      <Header onLogoClick={resetApp} />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Hero onStart={() => setStep('intake')} />
            </motion.div>
          )}

          {step === 'intake' && (
            <motion.div
              key="intake"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <IntakeForm onSubmit={handleIntakeSubmit} />
            </motion.div>
          )}

          {step === 'scanner' && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <Scanner 
                onCapture={handleScanComplete} 
                onBack={() => setStep('intake')}
              />
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-brand-teal-600 border-t-transparent rounded-full mb-6 shadow-[0_0_15px_rgba(13,148,136,0.3)]"
              />
              <h2 className="text-2xl font-bold text-brand-teal-900 tracking-tight">AI Scalp Analysis active</h2>
              <p className="text-slate-500 mt-2">Checking follicle density and scalp cellular health...</p>
            </motion.div>
          )}

          {step === 'result' && diagnosis && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DiagnosisView 
                diagnosis={diagnosis} 
                user={intake!} 
                onRestart={resetApp} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-20 py-10 border-t border-brand-teal-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-brand-teal-900 font-bold text-sm">
            <ShieldCheck size={20} className="text-brand-teal-600" />
            <span>FolliScan AI Privacy Protocol</span>
          </div>
          <p className="text-slate-400 text-xs text-center md:text-right font-medium">
            © 2026 FolliScan AI • Integrated Neural Analysis • All Data Encrypted
          </p>
        </div>
      </footer>
    </div>
  );
}
