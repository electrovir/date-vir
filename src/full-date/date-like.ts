import {DateTime} from 'luxon';
import {FullDate} from './full-date-shape';

/** Types that can be converted into dates. */
export type DateLike = string | Date | number | DateTime | FullDate;
