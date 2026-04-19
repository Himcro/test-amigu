import { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { AppState, ShapeInstance } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Sparkles, Brain, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  state: AppState;
}

function Shape({ shape }: { shape: ShapeInstance }) {
  const mesh = useMemo(() => {
    const size = shape.sizeCm / 10;
    
    switch (shape.type) {
      case 'esfera': return <sphereGeometry args={[size, 32, 32]} />;
      case 'cilindro': return <cylinderGeometry args={[size * 0.5, size * 0.5, size, 32]} />;
      case 'cono': return <coneGeometry args={[size * 0.5, size, 32]} />;
      case 'cubo': return <boxGeometry args={[size, size, size]} />;
      default: return <sphereGeometry args={[size, 16, 16]} />;
    }
  }, [shape.type, shape.sizeCm]);

  // Center the 2D position in the 3D world
  const x = (shape.position.x - 500) / 100;
  const y = -(shape.position.y - 400) / 100;

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={[x, y, 0]} castShadow receiveShadow>
        {mesh}
        <meshStandardMaterial 
          color={shape.blockId % 3 === 0 ? '#FFD700' : shape.blockId % 2 === 0 ? '#FF3B30' : '#ffffff'} 
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
    </Float>
  );
}

export default function Preview3D({ state }: Props) {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    async function analyze() {
      if (state.shapes.length === 0) return;
      setIsAnalyzing(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `Actúa como un experto en amigurumi de la Coder Crew Black 7. 
        Analiza este diseño compuesto por estas piezas: ${state.shapes.map(s => `${s.quantity} ${s.type} de ${s.sizeCm}cm (Bloque ${s.blockId})`).join(', ')}.
        Proporciona un resumen técnico brevísimo de ensamblaje en 3 puntos clave (español). 
        Enfócate en cómo los bloques determinan la estructura.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });

        setAiAnalysis(response.text || 'Error en análisis.');
      } catch (err) {
        setAiAnalysis('Análisis offline disponible en el patrón final.');
      } finally {
        setIsAnalyzing(false);
      }
    }
    analyze();
  }, [state.shapes]);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bento-card relative bg-[#0f172a] shadow-inner">
        <div className="bento-card-header text-white/50 border-white/10">
           <span>Cálculo de Malla IA</span>
           <Activity className="w-3 h-3" />
        </div>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 5, 10]} />
          <OrbitControls makeDefault enablePan={false} maxDistance={20} minDistance={2} />
          
          <ambientLight intensity={0.8} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <group position={[0, -1, 0]}>
            {state.shapes.map((shape) => (
              <Shape key={shape.id} shape={shape} />
            ))}
            <ContactShadows opacity={0.4} scale={15} blur={2.4} far={4.5} />
            <Grid infiniteGrid fadeDistance={20} sectionSize={1} cellSize={0.25} sectionColor="#6366f1" cellColor="#1e293b" />
          </group>

          <Environment preset="city" />
        </Canvas>

        <div className="absolute bottom-4 left-4">
           <div className="bg-success px-3 py-1 rounded-md text-[9px] font-bold text-white uppercase tracking-widest shadow-lg shadow-success/20">
             Vectores Optimizados
           </div>
        </div>
      </div>

      <div className="w-full lg:w-96 space-y-6">
        <div className="bento-card h-full">
          <div className="bento-card-header">
            <span>Diagnóstico de Ingeniería</span>
            <Brain className="w-3 h-3" />
          </div>
          
          <div className="p-6 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {aiAnalysis ? (
                <div className="text-xs font-medium text-secondary-accent leading-relaxed prose prose-indigo prose-sm">
                  <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center gap-3">
                   <Loader2 className="w-6 h-6 animate-spin text-primary-accent" />
                   <p className="text-[10px] font-bold text-secondary-accent/40 uppercase tracking-widest animate-pulse">Analizando Esquema...</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 pt-4 border-t border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-accent/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-text-main uppercase">AmiScript Aegis</span>
                <span className="text-[8px] font-bold text-secondary-accent uppercase opacity-50">Lógica Determinisitica</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
