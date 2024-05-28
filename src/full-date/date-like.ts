import {DateTime} from 'luxon';
import {Timezone} from '../timezone/timezone-names';
import {FullDate} from './full-date-shape';

/** Types that can be converted into dates. */
export type DateLike<SpecificTimezone extends Timezone = Timezone> =
    | string
    | Date
    | number
    | DateTime
    | FullDate<SpecificTimezone>;
