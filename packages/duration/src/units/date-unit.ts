import {DurationUnit} from './duration-unit.js';

/**
 * All date units supported by date-vir. These are the singular versions of {@link DurationUnit}.
 *
 * @category Unit
 */
export enum DateUnit {
    Year = 'year',
    Quarter = 'quarter',
    Month = 'month',

    Week = 'week',
    Day = 'day',

    Hour = 'hour',
    Minute = 'minute',
    Second = 'second',

    Millisecond = 'millisecond',
}

/**
 * All {@link DateUnit} values that are zero indexed (start at 0, like seconds).
 *
 * @category Internal
 */
export const zeroIndexedDateUnits = [
    DateUnit.Year,
    DateUnit.Hour,
    DateUnit.Minute,
    DateUnit.Second,
    DateUnit.Millisecond,
] as const;

/**
 * All {@link DateUnit} values that are one indexed (start at 1, like days of a month).
 *
 * @category Internal
 */
export const oneIndexedDateUnits = [
    DateUnit.Quarter,
    DateUnit.Month,
    DateUnit.Week,
    DateUnit.Day,
] as const;

/**
 * All {@link DateUnit} values in an array ordered from smallest to largest.
 *
 * @category Internal
 */
export const orderedDateUnit = [
    DateUnit.Millisecond,
    DateUnit.Second,
    DateUnit.Minute,
    DateUnit.Hour,
    DateUnit.Day,
    DateUnit.Week,
    DateUnit.Month,
    DateUnit.Quarter,
    DateUnit.Year,
] as const;

/**
 * All valid quarter numbers (1-4).
 *
 * @category Unit
 */
export type Quarter = 1 | 2 | 3 | 4;
