import {type Subtract} from 'type-fest';
import {type LocaleOptions, userLocale} from '../locale.js';

/**
 * An English key for named days of the week. Don't use this for actual day names, instead use
 * {@link getDayOfTheWeekNames}.
 *
 * @category Unit
 */
export enum DayOfWeekName {
    Sunday = 'sunday',
    Monday = 'monday',
    Tuesday = 'tuesday',
    Wednesday = 'wednesday',
    Thursday = 'thursday',
    Friday = 'friday',
    Saturday = 'saturday',
}

/**
 * All valid day of the week indexes as a type. 0 = Sunday and 6 = Saturday.
 *
 * @category Unit
 */
export type DayOfWeekIndex = Subtract<DayOfWeekNumber, 1>;

/**
 * All valid day of the week numbers as a type. 1 = Sunday and 7 = Saturday.
 *
 * @category Unit
 */
export type DayOfWeekNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Bounds for valid day of the week indexes.
 *
 * @category Internal
 */
export const dayOfWeekIndexBounds = {
    min: 0,
    max: 6,
} as const satisfies Record<'min' | 'max', DayOfWeekIndex>;

/**
 * Maps {@link DayOfWeekName} to {@link DayOfWeekIndex}.
 *
 * @category Util
 */
export const dayOfWeekNameToIndex = {
    [DayOfWeekName.Sunday]: 0,
    [DayOfWeekName.Monday]: 1,
    [DayOfWeekName.Tuesday]: 2,
    [DayOfWeekName.Wednesday]: 3,
    [DayOfWeekName.Thursday]: 4,
    [DayOfWeekName.Friday]: 5,
    [DayOfWeekName.Saturday]: 6,
} as const satisfies Record<DayOfWeekName, DayOfWeekIndex>;

/**
 * An array of {@link DayOfWeekName} in index order. This can be accessed by any
 * {@link DayOfWeekIndex} number.
 *
 * @category Util
 */
export const dayOfWeekNameOrder = [
    DayOfWeekName.Sunday,
    DayOfWeekName.Monday,
    DayOfWeekName.Tuesday,
    DayOfWeekName.Wednesday,
    DayOfWeekName.Thursday,
    DayOfWeekName.Friday,
    DayOfWeekName.Saturday,
] as const satisfies DayOfWeekName[];

/**
 * Output from {@link getDayOfTheWeekNames}.
 *
 * @category Internal
 */
export type DayOfWeekNames = Record<
    'short' | 'narrow' | 'long',
    {
        keyed: Record<DayOfWeekName, string>;
        indexed: Record<DayOfWeekIndex, string>;
        numbered: Record<DayOfWeekNumber, string>;
    }
>;

/**
 * Gets the names of the week in various formats for the given locale. Defaults to the current
 * user's locale.
 *
 * @category Language
 */
export function getDayOfTheWeekNames(options: Readonly<LocaleOptions> = {}): DayOfWeekNames {
    return {
        short: getAbbreviatedDayOfWeekNames('short', options),
        narrow: getAbbreviatedDayOfWeekNames('narrow', options),
        long: getAbbreviatedDayOfWeekNames('long', options),
    };
}

function getAbbreviatedDayOfWeekNames(
    format: NonNullable<Intl.DateTimeFormatOptions['weekday']>,
    options: Readonly<LocaleOptions>,
) {
    const formatter = new Intl.DateTimeFormat(options.locale || userLocale, {
        weekday: format,
    });

    const numbered: Record<DayOfWeekNumber, string> = {} as Record<DayOfWeekNumber, string>;
    const keyed: Record<DayOfWeekName, string> = {} as Record<DayOfWeekName, string>;
    const indexed: Record<DayOfWeekIndex, string> = {} as Record<DayOfWeekIndex, string>;

    for (let i = 0; i < dayOfWeekNameOrder.length; i++) {
        const day = formatter.format(new Date(2020, 0, i + 5));
        indexed[i as DayOfWeekIndex] = day;
        keyed[dayOfWeekNameOrder[i as DayOfWeekIndex]] = day;
        numbered[(i + 1) as DayOfWeekNumber] = day;
    }

    return {
        keyed,
        indexed,
        numbered,
    };
}
