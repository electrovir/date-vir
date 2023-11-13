import {PartialAndUndefined} from '@augment-vir/common';
import {FullDate} from '../full-date/full-date-shape';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion';
import {userLocale} from '../locales';

/**
 * Chromium has a weird behavior where the "NARROW NO-BREAK SPACE" character (code 8239) is used
 * instead of a space (code 32) before AM/PM.
 */
function fixChromiumSpace(original: string): string {
    return original.replace(new RegExp(String.fromCharCode(8239), 'g'), ' ');
}

/** Converts the given FullDate into a string in the user's locale, or the given localeOverride. */
export function toLocaleString(
    fullDate: FullDate,
    formatOptions?:
        | (Intl.DateTimeFormatOptions & PartialAndUndefined<{locale: string}>)
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
    const formattedString = toLuxonDateTime(fullDate).toFormat(format, {locale: localeOverride});

    return fixChromiumSpace(formattedString);
}
