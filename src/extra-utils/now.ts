import {UtcIsoString} from '../formatting/string-format-types';
import {toIsoString} from '../formatting/timestamp';
import {getNowFullDate} from '../full-date/create-full-date';
import {FullDate} from '../full-date/full-date-shape';
import {userTimezone, utcTimezone} from '../timezone/timezones';

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

export function getNowInUtcTimezone(): FullDate {
    return getNowFullDate(utcTimezone);
}
