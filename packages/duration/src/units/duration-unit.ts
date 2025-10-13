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
