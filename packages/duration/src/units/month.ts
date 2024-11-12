/**
 * Names of all months in English.
 *
 * @category Unit
 */
export enum MonthName {
    January = 'January',
    February = 'February',
    March = 'March',
    April = 'April',
    May = 'May',
    June = 'June',
    July = 'July',
    August = 'August',
    September = 'September',
    October = 'October',
    November = 'November',
    December = 'December',
}

/**
 * A type for all valid month numbers. (1-12)
 *
 * @category Unit
 */
export type MonthNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Bounds for valid month numbers.
 *
 * @category Util
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
 * @category Util
 */
export const dayOfMonthBounds = {
    min: 1,
    max: 31,
} as const satisfies Record<'min' | 'max', DayOfMonth>;
