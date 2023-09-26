import {AtLeastTuple, RequiredAndNotNull} from '@augment-vir/common';
import {DurationObjectUnits} from 'luxon';
import {DiffUnit, MaybeTuple} from './date-operations/diff-dates';

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
