import {DurationUnit, orderedDurationUnits} from './duration-unit.js';
import {type AllDurations, type Duration} from './duration.js';

/**
 * Select a set of duration units to use in {@link DurationBySelection}.
 *
 * @category Duration : Selection
 * @example
 *
 * ```ts
 * import {type DurationUnitSelection} from 'date-vir';
 *
 * const select: DurationUnitSelection = {
 *     days: true,
 *     months: true,
 * };
 * ```
 */
export type DurationUnitSelection = Partial<Record<DurationUnit, boolean | undefined>>;

/**
 * Reduce a {@link DurationUnitSelection} object into an array of the selected units, in order from
 * smallest unit (at index 0) to largest.
 *
 * @category Duration : Util
 */
export function flattenUnitSelection(units: Readonly<DurationUnitSelection>): DurationUnit[] {
    return orderedDurationUnits.filter((durationUnit) => units[durationUnit]);
}

/**
 * Pick a subset of {@link Duration} keys by a {@link DurationUnitSelection} input.
 *
 * @category Duration : Selection
 * @example
 *
 * ```ts
 * import {type DurationBySelection} from 'date-vir';
 *
 * type MySelection = DurationBySelection<{days: true; months: true}>; // `{days: number, months: number}`
 * ```
 */
export type DurationBySelection<SelectedUnits extends Readonly<DurationUnitSelection> | undefined> =
    undefined extends SelectedUnits
        ? AllDurations
        : {
              [Unit in keyof AllDurations as Unit extends keyof SelectedUnits
                  ? SelectedUnits[Unit] extends true
                      ? Unit
                      : never
                  : never]: AllDurations[Unit];
          };

/**
 * An {@link DurationUnitSelection} instance that sets all duration units to `true`.
 *
 * @category Duration : Selection
 */
export const selectAllDurationUnits = {
    years: true,
    quarters: true,
    months: true,
    weeks: true,
    days: true,
    hours: true,
    minutes: true,
    seconds: true,
    milliseconds: true,
} as const satisfies Record<DurationUnit, true>;
