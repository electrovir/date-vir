/**
 * All duration units supported by date-vir.
 *
 * @category Duration
 */
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
 * A mapping of {@link DurationUnit} to to all of its values' singular duration names in English.
 *
 * @category Duration : Util
 */
export const singularDurationUnitNames = {
    [DurationUnit.Years]: 'year',
    [DurationUnit.Quarters]: 'quarter',
    [DurationUnit.Months]: 'month',

    [DurationUnit.Weeks]: 'week',
    [DurationUnit.Days]: 'day',

    [DurationUnit.Hours]: 'hour',
    [DurationUnit.Minutes]: 'minute',
    [DurationUnit.Seconds]: 'second',

    [DurationUnit.Milliseconds]: 'millisecond',
} as const satisfies Readonly<Record<DurationUnit, string>>;

/**
 * A mapping of {@link DurationUnit} to to all of its values' abbreviations in English.
 *
 * @category Duration : Util
 */
export const durationUnitNameAbbreviations = {
    [DurationUnit.Years]: 'yr',
    [DurationUnit.Quarters]: 'qr',
    [DurationUnit.Months]: 'mon',

    [DurationUnit.Weeks]: 'wk',
    [DurationUnit.Days]: 'd',

    [DurationUnit.Hours]: 'hr',
    [DurationUnit.Minutes]: 'min',
    [DurationUnit.Seconds]: 's',

    [DurationUnit.Milliseconds]: 'ms',
} as const satisfies Readonly<Record<DurationUnit, string>>;

/**
 * Array of sorted {@link DurationUnit} possibilities: from smallest unit (milliseconds at index 0)
 * to longest unit (years).
 *
 * @category Duration : Util
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
