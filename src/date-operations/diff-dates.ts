import {MaybeTuple} from '../augments/type';
import {Duration, DurationUnit} from '../duration';
import {FullDate} from '../full-date/full-date-shape';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion';

export function diffDates<
    const DurationKeys extends MaybeTuple<DurationUnit> = MaybeTuple<DurationUnit>,
>({
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

    const diff = luxonDateEnd
        .diff(luxonDateStart, unit as DurationUnit | DurationUnit[])
        .toObject();

    return diff as Duration<DurationKeys>;
}

export function isDateAfter({
    relativeTo,
    fullDate,
}: {
    relativeTo: FullDate;
    fullDate: FullDate;
}): boolean {
    return (
        diffDates({start: relativeTo, end: fullDate, unit: DurationUnit.Milliseconds})
            .milliseconds >= 0
    );
}
