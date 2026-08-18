import { describe, it, expect } from 'vitest';
import { applyNearMiss } from '../src/resolution/nearMiss';
import { applyCatharsis } from '../src/resolution/relationalCatharsis';

describe('Residue Mandate Regression Suite', () => {
  it('verifies NearMiss leaves non-baseline state across all enumerated fields', () => {
    // Current clock value of 100 missed
    const clock = applyNearMiss(100);
    expect(clock.false_relief).toBe(true);
    expect(clock.next_climb_start_offset).toBeGreaterThan(0);
    expect(clock.next_climb_start_offset).toBe(50);
  });

  it('verifies RelationalCatharsis leaves non-baseline scar_tissue', () => {
    const rel = applyCatharsis({ resentment: 50, scar_tissue: 1 });
    expect(rel.scar_tissue).toBeGreaterThan(0);
    expect(rel.scar_tissue).toBe(6);
    expect(rel.resentment).toBe(0);
  });
});
