import {AnyDuration} from '../duration';
import {FullDate} from '../full-date/full-date-shape';
import {parseLuxonDateTime, toLuxonDateTime} from '../full-date/luxon-date-time-conversion';

/**
 * Calculates a new date starting at the given fullDate and adding the given offsets. Offsets can be
 * negative to go backwards in time.
 */
export function calculateRelativeDate(
    fullDate: Readonly<FullDate>,
    offset: Readonly<AnyDuration>,
): FullDate {
    return parseLuxonDateTime(toLuxonDateTime(fullDate).plus(offset));
}
