import { jsPDF } from 'jspdf';
import { motion } from 'motion/react';
import { Download, FileText, CheckCircle2, ChevronRight, Brain } from 'lucide-react';
import { AppState } from '../types';
import { generatePattern } from '../lib/crochetEngine';
import { SHAPE_METADATA, TRANSLATIONS } from '../constants';
import confetti from 'canvas-confetti';

interface Props {
  state: AppState;
}

export default function PatternExport({ state }: Props) {
  const exportPDF = () => {
    const doc = new jsPDF();
    const t = TRANSLATIONS[state.language];
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('AmiScript - PATRON PROFESIONAL', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Localización: ${state.language} | Aguja: 3.5mm | Hilo: 8/6`, 20, 30);
    doc.line(20, 35, 190, 35);

    let y = 50;

    const groupedShapes = state.shapes.reduce((acc, shape) => {
      if (!acc[shape.blockId]) acc[shape.blockId] = [];
      acc[shape.blockId].push(shape);
      return acc;
    }, {} as Record<number, any[]>);

    Object.entries(groupedShapes).forEach(([blockId, shapes]) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(`BLOQUE #${blockId}`, 20, y);
      y += 10;

      shapes.forEach(shape => {
        const pattern = generatePattern(shape.type, shape.sizeCm, state.language);
        doc.setFontSize(12);
        doc.text(`${SHAPE_METADATA[shape.type].label} (${shape.sizeCm}cm) - Cantidad: ${shape.quantity}`, 25, y);
        y += 8;

        pattern.forEach(p => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(10);
          doc.setFont('courier', 'normal');
          doc.text(`${p.round < 10 ? '0' : ''}${p.round}: ${p.instruction} (${p.count})`, 30, y);
          y += 6;
        });
        y += 10;
      });
    });

    doc.save(`amiscript-pattern-${new Date().getTime()}.pdf`);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#22c55e', '#ffffff']
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-8">
        
        {/* Status Card */}
        <div className="md:col-span-12 lg:col-span-7 space-y-6">
          <div className="bento-card">
            <div className="bento-card-header">
               <span>Resumen de Exportación</span>
               <CheckCircle2 className="w-3 h-3 text-success" />
            </div>
            <div className="p-8 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-primary-accent/10 rounded-3xl flex items-center justify-center">
                <FileText className="w-10 h-10 text-primary-accent" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold uppercase tracking-tight">Patrón Generado Correctamente</h2>
                <p className="text-sm text-secondary-accent max-w-sm">
                  El motor AmiScript ha procesado {state.shapes.length} formas geométricas y las ha convertido en instrucciones de tejido para el idioma {state.language}.
                </p>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background border border-border">
                  <span className="block text-[9px] font-bold text-secondary-accent uppercase mb-1">Puntos</span>
                  <span className="text-lg font-bold text-text-main">{state.shapes.length > 0 ? (state.shapes.length * 24) : 0}+</span>
                </div>
                <div className="p-4 rounded-xl bg-background border border-border">
                  <span className="block text-[9px] font-bold text-secondary-accent uppercase mb-1">Vueltas</span>
                  <span className="text-lg font-bold text-text-main">~45</span>
                </div>
              </div>

              <button
                onClick={exportPDF}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-primary-accent text-white font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-primary-accent/20"
              >
                <Download className="w-5 h-5" />
                Descargar PDF Original
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className="bento-card flex-1">
            <div className="bento-card-header">
               <span>Detalles Técnicos</span>
               <Brain className="w-3 h-3" />
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {state.shapes.slice(0, 3).map((shape, i) => (
                  <div key={i} className="flex gap-4 items-center p-3 rounded-xl bg-[#fafafa] border border-border">
                    <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-xs font-bold">
                       {i + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase">{SHAPE_METADATA[shape.type].label}</span>
                      <span className="text-[9px] text-secondary-accent font-medium">Factor de Escala: {shape.sizeCm / 10}x</span>
                    </div>
                    <CheckCircle2 className="w-3 h-3 text-success ml-auto" />
                  </div>
                ))}
                {state.shapes.length > 3 && (
                   <p className="text-center text-[9px] font-bold text-secondary-accent uppercase opacity-40">+{state.shapes.length - 3} piezas adicionales</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-primary-accent/5 border border-primary-accent/10">
                 <p className="text-[10px] leading-relaxed text-primary-accent font-medium">
                   "Este patrón es un compilado matemático basado en la tensión estándar. Recomendamos realizar una muestra de tensión antes de iniciar piezas grandes."
                 </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
