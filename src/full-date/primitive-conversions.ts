import {PartialAndUndefined, RequiredBy, getEnumTypedValues} from '@augment-vir/common';
import {SetOptional} from 'type-fest';
import {userLocale} from '../locales';
import {utcTimezone} from '../timezone/timezones';
import {DatePart, FullDate, FullDatePartEnum} from './full-date-shape';
import {toLuxonDateTime} from './luxon-date-time-conversion';
import {
    JustDateString,
    JustTimeString,
    JustTimeWithSecondsString,
    UtcIsoString,
} from './string-format-types';

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

/** Converts the given FullDate into a string in the user's locale, or the given localeOverride. */
export function toLocaleString(
    fullDate: FullDate,
    formatOptions?:
        | (Intl.DateTimeFormatOptions & PartialAndUndefined<{locale: string}>)
        | undefined,
): string {
    return toLuxonDateTime(fullDate).toLocaleString(
        {
            ...formatOptions,
        },
        {
            locale: formatOptions?.locale ?? userLocale,
        },
    );
}

/**
 * Provides arbitrary date formatting using Luxon. For full details on the options for the format
 * string input, see https://moment.github.io/luxon/#/formatting?id=table-of-tokens
 *
 * You probably should **prefer toLocaleString** so your users see the format they expect. It
 * already has many formatting options.
 */
export function toFormattedString(
    fullDate: FullDate,
    format: string,
    localeOverride: string = userLocale,
): string {
    return toLuxonDateTime(fullDate).toFormat(format, {locale: localeOverride});
}

type OnlyDatePart = SetOptional<DatePart, 'timezone'>;
type HourMinutePart = RequiredBy<Partial<FullDate>, 'hour' | 'minute'>;
type HourMinuteSecondPart = RequiredBy<Partial<FullDate>, 'hour' | 'minute' | 'second'>;

/**
 * Converts a FullDate object into a string that is understood by type="date" or type="time"
 * HTMLInputElement instances. Can optionally include seconds as well for type="time".
 *
 * This function ignores the timezone, the literal stored date and time numbers are simply
 * concatenated into a string. If you wish to convert time zones, first call toNewTimezone on your
 * FullDate object.
 */
export function toHtmlInputString(
    fullDate: OnlyDatePart,
    inputType: FullDatePartEnum.Date,
): JustDateString;
export function toHtmlInputString(
    fullDate: HourMinutePart,
    inputType: FullDatePartEnum.Time,
    includeSeconds?: false | undefined,
): JustTimeString;
export function toHtmlInputString(
    fullDate: HourMinuteSecondPart,
    inputType: FullDatePartEnum.Time,
    includeSeconds: true,
): JustTimeWithSecondsString;
export function toHtmlInputString(
    fullDate: HourMinutePart | HourMinuteSecondPart,
    inputType: FullDatePartEnum.Time,
    includeSeconds?: boolean | undefined,
): JustTimeWithSecondsString | JustTimeString;
export function toHtmlInputString(
    fullDate: HourMinuteSecondPart | OnlyDatePart,
    inputType: FullDatePartEnum,
    includeSeconds: true,
): JustDateString | JustTimeWithSecondsString;
export function toHtmlInputString(
    fullDate: HourMinutePart | OnlyDatePart,
    inputType: FullDatePartEnum,
    includeSeconds?: false | undefined,
): JustDateString | JustTimeString;
export function toHtmlInputString(
    fullDate: HourMinutePart | HourMinuteSecondPart | OnlyDatePart,
    inputType: FullDatePartEnum,
    includeSeconds?: boolean | undefined,
): JustDateString | JustTimeWithSecondsString | JustTimeString;
export function toHtmlInputString(
    fullDate: HourMinutePart | HourMinuteSecondPart | OnlyDatePart,
    inputType: FullDatePartEnum,
    includeSeconds?: boolean | undefined,
): JustDateString | JustTimeWithSecondsString | JustTimeString {
    if (inputType === FullDatePartEnum.Date) {
        if (fullDate.year == undefined) {
            throw new Error(`Tried to create date string but no year was provided.`);
        }
        if (fullDate.month == undefined) {
            throw new Error(`Tried to create date string but no month was provided.`);
        }
        if (fullDate.day == undefined) {
            throw new Error(`Tried to create date string but no day was provided.`);
        }

        const dateParts = [
            String(Math.abs(fullDate.year)).padStart(4, '0'),
            String(Math.abs(fullDate.month)).padStart(2, '0'),
            String(Math.abs(fullDate.day)).padStart(2, '0'),
        ] as const;
        return dateParts.join('-') as JustDateString;
    } else if (inputType === FullDatePartEnum.Time) {
        if (includeSeconds && fullDate.second == undefined) {
            throw new Error(
                'Tried to include seconds in the time string but no seconds were provided.',
            );
        }
        if (fullDate.hour == undefined) {
            throw new Error(`Tried to create time string but no hour was provided.`);
        }
        if (fullDate.minute == undefined) {
            throw new Error(`Tried to create time string but no minutes were provided.`);
        }

        const timeParts = [
            String(Math.abs(fullDate.hour)).padStart(2, '0'),
            String(Math.abs(fullDate.minute)).padStart(2, '0'),
            includeSeconds ? String(Math.abs(fullDate.second ?? 0)).padStart(2, '0') : undefined,
        ].filter((entry) => entry != undefined);

        return timeParts.join(':') as JustTimeWithSecondsString | JustTimeString;
    } else {
        throw new Error(
            `Unexpected inputTyped: '${inputType}'. Expected usage of FullDatePartEnum or one of ${getEnumTypedValues(
                FullDatePartEnum,
            ).join(', ')}.`,
        );
    }
}
