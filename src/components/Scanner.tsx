import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, ChevronLeft, RefreshCcw, Zap, FlaskConical, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScannerProps {
  onCapture: (imageBase64: string) => void;
  onBack: () => void;
}

const DEMO_SAMPLES = [
  { 
    id: 'healthy', 
    name: 'Normal Dermal Density', 
    condition: 'Healthy',
    url: 'https://picsum.photos/seed/scalp-h1/800/600',
    desc: 'Full follicular units, no inflammation.'
  },
  { 
    id: 'thinning', 
    name: 'Pattern Thinning (Stage 2)', 
    condition: 'Androgenetic Alopecia',
    url: 'https://picsum.photos/seed/scalp-t2/800/600',
    desc: 'Miniaturization of follicles at the vertex.'
  },
  { 
    id: 'inflamed', 
    name: 'Dermal Inflammation', 
    condition: 'Seborrheic Dermatitis',
    url: 'https://picsum.photos/seed/scalp-i3/800/600',
    desc: 'Redness and scaling visible at root interface.'
  }
];

export default function Scanner({ onCapture, onBack }: ScannerProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showDemoLab, setShowDemoLab] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showDemoLab) startCamera();
    return () => stopCamera();
  }, [showDemoLab]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadDemo = (url: string) => {
    setCapturedImage(url);
    setShowDemoLab(false);
  };

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl min-h-[500px] border border-slate-800">
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <button 
          onClick={onBack}
          className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-black/50 transition-all border border-white/10"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-[10px] uppercase tracking-widest text-brand-teal-300 font-mono bg-black/40 px-3 py-1 rounded-full border border-white/5">
          Neural Frame Active
        </span>
      </div>

      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={() => setShowDemoLab(!showDemoLab)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-bold uppercase tracking-widest ${showDemoLab ? 'bg-brand-teal-600 text-white border-brand-teal-500 shadow-lg' : 'bg-black/30 backdrop-blur-md text-brand-teal-400 border-white/10 hover:bg-black/50'}`}
        >
          <FlaskConical size={14} />
          Demo Lab
        </button>
      </div>

      <AnimatePresence>
        {showDemoLab && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-10 bg-slate-900 p-8 pt-24"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Neural Demo Lab</h3>
              <p className="text-slate-400 text-sm">Select a synthesized sample to visualize specific conditions without an actual scan.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2 pb-8 h-[320px]">
              {DEMO_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => loadDemo(sample.url)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-brand-teal-600/20 hover:border-brand-teal-600/50 transition-all text-left group"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-white/5">
                    <img 
                      src={sample.url} 
                      alt={sample.name} 
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white group-hover:text-brand-teal-300">{sample.name}</span>
                      <MousePointer2 size={14} className="text-slate-600 group-hover:text-brand-teal-400" />
                    </div>
                    <p className="text-[10px] font-bold text-brand-teal-500 uppercase tracking-widest mb-1">{sample.condition}</p>
                    <p className="text-xs text-slate-500 leading-tight">{sample.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!capturedImage ? (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-[500px] object-cover scale-x-[-1] opacity-80"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-between p-10 pointer-events-none">
            <div className="w-64 h-64 border-2 border-brand-teal-400/30 rounded-full relative flex items-center justify-center">
              <div className="absolute inset-0 border-t-2 border-brand-teal-400 animate-pulse rounded-full shadow-[0_0_20px_rgba(45,212,191,0.3)]" />
              <div className="w-full h-[1px] bg-brand-teal-400/20" />
              <div className="h-full w-[1px] bg-brand-teal-400/20" />
            </div>
            
            <div className="flex gap-6 pointer-events-auto items-center">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all"
              >
                <Upload size={20} />
              </button>
              
              <button 
                id="capture-btn"
                onClick={capture}
                className="w-20 h-20 bg-brand-teal-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-teal-600/40 hover:scale-105 active:scale-95 transition-all outline-none border-4 border-white/20"
              >
                <div className="w-16 h-16 rounded-full border-2 border-white/30 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                </div>
              </button>

              <button 
                onClick={startCamera}
                className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all"
              >
                <RefreshCcw size={20} />
              </button>
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*"
          />
        </>
      ) : (
        <div className="relative">
          <img src={capturedImage} className="w-full h-[500px] object-cover contrast-110 grayscale-[20%]" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-10 text-center">
            <div className="mb-6 p-4 rounded-2xl bg-brand-teal-600 text-white shadow-xl">
              <Zap size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Pattern Locked</h3>
            <p className="text-slate-300 mb-8 max-w-xs text-sm font-medium">Neural analysis ready. Detected follicle alignment and scalp hydration levels.</p>
            
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button 
                id="submit-analysis-btn"
                onClick={() => onCapture(capturedImage)}
                className="w-full py-4 bg-brand-teal-600 text-white rounded-2xl font-bold text-lg hover:bg-brand-teal-700 transition-all shadow-xl shadow-brand-teal-900/40"
              >
                Begin Analysis
              </button>
              <button 
                onClick={() => setCapturedImage(null)}
                className="w-full py-3 bg-white/5 text-white rounded-2xl font-bold border border-white/10 hover:bg-white/10 transition-all text-sm"
              >
                Retake Sample
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-0 right-0 flex justify-center text-white pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-[0.25em] border border-white/10 text-brand-teal-400">
          FolliScan Neural Core v2.4
        </div>
      </div>
    </div>
  );
}

