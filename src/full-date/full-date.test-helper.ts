import {timezones, userTimezone, utcTimezone} from '../timezone/timezones';
import {fullDateShape} from './full-date-shape';

/** The following values represent the same date and time. */
export const exampleIsoString = '2023-06-05T14:19:00.870Z' as const;
export const exampleFullDate = fullDateShape.defaultValue;
export const exampleTimestamp = 1685974740870;

export const nonUtcTimezone = userTimezone === utcTimezone ? timezones['Etc/GMT-5'] : userTimezone;
export const nonUserTimezone = userTimezone === utcTimezone ? timezones['Etc/GMT-5'] : utcTimezone;
