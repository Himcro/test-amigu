import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, Trash2, CheckCircle2, Globe, Box, Ruler, Brain } from 'lucide-react';
import { AppState, ShapeType } from '../types';
import { SHAPE_METADATA } from '../constants';
import { cn } from '../lib/utils';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onComplete: () => void;
}

export default function Wizard({ state, setState, onComplete }: Props) {
  const [wizardStep, setWizardStep] = useState(0);

  const addShape = (type: ShapeType) => {
    setState(prev => ({
      ...prev,
      shapes: [
        ...prev.shapes,
        {
          id: Math.random().toString(36).substr(2, 9),
          type,
          quantity: 1,
          sizeCm: 10,
          position: { x: 0, y: 0, z: 0 },
          color: '#ffffff',
          blockId: prev.shapes.length + 1
        }
      ]
    }));
  };

  const removeShape = (id: string) => {
    setState(prev => ({
      ...prev,
      shapes: prev.shapes.filter(s => s.id !== id)
    }));
  };

  const updateShape = (id: string, updates: Partial<any>) => {
    setState(prev => ({
      ...prev,
      shapes: prev.shapes.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  return (
    <div className="max-w-6xl mx-auto h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full pb-8">
        {/* Main Configuration Card */}
        <div className="md:col-span-12 lg:col-span-4 space-y-6">
          <div className="bento-card">
            <div className="bento-card-header">
              <span>Configuración Global</span>
              <Globe className="w-3 h-3" />
            </div>
            <div className="p-6 space-y-6">
              <div>
                <span className="block text-[10px] font-bold text-secondary-accent uppercase mb-3 tracking-widest">Idioma de Salida</span>
                <div className="flex gap-2 flex-wrap">
                  {(['US', 'UK', 'ES', 'LATAM'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setState(prev => ({ ...prev, language: lang }))}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                        state.language === lang ? "bg-primary-accent text-white border-primary-accent shadow-md shadow-primary-accent/10" : "bg-white text-secondary-accent border-border hover:border-primary-accent/50"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-secondary-accent uppercase mb-3 tracking-widest">Nomenclatura Puntos</span>
                <div className="flex gap-2">
                   {['pb/mp', 'sc/hdc'].map(type => (
                      <button key={type} className="flex-1 py-3 rounded-xl border border-border text-xs font-bold text-secondary-accent hover:border-primary-accent transition-all">
                        {type}
                      </button>
                   ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bento-card bg-primary-accent p-6 text-white space-y-4">
             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
               <Brain className="w-5 h-5" />
             </div>
             <p className="text-sm font-semibold leading-relaxed">
               Nuestro algoritmo recalcula automáticamente la escala de puntos basándose en una base de 10cm.
             </p>
          </div>
        </div>

        {/* Shape Selection Card */}
        <div className="md:col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bento-card flex-1">
            <div className="bento-card-header">
              <span>Selector de Formas Matemáticas</span>
              <Plus className="w-3 h-3" />
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {(Object.keys(SHAPE_METADATA) as ShapeType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => addShape(type)}
                    className="p-4 rounded-xl border border-border bg-background hover:border-primary-accent hover:bg-primary-accent/5 transition-all flex flex-col items-center gap-2 group"
                  >
                    <Box className="w-5 h-5 text-secondary-accent group-hover:text-primary-accent transition-colors" />
                    <span className="text-[10px] font-bold text-secondary-accent uppercase text-center h-8 leading-tight">
                      {SHAPE_METADATA[type].label}
                    </span>
                  </button>
                ))}
              </div>

              {state.shapes.length > 0 && (
                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-secondary-accent uppercase tracking-[0.3em]">Lista de Producción</h3>
                    <span className="text-[10px] text-primary-accent font-bold px-2 py-0.5 bg-primary-accent/10 rounded-full">{state.shapes.length} PIEZAS</span>
                  </div>
                  <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {state.shapes.map((shape) => (
                      <div key={shape.id} className="flex items-center gap-4 p-4 rounded-2xl bg-background border border-border group hover:border-primary-accent/30 transition-all shadow-sm">
                        <div className="w-10 h-10 bg-white border border-border rounded-xl flex items-center justify-center">
                          <Box className="w-5 h-5 text-secondary-accent" />
                        </div>
                        
                        <div className="flex-1">
                          <span className="font-bold text-sm text-text-main uppercase">{SHAPE_METADATA[shape.type].label}</span>
                          <div className="flex gap-4 mt-0.5">
                            <div className="flex items-center gap-1.5">
                              <Ruler className="w-3 h-3 text-secondary-accent/40" />
                              <input 
                                type="number" 
                                value={shape.sizeCm}
                                onChange={(e) => updateShape(shape.id, { sizeCm: Number(e.target.value) })}
                                className="bg-transparent font-bold text-xs w-10 border-b border-border outline-none focus:border-primary-accent text-secondary-accent"
                              />
                              <span className="text-[9px] font-bold text-secondary-accent/40 uppercase">CM</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-border">
                           <button onClick={() => updateShape(shape.id, { quantity: Math.max(1, shape.quantity - 1) })} className="text-secondary-accent hover:text-primary-accent"><Minus className="w-3.5 h-3.5" /></button>
                           <span className="w-4 text-center font-bold text-xs">{shape.quantity}</span>
                           <button onClick={() => updateShape(shape.id, { quantity: shape.quantity + 1 })} className="text-secondary-accent hover:text-primary-accent"><Plus className="w-3.5 h-3.5" /></button>
                        </div>

                        <button 
                          onClick={() => removeShape(shape.id)}
                          className="p-2 text-secondary-accent/20 hover:text-secondary-accent transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
