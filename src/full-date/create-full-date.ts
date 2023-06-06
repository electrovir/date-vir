import {isRuntimeTypeOf} from '@augment-vir/common';
import {DateTime} from 'luxon';
import {Timezone} from '../timezone/timezone-names';
import {userTimezone, utcTimezone} from '../timezone/timezones';
import {DateLike} from './date-like';
import {FullDate} from './full-date-shape';
import {isValidFullDate} from './is-valid-full-date';
import {parseLuxonDateTime, toLuxonDateTime} from './luxon-date-time-conversion';

export function createFullDateInUserTimezone(dateLike: DateLike): FullDate {
    return createFullDate(dateLike, userTimezone);
}

export function createUtcFullDate(dateLike: DateLike): FullDate {
    return createFullDate(dateLike, utcTimezone);
}

/**
 * Parses the given dateLike and then reads the fullDate properties from that parsed value as if it
 * were in the given timezone.
 */
export function createFullDate(
    /** The original date representation to be converted into a FullDate. */
    dateLike: DateLike,
    /** The timezone that this date/time is meant for / originated from. */
    timezone: Timezone,
): FullDate {
    const dateTime = convertDateLikeToLuxonDateTime(dateLike, timezone);

    if (!dateTime || !dateTime.isValid) {
        throw new Error(`Failed to parse date input '${dateLike}'`);
    }

    return parseLuxonDateTime(dateTime);
}

/**
 * Creates and returns a new FullDate object with its values shifted to be the same original time
 * but represented in a new timezone.
 */
export function toNewTimezone(fullDate: FullDate, timezone: Timezone) {
    return createFullDate(fullDate, timezone);
}

function convertDateLikeToLuxonDateTime(
    dateLike: DateLike,
    timezone: Timezone,
): DateTime | undefined {
    if (isValidFullDate(dateLike)) {
        dateLike = toLuxonDateTime(dateLike).toMillis();
    }

    if (DateTime.isDateTime(dateLike)) {
        return dateLike.setZone(timezone);
    } else if (isRuntimeTypeOf(dateLike, 'number')) {
        return DateTime.fromMillis(dateLike, {zone: utcTimezone}).setZone(timezone);
    } else if (isRuntimeTypeOf(dateLike, 'string')) {
        const dateTime = DateTime.fromISO(dateLike, {zone: timezone});

        if (!dateTime.isValid) {
            throw new Error(
                `Failed to parse date string '${dateLike}': unexpected string format. Please use parseStringToFullDate instead to have more control over the parsing format.`,
            );
        }

        return dateTime;
    } else if (dateLike instanceof Date) {
        const dateTime = DateTime.fromJSDate(dateLike);
        return dateTime.setZone(timezone);
    }

    return undefined;
}

export function getNowFullDate(timezone: Timezone): FullDate {
    return createFullDate(Date.now(), timezone);
}
