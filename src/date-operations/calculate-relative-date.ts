import {FullDate} from '../full-date/full-date-shape';
import {parseLuxonDateTime, toLuxonDateTime} from '../full-date/luxon-date-time-conversion';
import {RelativeTimeDuration} from '../relative-time-duration';

export function calculateRelativeDate(
    fullDate: FullDate,
    relativeCalculation: RelativeTimeDuration,
): FullDate {
    return parseLuxonDateTime(toLuxonDateTime(fullDate).plus(relativeCalculation));
}
