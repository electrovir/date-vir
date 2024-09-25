import {DateTime} from 'luxon';
import {Timezone} from '../timezone/timezone-names.js';
import {FullDate} from './full-date-shape.js';

/** Types that can be converted into dates. */
export type DateLike<SpecificTimezone extends Timezone = Timezone> =
    | string
    | Date
    | number
    | DateTime
    | FullDate<SpecificTimezone>;
