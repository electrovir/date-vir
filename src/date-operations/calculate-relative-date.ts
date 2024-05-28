import {AnyDuration} from '../duration/duration';
import {FullDate} from '../full-date/full-date-shape';
import {parseLuxonDateTime, toLuxonDateTime} from '../full-date/luxon-date-time-conversion';
import {Timezone} from '../timezone/timezone-names';

/**
 * Calculates a new date starting at the given fullDate and adding the given offsets. Offsets can be
 * negative to go backwards in time.
 */
export function calculateRelativeDate<const SpecificTimezone extends Timezone>(
    fullDate: Readonly<FullDate<SpecificTimezone>>,
    offset: Readonly<AnyDuration>,
): FullDate<SpecificTimezone> {
    return parseLuxonDateTime(toLuxonDateTime(fullDate).plus(offset));
}
