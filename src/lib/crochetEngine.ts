import { ShapeType, StitchType } from '../types';
import { TRANSLATIONS } from '../constants';

interface RoundInstruction {
  round: number;
  instruction: string;
  count: number;
}

export const generatePattern = (
  type: ShapeType, 
  sizeCm: number, 
  locale: 'US' | 'UK' | 'ES' | 'LATAM' = 'ES'
): RoundInstruction[] => {
  const t = TRANSLATIONS[locale];
  const scale = sizeCm / 10;
  const pattern: RoundInstruction[] = [];

  // Logic from PDF Page 4: Esfera (Standard 10cm base)
  if (type === 'esfera') {
    const Pmax = Math.round(78 * scale);
    const roundsInc = Math.floor(Pmax / 6);
    
    // Increases
    for (let v = 1; v <= roundsInc; v++) {
      if (v === 1) {
        pattern.push({ round: v, instruction: `${6} ${t.stitch} en AM`, count: 6 });
      } else if (v === 2) {
        pattern.push({ round: v, instruction: `6 ${t.increase}`, count: 12 });
      } else {
        const repeat = v - 2;
        pattern.push({ 
          round: v, 
          instruction: `[${repeat} ${t.stitch}, 1 ${t.increase}] x 6`, 
          count: v * 6 
        });
      }
    }

    const currentPts = roundsInc * 6;
    const straightRounds = Math.round(11 * scale);
    for (let v = 1; v <= straightRounds; v++) {
      pattern.push({ 
        round: roundsInc + v, 
        instruction: `${currentPts} ${t.stitch}`, 
        count: currentPts 
      });
    }

    const currentTotal = roundsInc + straightRounds;
    for (let v = 1; v <= roundsInc; v++) {
      const remainingPts = (roundsInc - v) * 6;
      if (remainingPts < 6) continue;
      
      const repeat = (roundsInc - v);
      if (repeat === 0) {
        pattern.push({ round: currentTotal + v, instruction: `6 ${t.decrease}`, count: 6 });
      } else {
        pattern.push({ 
          round: currentTotal + v, 
          instruction: `[${repeat} ${t.stitch}, 1 ${t.decrease}] x 6`, 
          count: remainingPts 
        });
      }
    }
  }

  // Fallback / Placeholder for other shapes as simplified logic
  if (pattern.length === 0) {
    pattern.push({ round: 1, instruction: `6 ${t.stitch} en AM`, count: 6 });
    pattern.push({ round: 2, instruction: `6 ${t.increase}`, count: 12 });
    pattern.push({ round: 3, instruction: `12 ${t.stitch}`, count: 12 });
  }

  return pattern;
};
