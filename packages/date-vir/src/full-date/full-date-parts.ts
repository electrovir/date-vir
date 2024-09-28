import type {ArrayElement} from '@augment-vir/common';
import {datePartShape, FullDate, timePartShape} from './full-date-shape.js';

/**
 * Represents various parts of a {@link FullDate}. Each value is also a valid "type" attribute for an
 * `<input>` HTML element.
 *
 * @category Util
 */
export enum FullDatePart {
    /**
     * Used for `type="date"` HTML `<input>` elements:
     * https://developer.mozilla.org/docs/Web/HTML/Element/input/date
     */
    Date = 'date',
    /**
     * Used for `type="time"` HTML `<input>` elements:
     * https://developer.mozilla.org/docs/Web/HTML/Element/input/time
     */
    Time = 'time',
    /**
     * Used for `type="datetime-local"` HTML `<input>` elements:
     * https://developer.mozilla.org/docs/Web/HTML/Element/input/datetime-local
     */
    DateTime = 'datetime-local',
}

/**
 * {@link FullDate} keys used for telling time only.
 *
 * @category Util
 */
export const timeFullDateKeys = [
    'hour',
    'minute',
    'second',
    'millisecond',
] as const satisfies ReadonlyArray<keyof typeof timePartShape.runTimeType>;
/**
 * {@link FullDate} keys used for telling time only.
 *
 * @category Util
 */
export type TimeFullDateKeys = ArrayElement<typeof timeFullDateKeys>;

/**
 * {@link FullDate} keys used for telling the date only.
 *
 * @category Util
 */
export const dateFullDateKeys = [
    'year',
    'month',
    'day',
] as const satisfies ReadonlyArray<keyof typeof datePartShape.runTimeType>;
/**
 * {@link FullDate} keys used for telling the date only.
 *
 * @category Util
 */
export type DateFullDateKeys = ArrayElement<typeof dateFullDateKeys>;
