import {isTruthy, typedHasProperty} from '@augment-vir/common';
import {FullDate} from '../full-date/full-date-shape';
import {JustDateString, JustTimeString, JustTimeWithSecondsString} from './string-format-types';

/**
 * Create a string based on just the date parts of a FullDate.
 *
 * CAUTION: this does not user locale setting and should therefore not be used for user-facing date
 * formatting. Prefer using `toLocaleString` instead for user-facing strings.
 *
 * Example output: `'2023-12-05'`
 */
export function toSimpleDatePartString(
    fullDate: Pick<FullDate, 'year' | 'month' | 'day'>,
): JustDateString {
    const dateParts = [
        String(Math.abs(fullDate.year)).padStart(4, '0'),
        String(Math.abs(fullDate.month)).padStart(2, '0'),
        String(Math.abs(fullDate.day)).padStart(2, '0'),
    ] as const;

    const dateString = dateParts.join('-') as JustDateString;

    return dateString;
}

/**
 * Creates a string based on just the time parts of a FullDate.
 *
 * CAUTION: this does not user locale setting and should therefore not be used for user-facing date
 * formatting. Prefer using `toLocaleString` instead for user-facing strings.
 *
 * Example output: `'05:32:21'`
 */
export function toSimpleTimePartString(
    fullDate: Pick<FullDate, 'hour' | 'minute' | 'second'>,
    includeSeconds: true,
): JustTimeWithSecondsString;
export function toSimpleTimePartString(
    fullDate: Pick<FullDate, 'hour' | 'minute'>,
    includeSeconds: false,
): JustTimeString;
export function toSimpleTimePartString(
    fullDate: Pick<FullDate, 'hour' | 'minute' | 'second'> | Pick<FullDate, 'hour' | 'minute'>,
    includeSeconds: boolean,
): JustTimeWithSecondsString | JustTimeString;
export function toSimpleTimePartString(
    fullDate: Pick<FullDate, 'hour' | 'minute' | 'second'> | Pick<FullDate, 'hour' | 'minute'>,
    includeSeconds: boolean,
): JustTimeWithSecondsString | JustTimeString {
    const seconds =
        typedHasProperty(fullDate, 'second') && includeSeconds
            ? String(Math.abs(fullDate.second)).padStart(2, '0')
            : undefined;

    const timeParts = [
        String(Math.abs(fullDate.hour)).padStart(2, '0'),
        String(Math.abs(fullDate.minute)).padStart(2, '0'),
        seconds,
    ].filter(isTruthy);

    return timeParts.join(':') as JustTimeWithSecondsString | JustTimeString;
}

export type FullDateForParts = Omit<FullDate, 'millisecond'>;

/**
 * Splits a FullDate up into multiple formatted string representations.
 *
 * CAUTION: this does not user locale setting and should therefore not be used for user-facing date
 * formatting. Prefer using `toLocaleString` instead for user-facing strings.
 *
 * This does not expand month names into the full names, it just uses numbers for everything. The
 * output of this will look like:
 *
 * ```typescript
 * {
 *     "date": "2012-12-05",
 *     "time": "05:32:21",
 *     "timezone": "UTC"
 * }
 * ```
 */
export function toSimplePartStrings(
    fullDate: FullDateForParts,
    options: {includeSeconds: true},
): {
    date: JustDateString;
    time: JustTimeWithSecondsString;
    timezone: string;
};
export function toSimplePartStrings(
    fullDate: FullDateForParts,
    options: {includeSeconds: false},
): {
    date: JustDateString;
    time: JustTimeString;
    timezone: string;
};
export function toSimplePartStrings(
    fullDate: FullDateForParts,
    options: {includeSeconds: boolean},
): {
    date: JustDateString;
    time: JustTimeWithSecondsString | JustTimeString;
    timezone: string;
};
export function toSimplePartStrings(
    fullDate: FullDateForParts,
    options: {includeSeconds: boolean},
): {
    date: JustDateString;
    time: JustTimeWithSecondsString | JustTimeString;
    timezone: string;
} {
    return {
        date: toSimpleDatePartString(fullDate),
        time: toSimpleTimePartString(fullDate, options.includeSeconds),
        timezone: fullDate.timezone,
    };
}

/**
 * Converts a date into a simple, unambiguous date string.
 *
 * CAUTION: this does not user locale setting and should therefore not be used for user-facing date
 * formatting. Prefer using `toLocaleString` instead for user-facing strings.
 */
export function toSimpleString(
    fullDate: FullDateForParts,
    options: {includeSeconds: boolean; includeTimezone: boolean},
): string {
    const parts = toSimplePartStrings(fullDate, options);

    const stringParts = [
        parts.date,
        parts.time,
        options.includeTimezone && `(${parts.timezone})`,
    ].filter(isTruthy);

    return stringParts.join(' ');
}
