import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { applyNearMiss } from '../src/resolution/nearMiss';
import { applyCatharsis } from '../src/resolution/relationalCatharsis';
import { REGISTERED_RELEASE_MECHANICS } from './residueCoverageRegistry';

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

describe('Residue Meta-Test Audit', () => {
  it('confirms all implemented release mechanics are present in registry', () => {
    const resolutionDir = path.join(__dirname, '../src/resolution');
    const files = fs.readdirSync(resolutionDir);

    const implementedMechanics = files
      .filter(file => file.endsWith('.ts'))
      .map(file => {
        const baseName = file.replace('.ts', '');
        return baseName.charAt(0).toUpperCase() + baseName.slice(1);
      });

    const registeredNames = REGISTERED_RELEASE_MECHANICS.map(m => m.mechanicName);

    for (const mechanic of implementedMechanics) {
      expect(registeredNames).toContain(mechanic);
    }
  });
});
