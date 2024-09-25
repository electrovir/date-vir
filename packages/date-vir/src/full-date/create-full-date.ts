import {DateTime} from 'luxon';

import {check} from '@augment-vir/assert';
import {Timezone} from '../timezone/timezone-names.js';
import {UtcTimezone, userTimezone, utcTimezone} from '../timezone/timezones.js';
import {DateLike} from './date-like.js';
import {FullDate} from './full-date-shape.js';
import {isValidFullDate} from './is-valid-full-date.js';
import {parseLuxonDateTime, toLuxonDateTime} from './luxon-date-time-conversion.js';
import {parseDateString} from './string-parsing.js';

export function createFullDateInUserTimezone(dateLike: Readonly<DateLike>): FullDate {
    return createFullDate(dateLike, userTimezone);
}

export function createUtcFullDate(dateLike: Readonly<DateLike>): FullDate<UtcTimezone> {
    return createFullDate(dateLike, utcTimezone);
}

/**
 * Parses the given dateLike and then reads the fullDate properties from that parsed value as if it
 * were in the given timezone.
 */
export function createFullDate<const SpecificTimezone extends Timezone>(
    /** The original date representation to be converted into a FullDate. */
    dateLike: Readonly<DateLike>,
    /** The timezone that this date/time is meant for / originated from. */
    timezone: SpecificTimezone,
): FullDate<SpecificTimezone> {
    const dateTime = convertDateLikeToLuxonDateTime(dateLike, timezone);

    if (!dateTime?.isValid) {
        throw new Error(`Failed to parse date input '${dateLike}'`);
    }

    return parseLuxonDateTime(dateTime, timezone);
}

/**
 * Creates and returns a new FullDate object with its values shifted to be the same original time
 * but represented in a new timezone.
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
    DateTime.fromFormat;
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

export function getNowFullDate<const SpecificTimezone extends Timezone>(
    timezone: SpecificTimezone,
): FullDate<SpecificTimezone> {
    return createFullDate(Date.now(), timezone);
}
