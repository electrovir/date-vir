import {TimezoneName, userTimezone, utcTimezone} from '../timezone/timezones.js';
import {type FullDate} from './full-date-shape.js';

/** The following values represent the same date and time. */
export const exampleIsoString = '2023-06-05T14:19:07.877Z';
export const exampleFullDateUtc: Readonly<FullDate> = {
    year: 2023,
    month: 6,
    day: 5,

    hour: 14,
    minute: 19,
    second: 7,
    millisecond: 877,

    timezone: utcTimezone,
};
export const exampleTimestamp = 1_685_974_747_877;

/** It is impossible to test both sides of the following ternaries at the same time. */
/* node:coverage ignore next 2 */
export const nonUtcTimezone =
    userTimezone === utcTimezone ? TimezoneName['Etc/GMT-5'] : userTimezone;
/* node:coverage ignore next 2 */
export const nonUserTimezone =
    userTimezone === utcTimezone ? TimezoneName['Etc/GMT-5'] : utcTimezone;
