import {RequiredAndNotNull} from '@augment-vir/common';

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

/**
 * All possible options for the more strict Duration type. Matches the DurationObjectUnits type from
 * the luxon package.
 */
export type AnyDuration = {
    years?: number | undefined;
    quarters?: number | undefined;
    months?: number | undefined;
    weeks?: number | undefined;
    days?: number | undefined;
    hours?: number | undefined;
    minutes?: number | undefined;
    seconds?: number | undefined;
    milliseconds?: number | undefined;
};

/**
 * All possible duration units at once. Whether these duration units should be added together to
 * form the whole picture or whether each duration is the same value but calculated in different
 * units depends on the context of this type's usage.
 */
export type AllDurations = RequiredAndNotNull<AnyDuration>;

/**
 * Not a single date instance, but a description of a date duration. Used to calculate diffs between
 * dates, or add offsets to an existing date, or describe a single time duration. Usually only one
 * property is set on this at any given time.
 */
export type Duration<DurationKeys extends DurationUnit = DurationUnit> =
    DurationUnit extends DurationKeys ? AnyDuration : Pick<AllDurations, `${DurationKeys}`>;
