import {RequiredAndNotNull} from '@augment-vir/common';
import {DurationObjectUnits} from 'luxon';

export enum DurationUnit {
    Years = 'years',
    Quarters = 'quarters',
    Months = 'months',

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
export type Duration<DurationKeys extends DurationUnit = DurationUnit> =
    DurationUnit extends DurationKeys
        ? AnyDuration
        : Pick<RequiredAndNotNull<AnyDuration>, `${DurationKeys}`>;
