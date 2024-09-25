import {type PartialWithUndefined} from '@augment-vir/common';
import {type FullDate} from '../full-date/full-date-shape.js';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion.js';
import {userLocale} from '../locales.js';

/**
 * Chromium has a weird behavior where the "NARROW NO-BREAK SPACE" character (code 8239) is used
 * instead of a space (code 32) before AM/PM.
 */
function fixChromiumSpace(original: string): string {
    return original.replace(new RegExp(String.fromCodePoint(8239), 'g'), ' ');
}

/**
 * Converts the given {@link FullDate} into a string based the user's locale, or the given locale
 * options.
 *
 * @category Formatting
 * @example
 *
 * ```ts
 * import {toLocaleString} from 'date-vir';
 *
 * ToLocaleString({
 *     year: 2024,
 *     month: 9,
 *     day: 25,
 *     hour: 0,
 *     minute: 0,
 *     second: 0,
 *     millisecond: 0,
 * });
 * // `'9/25/2024'` in my locale, yours may be different
 * ```
 */
export function toLocaleString(
    fullDate: FullDate,
    /** Defaults to using the user's own locale. */
    formatOptions?:
        | (Intl.DateTimeFormatOptions & PartialWithUndefined<{locale: string}>)
        | undefined,
): string {
    const localeString = toLuxonDateTime(fullDate).toLocaleString(
        {
            ...formatOptions,
        },
        {
            locale: formatOptions?.locale ?? userLocale,
        },
    );

    return fixChromiumSpace(localeString);
}

/**
 * Provides arbitrary date formatting control (using Luxon under the hood). For full details on the
 * options for format control, see https://moment.github.io/luxon/#/formatting?id=table-of-tokens
 *
 * In most cases you should prefer {@link toLocaleString} so your users see the format they expect.
 * {@link toLocaleString} already has many formatting options.
 *
 * @category Formatting
 * @example
 *
 * ```ts
 * import {toFormattedString} from 'date-vir';
 *
 * toFormattedString(
 *     {
 *         year: 2024,
 *         month: 9,
 *         day: 25,
 *         hour: 0,
 *         minute: 0,
 *         second: 0,
 *         millisecond: 0,
 *     },
 *     'MMM-yyyy',
 * );
 * // `'Sep-2024'`
 * ```
 */
export function toFormattedString(
    fullDate: FullDate,
    format: string,
    localeOverride: string = userLocale,
): string {
    const formattedString = toLuxonDateTime(fullDate).toFormat(format, {locale: localeOverride});

    return fixChromiumSpace(formattedString);
}
