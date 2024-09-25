import {DateTime} from 'luxon';

import {check} from '@augment-vir/assert';
import {stringify} from '@augment-vir/common';
import {Timezone, UtcTimezone, userTimezone, utcTimezone} from '../timezone/timezones.js';
import {DateLike} from './date-like.js';
import {FullDate} from './full-date-shape.js';
import {isValidFullDate} from './is-valid-full-date.js';
import {parseLuxonDateTime, toLuxonDateTime} from './luxon-date-time-conversion.js';
import {parseDateString} from './string-parsing.js';

/**
 * Parses the given {@link DateLike} and converts it into a {@link FullDate} instance with the user's
 * current timezone.
 *
 * @category FullDate
 * @example
 *
 * ```ts
 * import {createFullDateInUserTimezone} from 'date-vir';
 *
 * createFullDateInUserTimezone('June 1, 2024');
 * createFullDateInUserTimezone(new Date());
 * createFullDateInUserTimezone(112300120);
 * ```
 */
export function createFullDateInUserTimezone(dateLike: Readonly<DateLike>): FullDate {
    return createFullDate(dateLike, userTimezone);
}

/**
 * Parses the given {@link DateLike} and converts it into a {@link FullDate} instance with the UTC
 * timezone.
 *
 * @category FullDate
 * @example
 *
 * ```ts
 * import {createUtcFullDate} from 'date-vir';
 *
 * createUtcFullDate('June 1, 2024');
 * createUtcFullDate(new Date());
 * createUtcFullDate(112300120);
 * ```
 */
export function createUtcFullDate(dateLike: Readonly<DateLike>): FullDate<UtcTimezone> {
    return createFullDate(dateLike, utcTimezone);
}

/**
 * Parses the given {@link DateLike} and converts it into a {@link FullDate} instance with the given
 * timezone.
 *
 * @category FullDate
 * @example
 *
 * ```ts
 * import {createFullDate, timezones, utcTimezone} from 'date-vir';
 *
 * createFullDate('June 1, 2024', utcTimezone);
 * createFullDate(new Date(), timezones['Australia/Brisbane']);
 * createFullDate(112300120, timezones['Etc/GMT-11']);
 * ```
 */
export function createFullDate<const SpecificTimezone extends Timezone>(
    /** The original date representation to be converted into a FullDate. */
    dateLike: Readonly<DateLike>,
    /** The timezone that this date/time is meant for / originated from. */
    timezone: SpecificTimezone,
): FullDate<SpecificTimezone> {
    const dateTime = convertDateLikeToLuxonDateTime(dateLike, timezone);

    if (!dateTime?.isValid) {
        throw new Error(`Failed to parse date input ${stringify(dateLike)}`);
    }

    return parseLuxonDateTime(dateTime, timezone);
}

/**
 * Converts a {@link FullDate} instance into a new instance with the original's date and time
 * represented in the new timezone.
 *
 * @category Conversion
 * @example
 *
 * ```ts
 * import {toNewTimezone} from 'date-vir';
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
 * let result = toNewTimezone(exampleDate, timezones['Australia/Brisbane']);
 * // output:
 * result = {
 *     year: 2024,
 *     month: 1,
 *     day: 5,
 *     hour: 11,
 *     minute: 1,
 *     second: 1,
 *     millisecond: 1,
 *     timezone: timezones['Australia/Brisbane'],
 * };
 * ```
 */
export function toNewTimezone<const SpecificTimezone extends Timezone>(
    fullDate: Readonly<FullDate>,
    timezone: SpecificTimezone,
): FullDate<SpecificTimezone> {
    if (fullDate.timezone === timezone) {
        return fullDate as FullDate<SpecificTimezone>;
    }

    return createFullDate(fullDate, timezone);
}

function lastDitchConversion(dateLike: Readonly<DateLike>): DateTime | undefined {
    /** As any cast for last ditch effort to convert the dateLike into a date. */
    const dateTime = DateTime.fromJSDate(new Date(dateLike as any));
    if (dateTime.isValid) {
        return dateTime;
    } else {
        return undefined;
    }
}

function convertDateLikeToLuxonDateTime(
    dateLike: Readonly<DateLike>,
    timezone: Timezone,
): DateTime | undefined {
    if (isValidFullDate(dateLike)) {
        dateLike = toLuxonDateTime(dateLike).toMillis();
    }

    if (DateTime.isDateTime(dateLike)) {
        return dateLike.setZone(timezone);
    } else if (check.isNumber(dateLike)) {
        return DateTime.fromMillis(dateLike, {zone: utcTimezone}).setZone(timezone);
    } else if (check.isString(dateLike)) {
        const parsedStringDate = parseDateString(dateLike, timezone);
        if (parsedStringDate) {
            return parsedStringDate;
        }
    } else if (dateLike instanceof Date) {
        const dateTime = DateTime.fromJSDate(dateLike);
        return dateTime.setZone(timezone);
    }

    return lastDitchConversion(dateLike);
}
