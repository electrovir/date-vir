import {toTimestamp} from '../formatting/timestamp.js';
import {type FullDate} from '../full-date/full-date-shape.js';
import {userTimezone} from '../timezone/timezones.js';

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
    /**
     * Fast path: when the FullDate is already in the host environment's timezone, the JS `Date`
     * local-time constructor produces the exact same instant as the Luxon round-trip (verified to
     * agree even across DST gaps and overlaps) at a fraction of the cost. `userTimezone` is derived
     * from the host environment, so it is the zone the `Date` constructor interprets its arguments
     * in.
     *
     * The `year >= 100` guard avoids the `Date` constructor's legacy two-digit-year behavior (years
     * 0-99 are mapped to 1900-1999); such dates fall through to the Luxon path, which handles them
     * correctly.
     */
    if (fullDate.timezone === userTimezone && fullDate.year >= 100) {
        return new Date(
            fullDate.year,
            fullDate.month - 1, // JS Date months are 0-indexed
            fullDate.day,
            fullDate.hour,
            fullDate.minute,
            fullDate.second,
            fullDate.millisecond,
        );
    }
    return new Date(toTimestamp(fullDate));
}
