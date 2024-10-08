import type {AnyDuration} from '@date-vir/duration';
import {FullDate} from '../full-date/full-date-shape.js';
import {parseLuxonDateTime, toLuxonDateTime} from '../full-date/luxon-date-time-conversion.js';
import {Timezone} from '../timezone/timezones.js';

/**
 * Calculates a new date starting at the given fullDate and adding the given offsets. Offsets can be
 * negative to go backwards in time.
 *
 * @category Calculation
 * @example
 *
 * ```ts
 * import {calculateRelativeDate} from 'date-vir';
 *
 * calculateRelativeDate(getNowInUserTimezone(), {days: 2});
 * ```
 */
export function calculateRelativeDate<const SpecificTimezone extends Timezone>(
    fullDate: Readonly<FullDate<SpecificTimezone>>,
    offset: Readonly<AnyDuration>,
): FullDate<SpecificTimezone> {
    return parseLuxonDateTime(toLuxonDateTime(fullDate).plus(offset));
}
