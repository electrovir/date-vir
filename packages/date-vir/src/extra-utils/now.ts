import {UtcIsoString} from '../formatting/string-format-types.js';
import {toIsoString} from '../formatting/timestamp.js';
import {getNowFullDate} from '../full-date/create-full-date.js';
import {FullDate} from '../full-date/full-date-shape.js';
import {UtcTimezone, userTimezone, utcTimezone} from '../timezone/timezones.js';

export function getNowInIsoString(): UtcIsoString {
    /**
     * The time zone doesn't matter here because the ISO string will be identical for a given date
     * no matter what its timezone is.
     */
    return toIsoString(getNowFullDate(utcTimezone));
}

export function getNowInUserTimezone(): FullDate {
    return getNowFullDate(userTimezone);
}

export function getNowInUtcTimezone(): FullDate<UtcTimezone> {
    return getNowFullDate(utcTimezone);
}
