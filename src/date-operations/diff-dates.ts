import {AtLeastTuple, RequiredAndNotNull} from '@augment-vir/common';
import {FullDate} from '../full-date/full-date-shape';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion';
import {RelativeTimeDuration} from '../relative-time-duration';

export type MaybeTuple<T> = T | AtLeastTuple<T, 1>;

/**
 * Exclude the higher order units of time measure for diffing because they vary significantly,
 * causing inaccuracies and many issues. See
 * https://moment.github.io/luxon/#/math?id=casual-vs-longterm-conversion-accuracy for more info.
 *
 * If you REALLY want to use these higher order units, convert the dates to luxon objects with
 * toLuxonDateTime and then run diff calculations there.
 */
export enum DiffUnit {
    Weeks = 'weeks',
    Days = 'days',
    Hours = 'hours',
    Minutes = 'minutes',
    Seconds = 'seconds',
    Milliseconds = 'milliseconds',
}

export type DiffDuration<DurationKeys extends MaybeTuple<DiffUnit>> =
    MaybeTuple<DiffUnit> extends DurationKeys
        ? Pick<RelativeTimeDuration, DiffUnit>
        : Pick<
              RequiredAndNotNull<RelativeTimeDuration>,
              DurationKeys extends AtLeastTuple<infer InnerValue, 1> ? InnerValue : DurationKeys
          >;

export type Duration<DurationKeys extends MaybeTuple<DiffUnit>> = DiffDuration<DurationKeys>;

export function diffDates<const DurationKeys extends MaybeTuple<DiffUnit> = MaybeTuple<DiffUnit>>({
    start,
    end,
    unit,
}: {
    start: FullDate;
    end: FullDate;
    unit: DurationKeys;
}): DiffDuration<DurationKeys> {
    const luxonDateStart = toLuxonDateTime(start);
    const luxonDateEnd = toLuxonDateTime(end);

    const diff = luxonDateEnd.diff(luxonDateStart, unit as DiffUnit | DiffUnit[]).toObject();

    return diff as DiffDuration<DurationKeys>;
}

export function isDateAfter({start, end}: {start: FullDate; end: FullDate}): boolean {
    return diffDates({start, end, unit: DiffUnit.Milliseconds}).milliseconds >= 0;
}
