import { ShapeType } from './types';

export const SHAPE_METADATA: Record<ShapeType, { label: string; icon: string; description: string }> = {
  esfera: { label: 'Esfera', icon: 'Circle', description: 'Forma redonda para cabezas o cuerpos.' },
  cilindro: { label: 'Cilindro', icon: 'Container', description: 'Extremidades o troncos.' },
  cono: { label: 'Cono', icon: 'Triangle', description: 'Picos o cuernos.' },
  cono_truncado: { label: 'Cono Truncado', icon: 'Database', description: 'Bases de sombreros o cuerpos.' },
  ovoide: { label: 'Ovoide', icon: 'Egg', description: 'Formas orgánicas como huevos o cabezas chibi.' },
  toroide: { label: 'Dona', icon: 'Donut', description: 'Salvavidas o colas.' },
  lagrima: { label: 'Lágrima', icon: 'Droplets', description: 'Hojas o gotas de agua.' },
  paraboloide: { label: 'Domo', icon: 'Cloud', description: 'Caparazones o sombreros de hongo.' },
  cubo: { label: 'Cubo', icon: 'Box', description: 'Dados o bloques.' },
  prisma: { label: 'Prisma', icon: 'BoxSelect', description: 'Cajas o rectángulos.' },
  piramide: { label: 'Pirámide', icon: 'Pyramid', description: 'Techos o dientes.' },
  capsula: { label: 'Cápsula', icon: 'Capsule', description: 'Cápsulas o dedos.' },
  sillin: { label: 'Sillín', icon: 'Waves', description: 'Volados o corales.' },
  plano: { label: 'Plano', icon: 'Square', description: 'Alas o planos.' },
};

export const TRANSLATIONS = {
  US: { stitch: 'sc', round: 'V', increase: 'inc', decrease: 'dec' },
  UK: { stitch: 'dc', round: 'R', increase: 'inc', decrease: 'dec' },
  ES: { stitch: 'pb', round: 'V', increase: 'aum', decrease: 'dism' },
  LATAM: { stitch: 'mp', round: 'V', increase: 'aum', decrease: 'dism' },
};
