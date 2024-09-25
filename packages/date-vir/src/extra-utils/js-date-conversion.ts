import {toTimestamp} from '../formatting/timestamp.js';
import {FullDate} from '../full-date/full-date-shape.js';

export function toJsDate(fullDate: FullDate): Date {
    return new Date(toTimestamp(fullDate));
}
