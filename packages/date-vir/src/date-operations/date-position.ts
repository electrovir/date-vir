import {check} from '@augment-vir/assert';
import {stringify} from '@augment-vir/common';
import {DateUnit, oneIndexedDateUnits} from '@date-vir/duration';
import {defineShape, exact, isValidShape, or} from 'object-shape-tester';
import {createFullDate} from '../full-date/create-full-date.js';
import {type FullDate} from '../full-date/full-date-shape.js';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion.js';
import type {Timezone} from '../timezone/timezones.js';
import {diffDates} from './diff-dates.js';

/**
 * Get the the {@link DateUnit} value of a {@link FullDate}.
 *
 * @category Unit
 * @example
 *
 * ```ts
 * import {getDateUnit, DateUnit, utcTimezone} from 'date-vir';
 *
 * getDateUnit(
 *     {
 *         year: 2024,
 *         month: 4,
 *         day: 6,
 *         hour: 12,
 *         minute: 23,
 *         second: 0,
 *         millisecond: 0,
 *         timezone: utcTimezone,
 *     },
 *     DateUnit.Week,
 * ); // outputs `14`
 * ```
 */
export function getDateUnit(date: Readonly<FullDate>, unit: DateUnit): number {
    const luxonInstance = toLuxonDateTime(date);

    if (unit === DateUnit.Week) {
        return luxonInstance.weekNumber;
    } else {
        return luxonInstance[unit];
    }
}

export function getStartDateOf<const SpecificTimezone extends Timezone>(
    date: Readonly<FullDate<SpecificTimezone>>,
    unit: DateUnit,
): FullDate<SpecificTimezone> {
    const luxonInstance = toLuxonDateTime(date);

    return createFullDate(luxonInstance.startOf(unit), date.timezone);
}

export function getEndDateOf<const SpecificTimezone extends Timezone>(
    date: Readonly<FullDate<SpecificTimezone>>,
    unit: DateUnit,
): FullDate<SpecificTimezone> {
    const luxonInstance = toLuxonDateTime(date);

    return createFullDate(luxonInstance.endOf(unit), date.timezone);
}

export const datePositionCalculationShape = defineShape(
    or(
        {
            get: exact(DateUnit.Month),
            in: or(exact(DateUnit.Year), exact(DateUnit.Quarter)),
        },
        {
            get: exact(DateUnit.Week),
            in: or(exact(DateUnit.Year), exact(DateUnit.Quarter), exact(DateUnit.Month)),
        },
        {
            get: exact(DateUnit.Day),
            in: or(
                exact(DateUnit.Year),
                exact(DateUnit.Quarter),
                exact(DateUnit.Month),
                exact(DateUnit.Week),
            ),
        },
        {
            get: exact(DateUnit.Hour),
            in: or(
                exact(DateUnit.Year),
                exact(DateUnit.Quarter),
                exact(DateUnit.Month),
                exact(DateUnit.Week),
                exact(DateUnit.Day),
            ),
        },
        {
            get: exact(DateUnit.Minute),
            in: or(
                exact(DateUnit.Year),
                exact(DateUnit.Quarter),
                exact(DateUnit.Month),
                exact(DateUnit.Week),
                exact(DateUnit.Day),
                exact(DateUnit.Hour),
            ),
        },
        {
            get: exact(DateUnit.Second),
            in: or(
                exact(DateUnit.Year),
                exact(DateUnit.Quarter),
                exact(DateUnit.Month),
                exact(DateUnit.Week),
                exact(DateUnit.Day),
                exact(DateUnit.Hour),
                exact(DateUnit.Minute),
            ),
        },
        {
            get: exact(DateUnit.Millisecond),
            in: or(
                exact(DateUnit.Year),
                exact(DateUnit.Quarter),
                exact(DateUnit.Month),
                exact(DateUnit.Week),
                exact(DateUnit.Day),
                exact(DateUnit.Hour),
                exact(DateUnit.Minute),
                exact(DateUnit.Second),
            ),
        },
    ),
);

export type DatePositionCalculation = typeof datePositionCalculationShape.runtimeType;

/**
 * Calculate the position of the given date's day within the given date unit. Only date units larger
 * than a day are allowed.
 *
 * @category Calculation
 * @example
 *
 * ```ts
 * import {calculateDatePosition, DateUnit} from 'date-vir';
 *
 * calculateDatePosition(
 *     {
 *         day: 5,
 *         month: 4,
 *         year: 2020,
 *     },
 *     DateUnit.Month,
 * );
 * // result is 5
 *
 * calculateDatePosition(
 *     {
 *         day: 5,
 *         month: 4,
 *         year: 2020,
 *     },
 *     DateUnit.Week,
 * );
 * // result is
 * ```
 */
export function calculateDatePosition(
    date: Readonly<FullDate>,
    calculation: Readonly<DatePositionCalculation>,
): number {
    if (!isValidShape(calculation, datePositionCalculationShape)) {
        throw new Error(
            `Invalid date position calculation for '${stringify(date)}': cannot get ${calculation.get} in ${calculation.in}.`,
        );
    }

    const start = getStartDateOf(date, calculation.in);
    const diffUnit: `${DateUnit}s` = `${calculation.get}s`;
    const diff = diffDates({start, end: date}, {[diffUnit]: true});

    const value = diff[diffUnit];

    if (check.isIn(calculation.get, oneIndexedDateUnits)) {
        return value + 1;
    } else {
        return value;
    }
}
