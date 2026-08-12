import {assertWrap, check} from '@augment-vir/assert';
import {stringify} from '@augment-vir/common';
import {DateUnit, oneIndexedDateUnits} from '@date-vir/duration';
import {checkValidShape, defineShape, exactShape, unionShape} from 'object-shape-tester';
import {createFullDate} from '../full-date/create-full-date.js';
import {type FullDate} from '../full-date/full-date-shape.js';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion.js';
import {utcTimezone, type Timezone} from '../timezone/timezones.js';
import {calculateRelativeDate} from './calculate-relative-date.js';
import {diffDates} from './diff-dates.js';

/**
 * Get the {@link DateUnit} value of a {@link FullDate}.
 *
 * @category Calculation
 * @example
 *
 * ```ts
 * import {getDateUnit, DateUnit, utcTimezone} from 'date-vir';
 *
 * getDateUnit(
 *     {
 *         year: 2024,
 *         month: 11,
 *         day: 7,
 *
 *         hour: 12,
 *         minute: 12,
 *         second: 12,
 *         millisecond: 12,
 *
 *         timezone: utcTimezone,
 *     },
 *     DateUnit.Week,
 * ); // outputs `45`
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

/**
 * Get the start date of a specific {@link DateUnit} based on a given {@link FullDate}.
 *
 * @category Calculation
 * @example
 *
 * ```ts
 * import {getStartDate, DateUnit, utcTimezone} from 'date-vir';
 *
 * getStartDate(
 *     {
 *         year: 2024,
 *         month: 11,
 *         day: 7,
 *
 *         hour: 12,
 *         minute: 12,
 *         second: 12,
 *         millisecond: 12,
 *
 *         timezone: utcTimezone,
 *     },
 *     DateUnit.Month,
 * ); // outputs {year: 2024, month: 11, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0, timezone: utcTimezone}
 * ```
 */
export function getStartDate<const SpecificTimezone extends Timezone>(
    date: Readonly<FullDate<SpecificTimezone>>,
    unit: DateUnit,
): FullDate<SpecificTimezone> {
    /**
     * This package treats Sunday as the first day of the week, but Luxon treats Monday as the first
     * day of the week.
     */
    if (unit === DateUnit.Week) {
        return calculateRelativeDate(
            createFullDate(
                toLuxonDateTime(
                    calculateRelativeDate(date, {
                        days: 1,
                    }),
                ).startOf(unit),
                date.timezone,
            ),
            {
                days: -1,
            },
        );
    } else if (unit === DateUnit.Day && date.timezone === utcTimezone) {
        /**
         * Fast path for UTC: UTC never observes DST, so midnight always exists and the start of the
         * day is simply the same calendar date with all time fields zeroed. This avoids a
         * comparatively expensive Luxon round-trip.
         *
         * Non-UTC zones fall through to the Luxon path below because a few zones have had DST
         * transitions at midnight (e.g. `America/Asuncion` on 2020-10-04, where midnight did not
         * exist and `startOf('day')` is 01:00, not 00:00).
         */
        return {
            ...date,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
        };
    } else {
        return createFullDate(toLuxonDateTime(date).startOf(unit), date.timezone);
    }
}

/**
 * Get the end date of a specific {@link DateUnit} based on a given {@link FullDate}.
 *
 * @category Calculation
 * @example
 *
 * ```ts
 * import {getEndDate, DateUnit, utcTimezone} from 'date-vir';
 *
 * getEndDate(
 *     {
 *         year: 2024,
 *         month: 11,
 *         day: 7,
 *
 *         hour: 12,
 *         minute: 12,
 *         second: 12,
 *         millisecond: 12,
 *
 *         timezone: utcTimezone,
 *     },
 *     DateUnit.Month,
 * ); // outputs {year: 2024, month: 11, day: 30, hour: 23, minute: 59, second: 59, millisecond: 999, timezone: utcTimezone}
 * ```
 */
export function getEndDate<const SpecificTimezone extends Timezone>(
    date: Readonly<FullDate<SpecificTimezone>>,
    unit: DateUnit,
): FullDate<SpecificTimezone> {
    /**
     * This package treats Sunday as the first day of the week, but Luxon treats Monday as the first
     * day of the week.
     */
    if (unit === DateUnit.Week) {
        return calculateRelativeDate(
            createFullDate(
                toLuxonDateTime(
                    calculateRelativeDate(date, {
                        days: 1,
                    }),
                ).endOf(unit),
                date.timezone,
            ),
            {
                days: -1,
            },
        );
    } else {
        return createFullDate(toLuxonDateTime(date).endOf(unit), date.timezone);
    }
}

