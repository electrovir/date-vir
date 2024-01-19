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

export const singularDurationUnitNames = {
    [DurationUnit.Milliseconds]: 'millisecond',
    [DurationUnit.Seconds]: 'second',
    [DurationUnit.Minutes]: 'minute',
    [DurationUnit.Hours]: 'hour',
    [DurationUnit.Days]: 'day',
    [DurationUnit.Weeks]: 'week',
    [DurationUnit.Months]: 'month',
    [DurationUnit.Quarters]: 'quarter',
    [DurationUnit.Years]: 'year',
} as const satisfies Readonly<Record<DurationUnit, string>>;

/**
 * Array of DurationUnit values: from smallest unit (milliseconds at index 0) to longest unit
 * (years).
 */
export const orderedDurationUnits = [
    DurationUnit.Milliseconds,
    DurationUnit.Seconds,
    DurationUnit.Minutes,
    DurationUnit.Hours,
    DurationUnit.Days,
    DurationUnit.Weeks,
    DurationUnit.Months,
    DurationUnit.Quarters,
    DurationUnit.Years,
] as const satisfies ReadonlyArray<DurationUnit>;
