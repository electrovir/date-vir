import {toTimestamp} from '../formatting/timestamp';
import {FullDate} from '../full-date/full-date-shape';

export function toJsDate(fullDate: FullDate): Date {
    return new Date(toTimestamp(fullDate));
}
