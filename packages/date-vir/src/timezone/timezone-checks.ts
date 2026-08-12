import {AssertionError} from '@augment-vir/assert';
import {Info} from 'luxon';
import {allTimezoneNames} from './timezone-names.js';
import {type Timezone} from './timezones.js';

/** The typed {@link Timezone} names, for O(1) membership checks before the expensive IANA lookup. */
const knownTimezones = new Set<string>(allTimezoneNames);

/**
 * Caches the result of the {@link Info.isValidIANAZone} fallback. That call constructs an
 * `Intl.DateTimeFormat` every time (~30µs), so memoizing it keeps repeated checks of the same
 * string (a legacy alias or an invalid value) cheap. Only strings outside the typed
 * {@link knownTimezones} set ever land here, so the cache stays small in practice.
 */
const ianaValidityCache = new Map<string, boolean>();

/**
 * Checks that the given timezone is valid.
 *
 * Note that this may actually allow names beyond what is currently in the exact {@link Timezone}
 * type, because this function checks to see if the given timezone can be used to construct a date,
 * regardless of whether it's in our typed list or not.
 *
 * @category Assertion
 */
export function isValidTimezone(potentialTimezone: string): boolean {
    if (knownTimezones.has(potentialTimezone)) {
        return true;
    }

    const cached = ianaValidityCache.get(potentialTimezone);
    if (cached != undefined) {
        return cached;
    }

    const isValid = Info.isValidIANAZone(potentialTimezone);
    ianaValidityCache.set(potentialTimezone, isValid);
    return isValid;
}

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
): void {
    if (!isValidTimezone(potentialTimezone)) {
        throw new AssertionError(`'${potentialTimezone}' is not a valid time zone`, userMessage);
    }
}
