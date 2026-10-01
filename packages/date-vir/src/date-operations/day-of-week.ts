import {dayOfWeekNameOrder, type DayOfWeekIndex, type DayOfWeekName} from '@date-vir/duration';
import {type FullDate} from '../full-date/full-date-shape.js';

/**
 * Get the day of the week that a {@link FullDate} falls on in its own timezone. To get the day of
 * the week in a different timezone, convert the date first with `toNewTimezone`.
 *
 * @category Calculation
 * @example
 *
 * ```ts
 * import {getDayOfWeek} from 'date-vir';
 *
 * getDayOfWeek({
 *     year: 2026,
 *     month: 10,
 *     day: 2,
 *
 *     hour: 23,
 *     minute: 30,
 *     second: 0,
 *     millisecond: 0,
 *
 *     timezone: 'America/Denver',
 * }); // outputs `DayOfWeekName.Friday` (even though this is a Saturday in UTC)
 * ```
 */
export function getDayOfWeek(date: Readonly<FullDate>): DayOfWeekName {
    /**
     * A FullDate's year, month, and day are already in its own timezone, so the weekday is plain
     * calendar math. `setUTCFullYear` is used instead of `Date.UTC` so that years 0-99 aren't
     * mapped to 1900-1999.
     */
    const jsDate = new Date(0);
    jsDate.setUTCFullYear(date.year, date.month - 1, date.day);

    return dayOfWeekNameOrder[jsDate.getUTCDay() as DayOfWeekIndex];
}
