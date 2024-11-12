import {FullDate} from './full-date-shape.js';

/**
 * Represents various parts of a {@link FullDate}. Each value is also a valid "type" attribute for an
 * `<input>` HTML element.
 *
 * @category Internal
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
 * @category Internal
 */
export enum TimeKey {
    Hour = 'hour',
    Minute = 'minute',
    Second = 'second',
    Millisecond = 'millisecond',
}

/**
 * {@link FullDate} keys used for telling the date only.
 *
 * @category Internal
 */
export enum DateKey {
    Year = 'year',
    Month = 'month',
    Day = 'day',
}
