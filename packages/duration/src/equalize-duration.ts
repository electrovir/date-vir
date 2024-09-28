import {convertDuration} from './convert-duration.js';
import {type DurationBySelection, type DurationUnitSelection} from './duration-selection.js';
import {orderedDurationUnits} from './duration-unit.js';
import type {AnyDuration} from './duration.js';
import {RoundOptions} from './round-options.js';

/**
 * Set each selected duration unit to the full value of the full given duration.
 *
 * @category Duration
 * @example
 *
 * ```ts
 * import {equalizeDuration} from 'date-vir';
 *
 * equalizeDuration({seconds: 5_356_800}, {weeks: true, seconds: true});
 * // `{weeks: 8, seconds: 518_400}`
 * ```
 */
export function equalizeDuration<const SelectedUnits extends Readonly<DurationUnitSelection>>(
    duration: Readonly<AnyDuration>,
    /** Select which duration units to equalize to. */
    units: SelectedUnits,
    options?: RoundOptions,
): DurationBySelection<SelectedUnits> {
    const equalizedDurations: AnyDuration = {};

    orderedDurationUnits.forEach((durationUnit) => {
        if (units[durationUnit]) {
            equalizedDurations[durationUnit] = convertDuration(
                duration,
                {[durationUnit]: true},
                options,
            )[durationUnit];
        }
    });

    return equalizedDurations as DurationBySelection<SelectedUnits>;
}
