import {pickObjectKeys, typedObjectFromEntries} from '@augment-vir/common';
import {timeFullDateKeys} from '../full-date/full-date-parts.js';
import {FullDate, TimePart} from '../full-date/full-date-shape.js';
import {Timezone} from '../timezone/timezones.js';
import {overrideDateParts} from './override-date.js';

/**
 * A {@link FullDate} instance that has the lowest, valid, non-negative, value for each property.
 *
 * @category Zero
 */
export const zeroDate = {
    year: 0,
    month: 1,
    day: 1,
    hour: 0,

    minute: 0,
    second: 0,
    millisecond: 0,
} as const satisfies Readonly<Omit<TimePart, 'timezone'>>;

/**
 * A {@link FullDate} instance that has the lowest, valid, non-negative, value for each property.
 * Alias for {@link zeroDate}.
 *
 * @category Zero
 */
export const emptyDate = zeroDate;

/**
 * An object that contains the time parts of {@link FullDate} all set to `0`.
 *
 * @category Zero
 */
export const zeroTime = pickObjectKeys(zeroDate, timeFullDateKeys);

/**
 * Clear the time parts of a {@link FullDate}, setting them all to `0`.
 *
 * @category Zero
 * @example
 *
 * ```ts
 * import {clearTime, type FullDate} from 'date-vir';
 *
 * const exampleDate: Readonly<FullDate> = {
 *     year: 2024,
 *     month: 1,
 *     day: 5,
 *     hour: 1,
 *     minute: 1,
 *     second: 1,
 *     millisecond: 1,
 *     timezone: 'UTC',
 * };
 *
 * clearTime(exampleDate);
 * // `{year: 2024, month: 1, day: 5, hour: 0, minute: 0, second: 0, millisecond: 0, timezone: 'UTC'}`
 * ```
 */
export function clearTime<const SpecificTimezone extends Timezone>(
    inputFullDate: Readonly<FullDate<SpecificTimezone>>,
): FullDate<SpecificTimezone> {
    return clearParts(inputFullDate, timeFullDateKeys);
}

/**
 * Clear all the selected parts of {@link FullDate} by setting them each to their lowest, valid
 * value. See {@link zeroDate} for the lowest valid values for each property.
 *
 * @category Zero
 * @example
 *
 * ```ts
 * import {clearTime, type FullDate} from 'date-vir';
 *
 * const exampleDate: Readonly<FullDate> = {
 *     year: 2024,
 *     month: 1,
 *     day: 5,
 *     hour: 1,
 *     minute: 1,
 *     second: 1,
 *     millisecond: 1,
 *     timezone: 'UTC',
 * };
 *
 * clearParts(exampleDate, [
 *     'year',
 *     'day',
 * ]);
 * // `{year: 0, month: 1, day: 1, hour: 1, minute: 1, second: 1, millisecond: 1, timezone: 'UTC'}`
 * ```
 */
export function clearParts<const SpecificTimezone extends Timezone>(
    inputFullDate: Readonly<FullDate<SpecificTimezone>>,
    parts: ReadonlyArray<Exclude<keyof FullDate, 'timezone'>>,
) {
    const clearParts = typedObjectFromEntries(
        parts.map((keyName) => {
            return [
                keyName,
                zeroDate[keyName],
            ];
        }),
    );

    return overrideDateParts<SpecificTimezone>(inputFullDate, clearParts);
}
