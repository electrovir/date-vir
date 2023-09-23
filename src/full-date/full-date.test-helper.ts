import {timezones, userTimezone, utcTimezone} from '../timezone/timezones';
import {fullDateShape} from './full-date-shape';

/** The following values represent the same date and time. */
export const exampleIsoString = '2023-06-05T14:19:07.877Z' as const;
export const exampleFullDateUtc = fullDateShape.defaultValue;
export const exampleTimestamp = 1685974747877;

export const nonUtcTimezone = userTimezone === utcTimezone ? timezones['Etc/GMT-5'] : userTimezone;
export const nonUserTimezone = userTimezone === utcTimezone ? timezones['Etc/GMT-5'] : utcTimezone;
