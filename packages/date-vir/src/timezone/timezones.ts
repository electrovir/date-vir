import {applyBrand, type ArrayElement, type Branded} from '@augment-vir/common';
import {Settings} from 'luxon';
import {allTimezoneNames} from './timezone-names.js';

/**
 * All known timezone names.
 *
 * @category Timezone
 * @see {@link allTimezoneNames}
 */
export type TimezoneName = ArrayElement<typeof allTimezoneNames>;

/**
 * A branded string for any timezone
 *
 * @category Timezone
 * @see {@link allTimezoneNames}
 */
export type TimezoneString = Branded<string, 'timezone-string'>;

/**
 * Any known or unknown timezone.
 *
 * @category Timezone
 */
export type Timezone = TimezoneString | TimezoneName;

/**
 * An enum of all possible timezone names.
 *
 * @category Timezone
 * @example
 *
 * ```ts
 * import {TimezoneName} from 'date-vir';
 *
 * TimezoneName['Africa/Bamako'];
 * ```
 */
export const TimezoneName: Readonly<{
    [SpecificTimezoneName in TimezoneName]: SpecificTimezoneName;
}> = allTimezoneNames.reduce(
    (accum, timezoneName) => {
        accum[timezoneName] = timezoneName;
        return accum;
    },
    {} as Record<string, string>,
) as Readonly<{
    [SpecificTimezoneName in TimezoneName]: SpecificTimezoneName;
}>;

/**
 * The timezone of the current user's environment.
 *
 * @category Timezone
 */
export const userTimezone = applyBrand<TimezoneString>(Settings.defaultZone.name);
/**
 * The UTC timezone.
 *
 * @category Timezone
 */
export const utcTimezone = TimezoneName.UTC;
/**
 * The UTC timezone as a type.
 *
 * @category Timezone
 */
export type UtcTimezone = typeof utcTimezone;
