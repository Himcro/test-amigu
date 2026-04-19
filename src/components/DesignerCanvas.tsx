import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers, Move, Link as LinkIcon, Unlink, Box } from 'lucide-react';
import { AppState, ShapeInstance } from '../types';
import { SHAPE_METADATA } from '../constants';
import { cn } from '../lib/utils';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function DesignerCanvas({ state, setState }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const updatePosition = (id: string, x: number, y: number) => {
    setState(prev => ({
      ...prev,
      shapes: prev.shapes.map(s => s.id === id ? { ...s, position: { ...s.position, x, y } } : s)
    }));
  };

  const updateBlock = (id: string, blockId: number) => {
    setState(prev => ({
      ...prev,
      shapes: prev.shapes.map(s => s.id === id ? { ...s, blockId } : s)
    }));
  };

  const handleDrag = (e: React.MouseEvent, id: string) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updatePosition(id, x, y);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 space-y-6 overflow-y-auto pr-2">
        <div className="bento-card">
          <div className="bento-card-header">
             <span>Esquema de Piezas</span>
             <Layers className="w-3 h-3" />
          </div>
          <div className="p-4 space-y-2">
            {state.shapes.map((shape) => (
              <div 
                key={shape.id}
                onClick={() => setSelectedId(shape.id)}
                className={cn(
                  "p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between",
                  selectedId === shape.id ? "bg-primary-accent/5 border-primary-accent" : "bg-white border-border"
                )}
              >
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center">
                      <Box className="w-4 h-4 text-secondary-accent" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase text-text-main">{SHAPE_METADATA[shape.type].label}</span>
                      <span className="text-[9px] font-mono text-secondary-accent opacity-50">#ID-{shape.id.slice(0, 4)}</span>
                   </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-secondary-accent uppercase">Bloque</span>
                  <input 
                    type="number"
                    value={shape.blockId}
                    onChange={(e) => updateBlock(shape.id, Number(e.target.value))}
                    className="w-8 bg-background border border-border rounded font-bold text-[10px] text-center outline-none focus:border-primary-accent"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-card p-4 bg-white border-dashed border-2">
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="w-3 h-3 text-primary-accent" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary-accent">Logica de Bloques</span>
            </div>
            <p className="text-[10px] leading-relaxed text-secondary-accent">
              Las piezas con el mismo ID de bloque se generarán como una sola unidad en el patrón final.
            </p>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bento-card bg-[#fafafa] relative overflow-hidden">
        <div className="bento-card-header">
           <span>Espacio de Trabajo (2D)</span>
           <span className="text-[9px] font-bold text-primary-accent bg-primary-accent/10 px-2 py-0.5 rounded">MODO ARRASHRE</span>
        </div>
        
        <div 
          ref={canvasRef}
          className="w-full h-full relative"
          onMouseMove={(e) => selectedId && handleDrag(e, selectedId)}
          onClick={(e) => e.target === e.currentTarget && setSelectedId(null)}
        >
          {state.shapes.map((shape) => (
            <motion.div
              key={shape.id}
              initial={false}
              animate={{ x: shape.position.x, y: shape.position.y }}
              onMouseDown={() => setSelectedId(shape.id)}
              className={cn(
                "absolute cursor-move select-none",
                selectedId === shape.id ? "z-50" : "z-10"
              )}
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <div 
                className={cn(
                  "p-4 rounded-full border-2 transition-all flex items-center justify-center relative",
                  selectedId === shape.id ? "border-primary-accent bg-white shadow-xl scale-110" : "border-primary-accent/30 bg-primary-accent/5 backdrop-blur-sm"
                )}
                style={{ 
                  width: shape.sizeCm * 6, 
                  height: shape.sizeCm * 6,
                  maxWidth: '250px',
                  maxHeight: '250px'
                }}
              >
                 <Box className={cn("w-1/3 h-1/3", selectedId === shape.id ? "text-primary-accent" : "text-primary-accent/30")} />
                 <div className={cn(
                   "absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md font-bold text-[9px] border whitespace-nowrap shadow-sm",
                   selectedId === shape.id ? "bg-primary-accent border-primary-accent text-white" : "bg-white border-border text-secondary-accent"
                 )}>
                   #{shape.blockId} • {shape.sizeCm}CM
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white border border-border rounded-full text-[9px] font-bold text-secondary-accent uppercase tracking-widest shadow-sm">
          Posicionamiento relativo para previsualización 3D
        </div>
      </div>
    </div>
  );
}
