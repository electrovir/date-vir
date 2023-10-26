import {MaybeTuple} from '../augments/type';
import {DiffUnit, Duration} from '../duration';
import {FullDate} from '../full-date/full-date-shape';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion';

export function diffDates<const DurationKeys extends MaybeTuple<DiffUnit> = MaybeTuple<DiffUnit>>({
    start,
    end,
    unit,
}: {
    start: FullDate;
    end: FullDate;
    unit: DurationKeys;
}): Duration<DurationKeys> {
    const luxonDateStart = toLuxonDateTime(start);
    const luxonDateEnd = toLuxonDateTime(end);

    const diff = luxonDateEnd.diff(luxonDateStart, unit as DiffUnit | DiffUnit[]).toObject();

    return diff as Duration<DurationKeys>;
}

export function isDateAfter({start, end}: {start: FullDate; end: FullDate}): boolean {
    return diffDates({start, end, unit: DiffUnit.Milliseconds}).milliseconds >= 0;
}
