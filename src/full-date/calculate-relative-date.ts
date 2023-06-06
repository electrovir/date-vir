import {DurationLikeObject} from 'luxon';
import {FullDate} from './full-date-shape';
import {parseLuxonDateTime, toLuxonDateTime} from './luxon-date-time-conversion';

export type RelativeDuration = DurationLikeObject;

export function calculateRelativeDate(
    fullDate: FullDate,
    relativeCalculation: RelativeDuration,
): FullDate {
    return parseLuxonDateTime(toLuxonDateTime(fullDate).plus(relativeCalculation));
}
