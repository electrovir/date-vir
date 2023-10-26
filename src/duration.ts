import {AtLeastTuple, RequiredAndNotNull} from '@augment-vir/common';
import {DurationObjectUnits} from 'luxon';
import {MaybeTuple} from './augments/type';

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

/** All possible options for the more strict Duration type. */
export type AnyDuration = DurationObjectUnits;

/**
 * Not a single date instance, but a description of a date duration. Used to calculate diffs between
 * dates, or add offsets to an existing date, or describe a single time duration. Usually only one
 * property is set on this at any given time.
 */
export type Duration<DurationKeys extends MaybeTuple<DiffUnit>> =
    MaybeTuple<DiffUnit> extends DurationKeys
        ? Pick<AnyDuration, DiffUnit>
        : Pick<
              RequiredAndNotNull<AnyDuration>,
              DurationKeys extends AtLeastTuple<infer InnerValue, 1> ? InnerValue : DurationKeys
          >;
