import { describe, it, expect } from 'vitest';
import { applyNearMiss } from '../src/resolution/nearMiss';
import { applyCatharsis } from '../src/resolution/relationalCatharsis';

describe('Residue Mandate Regression Suite', () => {
  it('verifies NearMiss leaves non-baseline state across all enumerated fields', () => {
    const clock = applyNearMiss(0);
    expect(clock.false_relief).toBe(true);
    expect(clock.next_climb_start_offset).toBeGreaterThan(0);
  });

  it('verifies RelationalCatharsis leaves non-baseline scar_tissue', () => {
    const rel = applyCatharsis({ resentment: 5, scar_tissue: 0 });
    expect(rel.scar_tissue).toBeGreaterThan(0);
  });
});
