import {type FullDate} from '../full-date/full-date-shape.js';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion.js';
import {utcTimezone} from '../timezone/timezones.js';
import {type HttpDateString, type UtcIsoString} from './string-format-types.js';

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
 * Convert a FullDate into a UTC ISO 8601 string, always ending in Z (for example
 * `'2024-01-05T01:01:01.001Z'`). This is the machine-readable counterpart to
 * {@link toHttpDateString}, which produces the human/HTTP-readable RFC 1123 format (`'Fri, 05 Jan
 * 2024 01:01:01 GMT'`). Both represent the same instant in UTC; pick the one whose format your
 * consumer expects.
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
 *
 * @see {@link toHttpDateString} for the RFC 1123 / HTTP-date format.
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

/**
 * Convert a FullDate into an RFC 1123 / HTTP-date string in GMT (for example `'Fri, 05 Jan 2024
 * 01:01:01 GMT'`). This is the format used by HTTP headers (per RFC 9110), and is identical to what
 * `Date.prototype.toUTCString()` produces for the same instant.
 *
 * This is distinct from {@link toUtcIsoString}, which produces the ISO 8601 format
 * (`'2024-01-05T01:01:01.001Z'`). Both represent the same instant in UTC, but they are not
 * interchangeable: use this RFC 1123 form wherever an HTTP date is expected (e.g. `Date`,
 * `Last-Modified`, `Expires`, or `Retry-After` headers), and use {@link toUtcIsoString} where ISO
 * 8601 is expected. The output is always rendered in GMT regardless of the input's timezone.
 *
 * @category Formatting
 * @example
 *
 * ```ts
 * import {toHttpDateString} from 'date-vir';
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
 * toHttpDateString(exampleDate); // `'Fri, 05 Jan 2024 01:01:01 GMT'`
 * ```
 *
 * @see {@link toUtcIsoString} for the ISO 8601 format.
 */
export function toHttpDateString(fullDate: FullDate): HttpDateString {
    return toLuxonDateTime(fullDate).toHTTP() as HttpDateString;
}
