import {type DurationUnit} from './duration-unit.js';
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
export type DurationUnitSelection = Record<DurationUnit, boolean>;

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
export type DurationBySelection<SelectedUnits extends Partial<DurationUnitSelection> | undefined> =
    undefined extends SelectedUnits
        ? AllDurations
        : {
              [Unit in keyof AllDurations as Unit extends keyof SelectedUnits
                  ? SelectedUnits[Unit] extends true
                      ? Unit
                      : never
                  : never]: AllDurations[Unit];
          };
