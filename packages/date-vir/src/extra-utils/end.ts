import {type TimeKey} from '../full-date/full-date-parts.js';
import {type FullDate} from '../full-date/full-date-shape.js';

/**
 * A partial {@link FullDate} instance that has the highest value for each time property.
 *
 * @category Constants
 */
export const endTime = {
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 999,
} as const satisfies Pick<FullDate, TimeKey>;
