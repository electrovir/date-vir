import {type Subtract} from 'type-fest';
import {userLocale, type LocaleOptions} from '../locale.js';

/**
 * Names of all months in English. Don't use this for strings shown to the user, instead use
 * {@link getMonthNames}.
 *
 * @category Unit
 */
export enum MonthName {
    January = 'january',
    February = 'february',
    March = 'march',
    April = 'april',
    May = 'may',
    June = 'june',
    July = 'july',
    August = 'august',
    September = 'september',
    October = 'october',
    November = 'november',
    December = 'december',
}

/**
 * All English month names in order.
 *
 * @category Unit
 */
export const orderedMonthNames = [
    MonthName.January,
    MonthName.February,
    MonthName.March,
    MonthName.April,
    MonthName.May,
    MonthName.June,
    MonthName.July,
    MonthName.August,
    MonthName.September,
    MonthName.October,
    MonthName.November,
    MonthName.December,
] as const;

/**
 * A type for all valid month numbers. (1-12)
 *
 * @category Unit
 */
export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * A type for all valid month indexes. (0-11)
 *
 * @category Unit
 */
export type MonthIndex = Subtract<MonthNumber, 1>;

/**
 * Bounds for valid month numbers.
 *
 * @category Internal
 */
export const monthNumberBounds = {
    min: 1,
    max: 12,
} as const satisfies Record<'min' | 'max', MonthNumber>;

/**
 * A type for all valid days in a month. (1-31)
 *
 * @category Unit
 */
export type DayOfMonth =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31;

/**
 * Bounds for valid day of the month numbers.
 *
 * @category Internal
 */
export const dayOfMonthBounds = {
    min: 1,
    max: 31,
} as const satisfies Record<'min' | 'max', DayOfMonth>;

/**
 * Gets all month names in various formats with the given locale. Defaults to the current user's
 * locale.
 *
 * @category Language
 */
export function getMonthNames(options: Readonly<LocaleOptions> = {}) {
    return {
        long: getAbbreviatedMonthNames('long', options),
        short: getAbbreviatedMonthNames('short', options),
        narrow: getAbbreviatedMonthNames('narrow', options),
    };
}

function getAbbreviatedMonthNames(
    abbreviation: 'long' | 'short' | 'narrow',
    options: Readonly<LocaleOptions>,
) {
    const formatter = new Intl.DateTimeFormat(options.locale || userLocale, {month: abbreviation});

    const numbered: Record<MonthNumber, string> = {} as Record<MonthNumber, string>;
    const keyed: Record<MonthName, string> = {} as Record<MonthName, string>;
    const indexed: Record<MonthIndex, string> = {} as Record<MonthIndex, string>;

    for (const [
        i,
        orderedMonthName,
    ] of orderedMonthNames.entries()) {
        const day = formatter.format(new Date(2020, i, 1));
        numbered[(i + 1) as MonthNumber] = day;
        keyed[orderedMonthName as MonthName] = day;
        indexed[i as MonthIndex] = day;
    }

    return {
        numbered,
        keyed,
        indexed,
    };
}
