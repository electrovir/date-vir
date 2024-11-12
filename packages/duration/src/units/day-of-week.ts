/**
 * The names of each day of the week, in English and capitalized.
 *
 * @category Unit
 */
export enum DayOfWeekName {
    Sunday = 'Sunday',
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
}

/**
 * All valid day of the week indexes as a type. 0 = Sunday and 6 = Saturday.
 *
 * @category Unit
 */
export type DayOfWeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Bounds for valid day of the week indexes.
 *
 * @category Util
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
