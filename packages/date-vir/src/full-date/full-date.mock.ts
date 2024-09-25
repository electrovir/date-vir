import {timezones, userTimezone, utcTimezone} from '../timezone/timezones.js';
import {fullDateShape} from './full-date-shape.js';

/** The following values represent the same date and time. */
export const exampleIsoString = '2023-06-05T14:19:07.877Z';
export const exampleFullDateUtc = fullDateShape.defaultValue;
export const exampleTimestamp = 1_685_974_747_877;

/** It is impossible to test both sides of the following ternaries at the same time. */
/* node:coverage ignore next 2 */
export const nonUtcTimezone = userTimezone === utcTimezone ? timezones['Etc/GMT-5'] : userTimezone;
export const nonUserTimezone = userTimezone === utcTimezone ? timezones['Etc/GMT-5'] : utcTimezone;
