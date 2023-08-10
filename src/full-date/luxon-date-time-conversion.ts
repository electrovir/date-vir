import {omitObjectKeys} from '@augment-vir/common';
import {DateTime} from 'luxon';
import {Timezone} from '../timezone/timezone-names';
import {FullDate} from './full-date-shape';

/**
 * Converts a FullDate object into a Luxon DateTime library. This is only needed if you need complex
 * operations on dates. It does, however, internally power a lot of the date-vir functionality as it
 * uses the Luxon library for conversions between timezones.
 */
export function toLuxonDateTime(fullDateInput: FullDate): DateTime {
    const dateTime: DateTime = DateTime.fromObject(omitObjectKeys(fullDateInput, ['timezone']), {
        zone: fullDateInput.timezone,
    });

    /** Ignore this edge case in coverage cause idk how to trigger it. */
    /* c8 ignore next 3 */
    if (!dateTime.isValid) {
        throw new Error(dateTime.invalidExplanation ?? undefined);
    }

    return dateTime;
}

/**
 * Convert a Luxon DateTime object into a DateTime object. Used internally inside of date-vir, but
 * could be helpful if you need it. Usually you should prefer using the createFullDate function
 * instead.
 */
export function parseLuxonDateTime(dateTimeInput: DateTime, forcedTimezone?: Timezone): FullDate {
    if (!dateTimeInput.isValid) {
        throw new Error(`Invalid input: '${dateTimeInput.toISO()}'`);
    }

    return {
        day: dateTimeInput.day,
        month: dateTimeInput.month,
        year: dateTimeInput.year,
        hour: dateTimeInput.hour,
        minute: dateTimeInput.minute,
        second: dateTimeInput.second,
        millisecond: dateTimeInput.millisecond,
        timezone: forcedTimezone ?? (dateTimeInput.zoneName as Timezone),
    };
}
