import {PartialAndUndefined, getEnumTypedValues} from '@augment-vir/common';
import {userLocale} from '../locales';
import {utcTimezone} from '../timezone/timezones';
import {FullDate} from './full-date-shape';
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
    return toLuxonDateTime(fullDate)
        .setZone(utcTimezone)
        .toLocaleString(formatOptions, {
            locale: formatOptions?.locale ?? userLocale,
        });
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
    return toLuxonDateTime(fullDate)
        .setZone(utcTimezone)
        .toFormat(format, {locale: localeOverride});
}

/**
 * The different options for the "type" attribute in an <input> element that require specific
 * formatting relevant to dates.
 */
export enum HtmlInputElementTypeEnum {
    Date = 'date',
    Time = 'time',
}

/**
 * Converts a FullDate object into a string that is understood by type="date" or type="time"
 * HTMLInputElement instances. Can optionally include seconds as well for type="time".
 *
 * This does NO timezone operations, the literal stored date and time are simply concatenated into a
 * string. If you wish to convert time zones, first call createFullDate and give it a different time
 * zone.
 */
export function toHtmlInputString(
    fullDate: FullDate,
    inputType: HtmlInputElementTypeEnum.Date,
): JustDateString;
export function toHtmlInputString(
    fullDate: FullDate,
    inputType: HtmlInputElementTypeEnum.Time,
    includeSeconds?: false | undefined,
): JustTimeString;
export function toHtmlInputString(
    fullDate: FullDate,
    inputType: HtmlInputElementTypeEnum.Time,
    includeSeconds: true,
): JustTimeWithSecondsString;
export function toHtmlInputString(
    fullDate: FullDate,
    inputType: HtmlInputElementTypeEnum.Time,
    includeSeconds?: boolean | undefined,
): JustTimeWithSecondsString | JustTimeString;
export function toHtmlInputString(
    fullDate: FullDate,
    inputType: HtmlInputElementTypeEnum,
    includeSeconds: true,
): JustDateString | JustTimeWithSecondsString;
export function toHtmlInputString(
    fullDate: FullDate,
    inputType: HtmlInputElementTypeEnum,
    includeSeconds?: false | undefined,
): JustDateString | JustTimeString;
export function toHtmlInputString(
    fullDate: FullDate,
    inputType: HtmlInputElementTypeEnum,
    includeSeconds?: boolean | undefined,
): JustDateString | JustTimeWithSecondsString | JustTimeString;
export function toHtmlInputString(
    fullDate: FullDate,
    inputType: HtmlInputElementTypeEnum,
    includeSeconds?: boolean | undefined,
): JustDateString | JustTimeWithSecondsString | JustTimeString {
    if (inputType === HtmlInputElementTypeEnum.Date) {
        const dateParts = [
            fullDate.year,
            String(fullDate.month).padStart(2, '0'),
            String(fullDate.day).padStart(2, '0'),
        ] as const;
        return dateParts.join('-') as JustDateString;
    } else if (inputType === HtmlInputElementTypeEnum.Time) {
        const timeParts = [
            String(fullDate.hour).padStart(2, '0'),
            String(fullDate.minute).padStart(2, '0'),
            includeSeconds ? String(fullDate.second).padStart(2, '0') : undefined,
        ].filter((entry) => entry != undefined);

        return timeParts.join(':') as JustTimeWithSecondsString | JustTimeString;
    } else {
        throw new Error(
            `Unexpected inputTyped: '${inputType}'. Expected usage of HtmlInputElementTypeEnum or one of ${getEnumTypedValues(
                HtmlInputElementTypeEnum,
            ).join(', ')}.`,
        );
    }
}
