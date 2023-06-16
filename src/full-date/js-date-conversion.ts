import {FullDate} from './full-date-shape';
import {toTimestamp} from './primitive-conversions';

export function toJsDate(fullDate: FullDate): Date {
    return new Date(toTimestamp(fullDate));
}
