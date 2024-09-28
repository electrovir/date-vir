import {ArrayElement} from '@augment-vir/common';
import {Settings} from 'luxon';
import {allTimezoneNames} from './timezone-names.js';

/**
 * All possible timezone names.
 *
 * @category Timezone
 */
export type Timezone = ArrayElement<typeof allTimezoneNames>;

/**
 * An enum of all possible timezone names.
 *
 * @category Timezone
 * @enum
 */
// eslint-disable-next-line sonarjs/no-redeclare
export const Timezone = allTimezoneNames.reduce(
    (accum, timezoneName) => {
        accum[timezoneName] = timezoneName;
        return accum;
    },
    {} as Record<string, string>,
) as Readonly<{
    [SpecificTimezoneName in Timezone]: SpecificTimezoneName;
}>;

/**
 * The timezone of the current user's environment.
 *
 * @category Timezone
 */
export const userTimezone = Settings.defaultZone.name as Timezone;
/**
 * The UTC timezone.
 *
 * @category Timezone
 */
export const utcTimezone = Timezone.UTC;
/**
 * The UTC timezone as a type.
 *
 * @category Timezone
 */
export type UtcTimezone = typeof utcTimezone;
