import {ArrayElement, Overwrite, RequiredBy} from '@augment-vir/common';
import {and, defineShape} from 'object-shape-tester';
import {Timezone} from '../timezone/timezone-names.js';
import {utcTimezone} from '../timezone/timezones.js';

/**
 * Represents various parts of a FullDate. Each value is also a valid "type" attribute for an
 * <input> HTML element.
 */
export enum FullDatePartEnum {
    Date = 'date',
    Time = 'time',
    DateTime = 'datetime-local',
}

export const timeFullDateKeys = [
    'hour',
    'minute',
    'second',
    'millisecond',
] as const satisfies ReadonlyArray<keyof typeof timePartShape.runTimeType>;
export type TimeFullDateKeys = ArrayElement<typeof timeFullDateKeys>;

export const dateFullDateKeys = [
    'year',
    'month',
    'day',
] as const satisfies ReadonlyArray<keyof typeof datePartShape.runTimeType>;
export type DateFullDateKeys = ArrayElement<typeof dateFullDateKeys>;

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

export type TimePart<SpecificTimezone extends Timezone = Timezone> = RequiredBy<
    Partial<FullDate<SpecificTimezone>>,
    keyof (typeof timePartShape)['runTimeType']
>;

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

export type DatePart<SpecificTimezone extends Timezone = Timezone> = RequiredBy<
    Partial<FullDate<SpecificTimezone>>,
    keyof (typeof datePartShape)['runTimeType']
>;

export const fullDateShape = defineShape(and(datePartShape, timePartShape));

/**
 * A easily serializable (it fits into plain JSON) object that completely defines how a date is to
 * be represented with minimal data.
 */
export type FullDate<SpecificTimezone extends Timezone = Timezone> = Overwrite<
    (typeof fullDateShape)['runTimeType'],
    {timezone: SpecificTimezone}
>;

export type OnlyDatePart = Omit<DatePart, 'timezone'>;
export type OnlyHourMinutePart = Pick<Partial<FullDate>, 'hour' | 'minute'>;
export type OnlyHourMinuteSecondPart = Pick<Partial<FullDate>, 'hour' | 'minute' | 'second'>;
