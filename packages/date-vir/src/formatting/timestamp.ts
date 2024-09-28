import {FullDate} from '../full-date/full-date-shape.js';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion.js';
import {utcTimezone} from '../timezone/timezones.js';
import {UtcIsoString} from './string-format-types.js';

/**
 * Convert a FullDate into a unix timestamp with milliseconds.
 *
 * @category Formatting
 * @example
 *
 * ```ts
 * import {toTimestamp} from 'date-vir';
 *
 * const exampleDate: FullDate = {
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
 * toTimestamp(exampleDate); // `1704416461001`
 * ```
 */
export function toTimestamp(fullDate: FullDate): number {
    return toLuxonDateTime(fullDate).toMillis();
}

/**
 * Convert a FullDate into a UTC ISO string, always ending in Z.
 *
 * @category ISO
 * @category Formatting
 * @example
 *
 * ```ts
 * import {toUtcIsoString} from 'date-vir';
 *
 * const exampleDate: FullDate = {
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
 * toUtcIsoString(exampleDate); // `'2024-01-05T01:01:01.001Z'`
 * ```
 */
export function toUtcIsoString(fullDate: FullDate): UtcIsoString {
    const isoString = toLuxonDateTime(fullDate).setZone(utcTimezone).toISO();

    /** Ignore this edge case in the types and idk how to trigger it. */
    /* c8 ignore next 3 */
    if (!isoString) {
        throw new Error(`Unable to get ISO string for '${JSON.stringify(fullDate)}'`);
    }

    return isoString as UtcIsoString;
}