/**
 * Shape definition for all valid date position calculations. Used for {@link calculateDatePosition}.
 *
 * @category Internal
 */
export const datePositionCalculationShape = defineShape(
    unionShape(
        {
            get: exactShape(DateUnit.Month),
            in: unionShape(exactShape(DateUnit.Year)),
        },
        {
            get: exactShape(DateUnit.Week),
            in: unionShape(exactShape(DateUnit.Year), exactShape(DateUnit.Month)),
        },
        {
            get: exactShape(DateUnit.Day),
            in: unionShape(
                exactShape(DateUnit.Year),
                exactShape(DateUnit.Month),
                exactShape(DateUnit.Week),
            ),
        },
        {
            get: exactShape(DateUnit.Hour),
            in: unionShape(
                exactShape(DateUnit.Year),
                exactShape(DateUnit.Month),
                exactShape(DateUnit.Week),
                exactShape(DateUnit.Day),
            ),
        },
        {
            get: exactShape(DateUnit.Minute),
            in: unionShape(
                exactShape(DateUnit.Year),
                exactShape(DateUnit.Month),
                exactShape(DateUnit.Week),
                exactShape(DateUnit.Day),
                exactShape(DateUnit.Hour),
            ),
        },
        {
            get: exactShape(DateUnit.Second),
            in: unionShape(
                exactShape(DateUnit.Year),
                exactShape(DateUnit.Month),
                exactShape(DateUnit.Week),
                exactShape(DateUnit.Day),
                exactShape(DateUnit.Hour),
                exactShape(DateUnit.Minute),
            ),
        },
        {
            get: exactShape(DateUnit.Millisecond),
            in: unionShape(
                exactShape(DateUnit.Year),
                exactShape(DateUnit.Month),
                exactShape(DateUnit.Week),
                exactShape(DateUnit.Day),
                exactShape(DateUnit.Hour),
                exactShape(DateUnit.Minute),
                exactShape(DateUnit.Second),
            ),
        },
    ),
);

/**
 * All valid date position calculations. Used for {@link calculateDatePosition}.
 *
 * @category Internal
 */
export type DatePositionCalculation = typeof datePositionCalculationShape.runtimeType;

/**
 * Calculate the position of the given date's "get" unit within the given "in" unit.
 *
 * @category Calculation
 * @example
 *
 * ```ts
 * import {calculateDatePosition, DateUnit} from 'date-vir';
 *
 * calculateDatePosition(
 *     {
 *         year: 2020,
 *         month: 4,
 *         day: 5,
 *
 *         hour: 0,
 *         minute: 0,
 *         second: 0,
 *         millisecond: 0,
 *
 *         timezone: utcTimezone,
 *     },
 *     {
 *         get: DateUnit.Week,
 *         in: DateUnit.Year,
 *     },
 * );
 * // result is ~14.14 (always round up for week in the year numbers, thus yielding week 15)
 *
 * calculateDatePosition(
 *     {
 *         year: 2020,
 *         month: 4,
 *         day: 5,
 *
 *         hour: 0,
 *         minute: 0,
 *         second: 0,
 *         millisecond: 0,
 *         timezone: utcTimezone,
 *     },
 *     {
 *         get: DateUnit.Day,
 *         in: DateUnit.Week,
 *     },
 * );
 * // result is 0 (Sunday)
 * ```
 */
export function calculateDatePosition(
    date: Readonly<FullDate>,
    calculation: Readonly<DatePositionCalculation>,
): number {
    if (!checkValidShape(calculation, datePositionCalculationShape)) {
        throw new Error(
            `Invalid date position calculation for '${stringify(date)}': cannot get ${calculation.get} in ${calculation.in}.`,
        );
    }

    const start = getStartDate(date, calculation.in);
    const startWithOffset =
        calculation.get === DateUnit.Week
            ? calculateRelativeDate(start, {
                  days: calculateDatePosition(start, {
                      get: DateUnit.Day,
                      in: DateUnit.Week,
                  }),
              })
            : start;

    const diffUnit: `${DateUnit}s` = `${calculation.get}s`;
    const diff = diffDates(
        {
            start: startWithOffset,
            end: date,
        },
        {
            [diffUnit]: true,
        },
    );

    const value = assertWrap.isDefined(diff[diffUnit]);

    const isDayOfWeek = calculation.get === DateUnit.Day && calculation.in === DateUnit.Week;

    if (!isDayOfWeek && check.isIn(calculation.get, oneIndexedDateUnits)) {
        return value + 1;
    } else {
        return value;
    }
}
