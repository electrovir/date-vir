import {toTimestamp} from '../formatting/timestamp.js';
import {FullDate} from '../full-date/full-date-shape.js';

/**
 * Convert a {@link FullDate} from a built-in JS
 * [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date).
 *
 * @category Conversion
 * @example
 *
 * ```ts
 * import {toJsDate, type FullDate} from 'date-vir';
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
 * toJsDate(exampleDate);
 * ```
 */
export function toJsDate(fullDate: Readonly<FullDate>): Date {
    return new Date(toTimestamp(fullDate));
}
