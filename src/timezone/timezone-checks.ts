import {Info} from 'luxon';
import {Timezone} from './timezone-names';

/**
 * Asserts that the given timezoneName is a valid timezone name.
 *
 * Note that this may actually allow names beyond what is currently in the exact TimezoneName type,
 * because this function uses luxon to check that it is able to generate a date with the given
 * timezone, regardless of whether it's in our typed list or not.
 */
export function assertValidTimezone(
    potentialTimezoneName: string,
): asserts potentialTimezoneName is Timezone {
    if (!Info.isValidIANAZone(potentialTimezoneName)) {
        throw new Error(`'${potentialTimezoneName}' is not a valid time zone`);
    }
}

/**
 * Checks that the given timezoneName is a valid timezone name.
 *
 * Note that this may actually allow names beyond what is currently in the exact TimezoneName type,
 * because this function uses luxon to check that it is able to generate a date with the given
 * timezone, regardless of whether it's in our typed list or not.
 */
export function isValidTimezone(potentialTimezoneName: string): potentialTimezoneName is Timezone {
    try {
        assertValidTimezone(potentialTimezoneName);
        return true;
    } catch (error) {
        return false;
    }
}
