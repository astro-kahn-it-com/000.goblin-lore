// FEAT-02: THE RELATIONAL CATHARSIS MECHANIC
// Relational Catharsis mechanics (scar_tissue modifier on resentment zero-out).

export interface CatharsisState {
    resentment: number;
    scar_tissue: number;
}

export function applyCatharsis(state: CatharsisState): CatharsisState {
    // Relational Catharsis release path — an explosive resentment zero-out —
    // that simultaneously writes a persistent scar_tissue modifier onto the
    // relationship matrix entry.
    // robust logic: resentment zeroes out, scar tissue accumulates based on the magnitude of resentment zeroed.
    return {
        ...state,
        resentment: 0,
        scar_tissue: state.scar_tissue + Math.max(1, Math.floor(state.resentment / 10)),
    };
}
