import {AtLeastTuple, RequiredAndNotNull} from '@augment-vir/common';
import {FullDate} from '../full-date/full-date-shape';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion';
import {toTimestamp} from '../full-date/primitive-conversions';
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
export type DiffUnit = Exclude<keyof RelativeTimeDuration, 'months' | 'years' | 'quarters'>;

export type DiffDuration<DurationKeys extends MaybeTuple<DiffUnit>> =
    MaybeTuple<DiffUnit> extends DurationKeys
        ? Pick<RelativeTimeDuration, DiffUnit>
        : Pick<
              RequiredAndNotNull<RelativeTimeDuration>,
              DurationKeys extends AtLeastTuple<infer InnerValue, 1> ? InnerValue : DurationKeys
          >;

export function diffDates<const DurationKeys extends MaybeTuple<DiffUnit> = MaybeTuple<DiffUnit>>(
    fullDateA: FullDate,
    fullDateB: FullDate,
    unit: DurationKeys,
): DiffDuration<DurationKeys> {
    const isALater = toTimestamp(fullDateA) > toTimestamp(fullDateB);

    const luxonDateA = toLuxonDateTime(isALater ? fullDateA : fullDateB);
    const luxonDateB = toLuxonDateTime(isALater ? fullDateB : fullDateA);

    const diff = luxonDateA.diff(luxonDateB, unit as DiffUnit | DiffUnit[]).toObject();

    return diff as DiffDuration<DurationKeys>;
}
