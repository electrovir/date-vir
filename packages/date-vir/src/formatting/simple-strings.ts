import {check} from '@augment-vir/assert';
import type {SetOptionalAndNullable} from '@augment-vir/common';
import {FullDate} from '../full-date/full-date-shape.js';
import {JustDateString, JustTimeString, JustTimeWithSecondsString} from './string-format-types.js';

/**
 * Create a string based on just the date parts of a FullDate.
 *
 * **CAUTION**: this does not user locale setting. Prefer {@link toLocaleString} whenever possible.
 *
 * Example output: `'2023-12-05'`
 *
 * @category Internals
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
 * **CAUTION**: this does not user locale setting. Prefer {@link toLocaleString} whenever possible.
 *
 * Example output: `'05:32:21'`
 *
 * @category Internals
 */
export function toSimpleTimePartString(
    fullDate: Pick<FullDate, 'hour' | 'minute' | 'second'> | Pick<FullDate, 'hour' | 'minute'>,
    includeSeconds: boolean,
): JustTimeWithSecondsString | JustTimeString {
    const seconds =
        check.hasKey(fullDate, 'second') && includeSeconds
            ? String(Math.abs(fullDate.second)).padStart(2, '0')
            : undefined;

    const timeParts = [
        String(Math.abs(fullDate.hour)).padStart(2, '0'),
        String(Math.abs(fullDate.minute)).padStart(2, '0'),
        seconds,
    ].filter(check.isTruthy);

    return timeParts.join(':') as JustTimeWithSecondsString | JustTimeString;
}

/**
 * The parts of {@link FullDate} required for {@link toDatePartStrings}.
 *
 * @category Internals
 */
export type FullDateForParts = SetOptionalAndNullable<FullDate, 'millisecond'>;

/**
 * Splits a FullDate up into multiple formatted string representations.
 *
 * **CAUTION**: this does not user locale setting. Prefer {@link toLocaleString} whenever possible.
 *
 * This uses numbers for everything.
 *
 * @category Formatting
 * @example
 *
 * ```ts
 * import {toDatePartStrings, utcTimezone} from 'date-vir';
 *
 * const result = toDatePartStrings(
 *     {
 *         year: 2024,
 *         month: 4,
 *         day: 24,
 *         hour: 6,
 *         minute: 4,
 *         second: 9,
 *         millisecond: 123,
 *         timezone: utcTimezone,
 *     },
 *     {includeSeconds: true},
 * );
 * // outputs:
 * const result = {
 *     date: '2024-04-24',
 *     time: '06:04:09',
 *     timezone: 'UTC',
 * };
 * ```
 */
export function toDatePartStrings(
    fullDate: FullDateForParts,
    options: {
        includeSeconds: true;
    },
): {
    date: JustDateString;
    time: JustTimeWithSecondsString;
    timezone: string;
};
/**
 * Splits a FullDate up into multiple formatted string representations.
 *
 * **CAUTION**: this does not user locale setting. Prefer {@link toLocaleString} whenever possible.
 *
 * This uses numbers for everything.
 *
 * @category Formatting
 * @example
 *
 * ```ts
 * import {toDatePartStrings, utcTimezone} from 'date-vir';
 *
 * const result = toDatePartStrings(
 *     {
 *         year: 2024,
 *         month: 4,
 *         day: 24,
 *         hour: 6,
 *         minute: 4,
 *         second: 9,
 *         millisecond: 123,
 *         timezone: utcTimezone,
 *     },
 *     {includeSeconds: true},
 * );
 * // outputs:
 * const result = {
 *     date: '2024-04-24',
 *     time: '06:04:09',
 *     timezone: 'UTC',
 * };
 * ```
 */
export function toDatePartStrings(
    fullDate: SetOptionalAndNullable<FullDateForParts, 'second'>,
    options: {
        includeSeconds: false;
    },
): {
    date: JustDateString;
    time: JustTimeString;
    timezone: string;
};
/**
 * Splits a FullDate up into multiple formatted string representations.
 *
 * **CAUTION**: this does not user locale setting. Prefer {@link toLocaleString} whenever possible.
 *
 * This uses numbers for everything.
 *
 * @category Formatting
 * @example
 *
 * ```ts
 * import {toDatePartStrings, utcTimezone} from 'date-vir';
 *
 * const result = toDatePartStrings(
 *     {
 *         year: 2024,
 *         month: 4,
 *         day: 24,
 *         hour: 6,
 *         minute: 4,
 *         second: 9,
 *         millisecond: 123,
 *         timezone: utcTimezone,
 *     },
 *     {includeSeconds: true},
 * );
 * // outputs:
 * const result = {
 *     date: '2024-04-24',
 *     time: '06:04:09',
 *     timezone: 'UTC',
 * };
 * ```
 */
export function toDatePartStrings(
    fullDate: FullDateForParts,
    options: {
        includeSeconds: boolean;
    },
): {
    date: JustDateString;
    time: JustTimeWithSecondsString | JustTimeString;
    timezone: string;
};
/**
 * Splits a FullDate up into multiple formatted string representations.
 *
 * **CAUTION**: this does not user locale setting. Prefer {@link toLocaleString} whenever possible.
 *
 * This uses numbers for everything.
 *
 * @category Formatting
 * @example
 *
 * ```ts
 * import {toDatePartStrings, utcTimezone} from 'date-vir';
 *
 * const result = toDatePartStrings(
 *     {
 *         year: 2024,
 *         month: 4,
 *         day: 24,
 *         hour: 6,
 *         minute: 4,
 *         second: 9,
 *         millisecond: 123,
 *         timezone: utcTimezone,
 *     },
 *     {includeSeconds: true},
 * );
 * // outputs:
 * const result = {
 *     date: '2024-04-24',
 *     time: '06:04:09',
 *     timezone: 'UTC',
 * };
 * ```
 */
export function toDatePartStrings(
    fullDate: SetOptionalAndNullable<FullDateForParts, 'second'>,
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
 * **CAUTION**: this does not user locale setting. Prefer {@link toLocaleString} whenever possible.
 *
 * @category Formatting
 * @example
 *
 * ```ts
 * import {toSimpleString} from 'date-vir';
 *
 * const result = toSimpleString(
 *     {
 *         year: 2024,
 *         month: 4,
 *         day: 24,
 *         hour: 6,
 *         minute: 4,
 *         second: 9,
 *         millisecond: 123,
 *         timezone: utcTimezone,
 *     },
 *     {
 *         includeSeconds: false,
 *         includeTimezone: false,
 *     },
 * );
 * // outputs:
 * result = '2024-04-24 06:04';
 * ```
 */
export function toSimpleString(
    fullDate: FullDateForParts,
    options: {includeSeconds: boolean; includeTimezone: boolean},
): string {
    const parts = toDatePartStrings(fullDate, options);

    const stringParts = [
        parts.date,
        parts.time,
        options.includeTimezone && `(${parts.timezone})`,
    ].filter(check.isTruthy);

    return stringParts.join(' ');
}
