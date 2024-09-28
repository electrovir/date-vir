import {UtcIsoString} from '../formatting/string-format-types.js';
import {toUtcIsoString} from '../formatting/timestamp.js';
import {createFullDate} from '../full-date/create-full-date.js';
import {FullDate} from '../full-date/full-date-shape.js';
import {Timezone, UtcTimezone, userTimezone, utcTimezone} from '../timezone/timezones.js';

/**
 * Get the time right now as a UTC ISO.
 *
 * @category Now
 * @example
 *
 * ```ts
 * import {getNowInIsoString} from 'date-vir';
 *
 * getNowInIsoString();
 * ```
 */
export function getNowInIsoString(): UtcIsoString {
    /**
     * The time zone doesn't matter here because the ISO string will be identical for a given date
     * no matter what its timezone is.
     */
    return toUtcIsoString(getNowFullDate(utcTimezone));
}

/**
 * Get the time right now as a {@link FullDate} represented in the current user's timezone.
 *
 * @category Now
 * @example
 *
 * ```ts
 * import {getNowInUserTimezone} from 'date-vir';
 *
 * getNowInUserTimezone();
 * ```
 */
export function getNowInUserTimezone(): FullDate {
    return getNowFullDate(userTimezone);
}

/**
 * Get the time right now as a {@link FullDate} represented in the UTC timezone.
 *
 * @category Now
 * @example
 *
 * ```ts
 * import {getNowInUtcTimezone} from 'date-vir';
 *
 * getNowInUtcTimezone();
 * ```
 */
export function getNowInUtcTimezone(): FullDate<UtcTimezone> {
    return getNowFullDate(utcTimezone);
}

/**
 * Get the time right now as a {@link FullDate} represented in the given timezone.
 *
 * @category Now
 * @example
 *
 * ```ts
 * import {getNowFullDate, utcTimezone, timezones} from 'date-vir';
 *
 * getNowFullDate(utcTimezone);
 * getNowFullDate(timezones['Australia/Brisbane']);
 * ```
 */
export function getNowFullDate<const SpecificTimezone extends Timezone>(
    timezone: SpecificTimezone,
): FullDate<SpecificTimezone> {
    return createFullDate(Date.now(), timezone);
}
