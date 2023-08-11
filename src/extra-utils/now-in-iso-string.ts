import {getNowFullDate} from '../full-date/create-full-date';
import {toIsoString} from '../full-date/primitive-conversions';
import {UtcIsoString} from '../full-date/string-format-types';
import {utcTimezone} from '../timezone/timezones';

export function getNowInIsoString(): UtcIsoString {
    /**
     * The time zone doesn't matter here because the ISO string will be identical for a given date
     * no matter what its timezone is.
     */
    return toIsoString(getNowFullDate(utcTimezone));
}
