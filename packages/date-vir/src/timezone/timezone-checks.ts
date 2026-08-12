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
export function isValidTimezone(raw: string): raw is Timezone {
    if (knownTimezones.has(raw)) {
        return true;
    }

    const cached = ianaValidityCache.get(raw);
    if (cached != undefined) {
        return cached;
    }

    const isValid = Info.isValidIANAZone(raw);
    ianaValidityCache.set(raw, isValid);
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
    raw: string,
    userMessage?: string | undefined,
): asserts raw is Timezone {
    if (!isValidTimezone(raw)) {
        throw new AssertionError(`'${raw}' is not a valid time zone`, userMessage);
    }
}

/**
 * Asserts that the given input is a valid timezone name and returns it.
 *
 * @category Assertion
 */
export function assertWrapValidTimezone(raw: string, userMessage?: string | undefined): Timezone {
    assertValidTimezone(raw, userMessage);
    return raw;
}

/**
 * Checks that the given input is a valid timezone name and returns it when valid.
 *
 * @category Assertion
 */
export function checkWrapValidTimezone(raw: string): Timezone | undefined {
    return isValidTimezone(raw) ? raw : undefined;
}
