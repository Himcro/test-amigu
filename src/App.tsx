/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Download, 
  Cuboid as Cube, 
  Circle, 
  Database, 
  Triangle, 
  Box, 
  FileText,
  Activity,
  Layers,
  Settings2
} from 'lucide-react';
import { AppState, ShapeInstance, ShapeType } from './types';
import { SHAPE_METADATA } from './constants';
import { cn } from './lib/utils';
import Wizard from './components/Wizard';
import DesignerCanvas from './components/DesignerCanvas';
import Preview3D from './components/Preview3D';
import PatternExport from './components/PatternExport';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<AppState>({
    language: 'ES',
    stitchType: 'pb',
    roundType: 'V01',
    shapes: [],
  });

  const steps = [
    { name: 'Configuración', icon: Settings2 },
    { name: 'Diseño 2D', icon: Box },
    { name: 'Cálculo IA', icon: Activity },
    { name: 'Patrón', icon: FileText },
  ];

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col font-sans">
      {/* Header */}
      <header className="h-[70px] border-b border-border px-8 flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary-accent/20">
            <Layers className="text-white w-6 h-6" />
          </div>
          <h1 className="font-extrabold text-xl tracking-tight text-text-main">AMIGURUMI <span className="text-primary-accent font-normal opacity-50">DESIGNER</span></h1>
        </div>
        
        <div className="flex gap-4">
          <span className="text-[10px] font-bold text-secondary-accent bg-background px-4 py-2 rounded-xl border border-border flex items-center gap-2 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Aguja 3.5mm | Hilo 8/6
          </span>
        </div>
      </header>

      {/* Navigation (Bento Style Stepper) */}
      <nav className="px-8 py-6 max-w-5xl mx-auto w-full">
        <div className="bg-white border border-border rounded-2xl p-2 flex gap-2 shadow-sm">
          {steps.map((step, idx) => (
            <button
              key={step.name}
              onClick={() => idx <= currentStep && setCurrentStep(idx)}
              className={cn(
                "flex-1 flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-300 font-semibold text-sm",
                idx === currentStep ? "bg-primary-accent text-white shadow-md shadow-primary-accent/20" : 
                idx < currentStep ? "text-primary-accent hover:bg-primary-accent/5" : "text-secondary-accent opacity-50"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full border flex items-center justify-center text-[10px]",
                idx === currentStep ? "border-white/30" : "border-current"
              )}>
                {idx + 1}
              </div>
              <span className="hidden sm:inline">{step.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 px-8 pb-8 max-w-7xl mx-auto w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full w-full"
          >
            {currentStep === 0 && <Wizard state={state} setState={setState} onComplete={nextStep} />}
            {currentStep === 1 && <DesignerCanvas state={state} setState={setState} />}
            {currentStep === 2 && <Preview3D state={state} />}
            {currentStep === 3 && <PatternExport state={state} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <footer className="p-6 border-t border-border flex items-center justify-between bg-white px-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border hover:bg-background disabled:opacity-30 disabled:pointer-events-none transition-all font-bold text-sm text-secondary-accent"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>

        <div className="text-center font-bold text-[10px] text-secondary-accent/40 tracking-[0.2em] uppercase hidden md:block">
          AmiScript Engine • v1.2 • Mendoza 2026
        </div>

        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary-accent text-white hover:bg-primary-accent/90 transition-all font-bold text-sm disabled:opacity-30 disabled:pointer-events-none shadow-lg shadow-primary-accent/20"
        >
          {currentStep === steps.length - 2 ? 'Generar Patrón' : 'Siguiente'} <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
