import {Overwrite, RequiredBy} from '@augment-vir/common';
import {and, defineShape} from 'object-shape-tester';
import {Timezone} from '../timezone/timezone-names';
import {utcTimezone} from '../timezone/timezones';

export enum FullDatePartEnum {
    Date = 'date',
    Time = 'time',
}

export const timePartShape = defineShape({
    /** Hour of the day in 24 time: 0-23 */
    hour: 14,
    /** Minute of the hour: 0-59 */
    minute: 19,
    /** Second of the minute: 0-59 */
    second: 0,
    /** Millisecond of the second: 0-999 */
    millisecond: 870,
    /** The timezone that this date/time is meant for / originated from. */
    timezone: utcTimezone as Timezone,
});

export type TimePart = RequiredBy<Partial<FullDate>, keyof (typeof timePartShape)['runTimeType']>;

export const datePartShape = defineShape({
    /**
     * The full, four digit year.
     *
     * @example
     *     2023;
     */
    year: 2023,
    /** A month of the year: 1-12 */
    month: 6,
    /** A day of the month: 1-31 depending on the month */
    day: 5,
    /** The timezone that this date/time is meant for / originated from. */
    timezone: utcTimezone as Timezone,
});

export type DatePart = RequiredBy<Partial<FullDate>, keyof (typeof datePartShape)['runTimeType']>;

export const fullDateShape = defineShape(and(datePartShape, timePartShape));

/**
 * A easily serializable (it fits into plain JSON) object that completely defines how a date is to
 * be represented with minimal data.
 */
export type FullDate = Overwrite<(typeof fullDateShape)['runTimeType'], {timezone: Timezone}>;
