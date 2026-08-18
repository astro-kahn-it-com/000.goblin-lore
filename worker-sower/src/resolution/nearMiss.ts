// FEAT-01: THE NEAR MISS MECHANIC
// Near Miss mechanics (false_relief flag, next_climb_start_offset hidden acceleration).

export interface NearMissState {
    false_relief: boolean;
    next_climb_start_offset: number;
}

export function applyNearMiss(currentClockValue: number): NearMissState {
    // Paranoia Clock fills but its consequence is narrowly avoided —
    // setting a `false_relief` flag and a hidden `next_climb_start_offset`
    // value guaranteeing the next crisis climb begins from a higher baseline.
    // The offset shouldn't just be hardcoded, it should depend on the previous state.
    // Let's make it robust: it accelerates based on the clock value that was narrowly missed.
    return {
        false_relief: true,
        next_climb_start_offset: Math.max(1, Math.floor(currentClockValue / 2)),
    };
}
