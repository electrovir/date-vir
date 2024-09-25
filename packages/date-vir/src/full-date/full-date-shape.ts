import {Overwrite, type SetRequired} from '@augment-vir/common';
import {and, defineShape} from 'object-shape-tester';
import {utcTimezone, type Timezone} from '../timezone/timezones.js';

/**
 * Time part of {@link FullDate} represented in a shape definition.
 *
 * @category Shape
 */
export const timePartShape = defineShape({
    /** Hour of the day in 24 time: 0-23 */
    hour: 14,
    /** Minute of the hour: 0-59 */
    minute: 19,
    /** Second of the minute: 0-59 */
    second: 7,
    /** Millisecond of the second: 0-999 */
    millisecond: 877,
    /** The timezone that this date/time is meant for / originated from. */
    timezone: utcTimezone as Timezone,
});

/**
 * Time part of a {@link FullDate}.
 *
 * @category Internal
 */
export type TimePart<SpecificTimezone extends Timezone = Timezone> = SetRequired<
    Partial<FullDate<SpecificTimezone>>,
    keyof (typeof timePartShape)['runtimeType']
>;

/**
 * Date part of {@link FullDate} represented in a shape definition.
 *
 * @category Shape
 */
export const datePartShape = defineShape({
    /**
     * The full, four digit year.
     *
     * @example 2023;
     */
    year: 2023,
    /** A month of the year: 1-12 */
    month: 6,
    /** A day of the month: 1-31 depending on the month */
    day: 5,
    /** The timezone that this date/time is meant for / originated from. */
    timezone: utcTimezone as Timezone,
});

/**
 * Date part of {@link FullDate}.
 *
 * @category Internal
 */
export type DatePart<SpecificTimezone extends Timezone = Timezone> = SetRequired<
    Partial<FullDate<SpecificTimezone>>,
    keyof (typeof datePartShape)['runtimeType']
>;

/**
 * The complete {@link FullDate} represented in a shape definition.
 *
 * @category Shape
 */
export const fullDateShape = defineShape(and(datePartShape, timePartShape));

/**
 * A serializable object that completely specifies how any given date should be represented,
 * including its timezone, to millisecond accuracy. This is the core type of the `date-vir` package,
 * with most operations either requiring or returning this type.
 *
 * @category FullDate
 * @example
 *
 * ```ts
 * import {FullDate, timezones} from 'date-vir';
 *
 * const myDate: FullDate = {
 *     year: 2024,
 *     month: 6,
 *     day: 2,
 *     hour: 13,
 *     minute: 32,
 *     second: 12,
 *     milliseconds: 94,
 *     timezone: timezones['Australia/Brisbane'],
 * };
 * ```
 */
export type FullDate<SpecificTimezone extends Timezone = Timezone> = Overwrite<
    (typeof fullDateShape)['runtimeType'],
    {timezone: SpecificTimezone}
>;
