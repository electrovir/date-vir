import {AssertionError} from '@augment-vir/assert';
import {Info} from 'luxon';
import {Timezone} from './timezones.js';

/**
 * Asserts that the given input is a valid timezone name.
 *
 * Note that this may actually allow names beyond what is currently in the exact {@link Timezone}
 * type, because this function checks to see if the given timezone can be used to construct a date,
 * regardless of whether it's in our typed list or not.
 *
 * @category Assertion
 */
export function assertValidTimezone(
    potentialTimezone: string,
    userMessage?: string | undefined,
): asserts potentialTimezone is Timezone {
    if (!Info.isValidIANAZone(potentialTimezone)) {
        throw new AssertionError(`'${potentialTimezone}' is not a valid time zone`, userMessage);
    }
}

/**
 * Checks that the given timezone is valid.
 *
 * Note that this may actually allow names beyond what is currently in the exact {@link Timezone}
 * type, because this function checks to see if the given timezone can be used to construct a date,
 * regardless of whether it's in our typed list or not.
 *
 * @category Assertion
 */
export function isValidTimezone(potentialTimezone: string): potentialTimezone is Timezone {
    try {
        assertValidTimezone(potentialTimezone);
        return true;
    } catch {
        return false;
    }
}
