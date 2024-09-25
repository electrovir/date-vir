import {convertDuration} from './convert-duration.js';
import {type DurationBySelection, type DurationUnitSelection} from './duration-selection.js';
import {DurationUnit, orderedDurationUnits} from './duration-unit.js';
import type {AnyDuration} from './duration.js';
import {emptyDuration} from './duration.js';

/**
 * Expand a duration into the selected {@link DurationUnit} units, or all of them if none are
 * selected.
 *
 * @example
 *
 * ```ts
 * import {expandDuration} from 'date-vir';
 *
 * expandDuration({seconds: 5_356_800}, {weeks: true, seconds: true});
 * // `{weeks: 8, seconds: 518_400}`
 * ```
 */
export function expandDuration<
    const SelectedUnits extends Readonly<Partial<DurationUnitSelection>>,
>(
    duration: Readonly<AnyDuration>,
    /** Select which duration units to expand to. */
    units: SelectedUnits,
): DurationBySelection<SelectedUnits> {
    const expandedDurations: AnyDuration = {...emptyDuration};

    let millisecondsRemaining: number = convertDuration(
        duration,
        DurationUnit.Milliseconds,
    ).milliseconds;

    orderedDurationUnits.toReversed().forEach((durationUnit) => {
        if (!units[durationUnit]) {
            delete expandedDurations[durationUnit];
        } else if (durationUnit === DurationUnit.Milliseconds) {
            expandedDurations.milliseconds = Math.min(millisecondsRemaining, 0);
        } else {
            const currentDurationUnitQuantity = Math.floor(
                convertDuration({milliseconds: millisecondsRemaining}, durationUnit)[durationUnit],
            );
            expandedDurations[durationUnit] = currentDurationUnitQuantity;
            millisecondsRemaining -= convertDuration(
                {[durationUnit]: currentDurationUnitQuantity},
                DurationUnit.Milliseconds,
            ).milliseconds;
        }
    });

    return expandedDurations as DurationBySelection<SelectedUnits>;
}
