import {userLocale, type LocaleOptions} from '../locale.js';
import {type RoundOptions} from '../round-options.js';
import {type DurationUnit} from './duration-unit.js';

/**
 * All date units supported by date-vir. These are the singular versions of {@link DurationUnit}.
 *
 * @category Unit
 */
export enum DateUnit {
    Year = 'year',
    Month = 'month',

    Week = 'week',
    Day = 'day',

    Hour = 'hour',
    Minute = 'minute',
    Second = 'second',

    Millisecond = 'millisecond',
}

/**
 * Options for {@link getDateUnitString}.
 *
 * @category Internal
 */
export type DurationUnitStringOptions = {
    unit: DurationUnit | DateUnit;
    /** The count of the given unit. */
    count: number;
    /**
     * If `true`, abbreviates the unit name.
     *
     * @default false
     */
    abbreviate?: boolean | undefined;
} & LocaleOptions &
    RoundOptions;

/**
 * Gets the count and name of the requested unit.
 *
 * @category Language
 */
export function getDateUnitString(options: Readonly<DurationUnitStringOptions>) {
    const numberFormat = new Intl.NumberFormat(options.locale || userLocale, {
        style: 'unit',
        unit: options.unit.replace(/s$/, ''),
        unitDisplay: options.abbreviate ? 'short' : 'long',
        roundingMode: 'halfCeil',
        useGrouping: 'auto',
        maximumFractionDigits: options.decimalCount || 0,
    });
    return numberFormat.format(options.count);
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
    DateUnit.Year,
] as const;

/**
 * A type for all valid hour numbers. (0-23)
 *
 * @category Unit
 */
export type Hour =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23;

/**
 * A type for all valid minute numbers. (0-59)
 *
 * @category Unit
 */
export type Minute =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31
    | 32
    | 33
    | 34
    | 35
    | 36
    | 37
    | 38
    | 39
    | 40
    | 41
    | 42
    | 43
    | 44
    | 45
    | 46
    | 47
    | 48
    | 49
    | 50
    | 51
    | 52
    | 53
    | 54
    | 55
    | 56
    | 57
    | 58
    | 59;

/**
 * A type for all valid second numbers. (0-59)
 *
 * @category Unit
 */
// eslint-disable-next-line sonarjs/redundant-type-aliases
export type Second = Minute;

/**
 * Bounds for valid hour numbers.
 *
 * @category Internal
 */
export const hourBounds = {
    min: 0,
    max: 23,
} satisfies Record<'min' | 'max', Hour>;

/**
 * Bounds for valid minute numbers.
 *
 * @category Internal
 */
export const minuteBounds = {
    min: 0,
    max: 59,
} satisfies Record<'min' | 'max', Minute>;

/**
 * Bounds for valid second numbers.
 *
 * @category Internal
 */
export const secondBounds = {
    min: 0,
    max: 59,
} satisfies Record<'min' | 'max', Second>;

/**
 * Bounds for valid millisecond numbers.
 *
 * @category Internal
 */
export const millisecondsBounds = {
    min: 0,
    max: 999,
};
