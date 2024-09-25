import {type PartialWithUndefined, type SetRequiredAndNotNull} from '@augment-vir/common';
import {type FullDate} from '../full-date/full-date-shape.js';
import type {Timezone} from '../timezone/timezones.js';

/**
 * Checks that the input has all the requested {@link FullDate} keys.
 *
 * @category Util
 * @example
 *
 * ```ts
 * import {hasFullDateKeys} from 'date-vir';
 *
 * hasFullDateKeys({year: 2024}, ['year']); // `true`
 * hasFullDateKeys({year: 2024}, ['day']); // `false`
 * ```
 */
export function hasFullDateKeys<
    SpecificTimezone extends Timezone,
    PartialFullDate extends PartialWithUndefined<FullDate<SpecificTimezone>>,
    /** A union of strings. */
    RequiredKeys extends keyof FullDate<SpecificTimezone>,
>(
    partialFullDate: PartialWithUndefined<FullDate<SpecificTimezone>>,
    keys: ReadonlyArray<RequiredKeys>,
): partialFullDate is SetRequiredAndNotNull<PartialFullDate, RequiredKeys> {
    try {
        assertHasFullDateKeys(partialFullDate, keys);
        return true;
    } catch {
        return false;
    }
}

/**
 * Asserts that the input has all the requested {@link FullDate} keys.
 *
 * @category Util
 * @example
 *
 * ```ts
 * import {assertHasFullDateKeys} from 'date-vir';
 *
 * assertHasFullDateKeys({year: 2024}, ['year']); // passes
 * assertHasFullDateKeys({year: 2024}, ['day']); // fails
 * ```
 */
export function assertHasFullDateKeys<
    SpecificTimezone extends Timezone,
    PartialFullDate extends PartialWithUndefined<FullDate<SpecificTimezone>>,
    /** A union of strings. */
    RequiredKeys extends keyof FullDate<SpecificTimezone>,
>(
    partialFullDate: PartialWithUndefined<FullDate<SpecificTimezone>>,
    keys: ReadonlyArray<RequiredKeys>,
): asserts partialFullDate is SetRequiredAndNotNull<PartialFullDate, RequiredKeys> {
    const missingKeys: PropertyKey[] = [];
    keys.forEach((key) => {
        if (partialFullDate[key] == undefined) {
            missingKeys.push(key);
        }
    });

    if (missingKeys.length) {
        throw new Error(`Missing required FullDate key(s): ${missingKeys.join(', ')}`);
    }
}
