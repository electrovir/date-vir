import {type DateTime} from 'luxon';
import {type Timezone} from '../timezone/timezones.js';
import {type FullDate} from './full-date-shape.js';

/**
 * Types that can be converted into {@link FullDate} instances.
 *
 * @category Internal
 */
export type DateLike<SpecificTimezone extends Timezone = Timezone> =
    | string
    | Date
    | number
    | DateTime
    | FullDate<SpecificTimezone>;
