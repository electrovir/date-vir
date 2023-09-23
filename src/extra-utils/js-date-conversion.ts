import {FullDate} from '../full-date/full-date-shape';
import {toTimestamp} from '../full-date/primitive-conversions';

export function toJsDate(fullDate: FullDate): Date {
    return new Date(toTimestamp(fullDate));
}
