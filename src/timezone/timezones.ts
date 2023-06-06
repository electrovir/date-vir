import {Settings} from 'luxon';
import {Timezone, allTimezoneNames} from './timezone-names';

export type Timezones = Readonly<{
    [SpecificTimezoneName in Timezone]: SpecificTimezoneName;
}>;

/** A typed object of all known timezones, as of the writing of this message. */
export const timezones = allTimezoneNames.reduce((accum, timezoneName) => {
    accum[timezoneName] = timezoneName;
    return accum;
}, {} as Record<string, string>) as Timezones;

/** The timezone of the current user's environment. */
export const userTimezone = Settings.defaultZone.name as Timezone;
/** The UTC timezone. */
export const utcTimezone = timezones.UTC;
