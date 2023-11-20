import {DateTime} from 'luxon';
import {isRunTimeType} from 'run-time-assertions';
import {Timezone} from '../timezone/timezone-names';
import {UtcTimezone, userTimezone, utcTimezone} from '../timezone/timezones';
import {DateLike} from './date-like';
import {FullDate} from './full-date-shape';
import {isValidFullDate} from './is-valid-full-date';
import {parseLuxonDateTime, toLuxonDateTime} from './luxon-date-time-conversion';

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
export function createFullDate<const SpecificTimezone extends Timezone = Timezone>(
    /** The original date representation to be converted into a FullDate. */
    dateLike: Readonly<DateLike>,
    /** The timezone that this date/time is meant for / originated from. */
    timezone: SpecificTimezone,
): FullDate<SpecificTimezone> {
    const dateTime = convertDateLikeToLuxonDateTime(dateLike, timezone);

    if (!dateTime || !dateTime.isValid) {
        throw new Error(`Failed to parse date input '${dateLike}'`);
    }

    return parseLuxonDateTime(dateTime, timezone);
}

/**
 * Creates and returns a new FullDate object with its values shifted to be the same original time
 * but represented in a new timezone.
 */
export function toNewTimezone<const SpecificTimezone extends Timezone = Timezone>(
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
    } else if (isRunTimeType(dateLike, 'number')) {
        return DateTime.fromMillis(dateLike, {zone: utcTimezone}).setZone(timezone);
    } else if (isRunTimeType(dateLike, 'string')) {
        const dateTime = DateTime.fromISO(dateLike, {zone: timezone});

        if (!dateTime.isValid) {
            return lastDitchConversion(dateLike);
        }

        return dateTime;
    } else if (dateLike instanceof Date) {
        const dateTime = DateTime.fromJSDate(dateLike);
        return dateTime.setZone(timezone);
    }

    return lastDitchConversion(dateLike);
}

export function getNowFullDate<const SpecificTimezone extends Timezone = Timezone>(
    timezone: SpecificTimezone,
): FullDate<SpecificTimezone> {
    return createFullDate(Date.now(), timezone);
}
