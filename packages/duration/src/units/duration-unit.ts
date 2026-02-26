import {DateUnit} from './date-unit.js';

/**
 * All duration units supported by date-vir.
 *
 * @category Unit
 */
export enum DurationUnit {
    Years = 'years',
    Months = 'months',

    Weeks = 'weeks',
    Days = 'days',

    Hours = 'hours',
    Minutes = 'minutes',
    Seconds = 'seconds',

    Milliseconds = 'milliseconds',
}

/**
 * Array of sorted {@link DurationUnit} possibilities: from smallest unit (milliseconds at index 0)
 * to longest unit (years).
 *
 * @category Internal
 */
export const orderedDurationUnits = [
    DurationUnit.Milliseconds,
    DurationUnit.Seconds,
    DurationUnit.Minutes,
    DurationUnit.Hours,
    DurationUnit.Days,
    DurationUnit.Weeks,
    DurationUnit.Months,
    DurationUnit.Years,
] as const satisfies ReadonlyArray<DurationUnit>;

/**
 * The maximum value, exclusive, for each duration unit before it should roll-over into the next
 * duration unit.
 *
 * @category Internal
 */
export const maxDurations: Readonly<Record<DurationUnit, number>> = {
    [DurationUnit.Milliseconds]: 1000,
    [DurationUnit.Seconds]: 60,
    [DurationUnit.Minutes]: 60,
    [DurationUnit.Hours]: 24,
    [DurationUnit.Days]: 30,
    [DurationUnit.Weeks]: 4,
    [DurationUnit.Months]: 12,
    [DurationUnit.Years]: Infinity,
};

/**
 * A mapping from {@link DurationUnit} to {@link DateUnit}.
 *
 * @category Unit
 */
export const durationUnitToDateUnit: Readonly<Record<DurationUnit, DateUnit>> = {
    [DurationUnit.Years]: DateUnit.Year,
    [DurationUnit.Months]: DateUnit.Month,
    [DurationUnit.Weeks]: DateUnit.Week,
    [DurationUnit.Days]: DateUnit.Day,
    [DurationUnit.Hours]: DateUnit.Hour,
    [DurationUnit.Minutes]: DateUnit.Minute,
    [DurationUnit.Seconds]: DateUnit.Second,
    [DurationUnit.Milliseconds]: DateUnit.Millisecond,
};
/**
 * A mapping from {@link DateUnit} to {@link DurationUnit}.
 *
 * @category Unit
 */
export const dateUnitToDurationUnit: Readonly<Record<DateUnit, DurationUnit>> = {
    [DateUnit.Year]: DurationUnit.Years,
    [DateUnit.Month]: DurationUnit.Months,
    [DateUnit.Week]: DurationUnit.Weeks,
    [DateUnit.Day]: DurationUnit.Days,
    [DateUnit.Hour]: DurationUnit.Hours,
    [DateUnit.Minute]: DurationUnit.Minutes,
    [DateUnit.Second]: DurationUnit.Seconds,
    [DateUnit.Millisecond]: DurationUnit.Milliseconds,
};
