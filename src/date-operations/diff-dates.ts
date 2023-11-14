import {MaybeTuple} from '../augments/type';
import {Duration, DurationUnit} from '../duration';
import {FullDate} from '../full-date/full-date-shape';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion';

/**
 * Diffs two dates and returns the diff in the specific unit.
 *
 * Note: when years, quarters, or months are used for the unit then "long term" durations are used
 * to calculate the diff. See more details here:
 * https://moment.github.io/luxon/#/math?id=casual-vs-longterm-conversion-accuracy
 */
export function diffDates<const ChosenDurationKey extends DurationUnit>({
    start,
    end,
    unit,
}: {
    start: FullDate;
    end: FullDate;
    unit: ChosenDurationKey;
}): Duration<ChosenDurationKey> {
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
