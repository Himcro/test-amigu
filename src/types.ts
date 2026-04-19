export type StitchType = 'sc' | 'pb' | 'mp' | 'dc';
export type RoundType = 'V01' | 'R01' | '1°V';

export type ShapeType = 
  | 'esfera' 
  | 'cilindro' 
  | 'cono' 
  | 'cono_truncado' 
  | 'ovoide' 
  | 'toroide' 
  | 'lagrima' 
  | 'paraboloide' 
  | 'cubo' 
  | 'prisma' 
  | 'piramide' 
  | 'capsula' 
  | 'sillin' 
  | 'plano';

export interface ShapeInstance {
  id: string;
  type: ShapeType;
  quantity: number;
  sizeCm: number;
  position: { x: number; y: number; z: number };
  color: string;
  blockId: number; // For grouping
}

export interface AppState {
  language: 'US' | 'UK' | 'ES' | 'LATAM';
  stitchType: StitchType;
  roundType: RoundType;
  shapes: ShapeInstance[];
}
