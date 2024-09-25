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
    [DurationUnit.Quarters]: 'q',
    [DurationUnit.Months]: 'mo',

    [DurationUnit.Weeks]: 'wk',
    [DurationUnit.Days]: 'd',

    [DurationUnit.Hours]: 'hr',
    [DurationUnit.Minutes]: 'min',
    [DurationUnit.Seconds]: 'sec',

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

/**
 * The maximum value, exclusive, for each duration unit before it should roll-over into the next
 * duration unit.
 *
 * @category Duration : Util
 */
export const maxDurations: Readonly<Record<DurationUnit, number>> = {
    [DurationUnit.Milliseconds]: 1000,
    [DurationUnit.Seconds]: 60,
    [DurationUnit.Minutes]: 60,
    [DurationUnit.Hours]: 24,
    [DurationUnit.Days]: 30,
    [DurationUnit.Weeks]: 4,
    [DurationUnit.Months]: 12,
    [DurationUnit.Quarters]: 4,
    [DurationUnit.Years]: Infinity,
};
