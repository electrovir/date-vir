import {FullDate} from '../full-date/full-date-shape.js';
import {Timezone} from '../timezone/timezones.js';

/**
 * Override the initial provided FullDate with all subsequent FullDate parts.
 *
 * @category Parts
 * @example
 *
 * ```ts
 * import {overrideDateParts, type FullDate} from 'date-vir';
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
 * overrideDateParts(exampleDate, {day: 20}, {second: 10});
 * // `{year: 2024, month: 1, day: 20, hour: 1, minute: 1, second: 10, millisecond: 1, timezone: 'UTC'}`
 * ```
 */
export function overrideDateParts<const SpecificTimezone extends Timezone>(
    date: FullDate<SpecificTimezone>,
    ...overrides: Partial<FullDate<SpecificTimezone>>[]
): FullDate<SpecificTimezone> {
    return Object.assign({}, date, ...overrides);
}
