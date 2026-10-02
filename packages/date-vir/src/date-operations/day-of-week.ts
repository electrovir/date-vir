import {dayOfWeekNameOrder, type DayOfWeekIndex, type DayOfWeekName} from '@date-vir/duration';
import {type FullDate} from '../full-date/full-date-shape.js';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion.js';

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
    return dayOfWeekNameOrder[(toLuxonDateTime(date).weekday % 7) as DayOfWeekIndex];
}
