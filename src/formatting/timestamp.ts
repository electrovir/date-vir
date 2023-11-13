import {FullDate} from '../full-date/full-date-shape';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion';
import {utcTimezone} from '../timezone/timezones';
import {UtcIsoString} from './string-format-types';

/** Convert a FullDate into a unix timestamp with milliseconds. */
export function toTimestamp(fullDate: FullDate): number {
    return toLuxonDateTime(fullDate).toMillis();
}

/** Convert a FullDate into an ISO string in UTC; always ends in Z. */
export function toIsoString(fullDate: FullDate): UtcIsoString {
    const isoString = toLuxonDateTime(fullDate).setZone(utcTimezone).toISO();

    /** Ignore this edge case in the types and idk how to trigger it. */
    /* c8 ignore next 3 */
    if (!isoString) {
        throw new Error(`Unable to get ISO string for '${JSON.stringify(fullDate)}'`);
    }

    return isoString as UtcIsoString;
}
