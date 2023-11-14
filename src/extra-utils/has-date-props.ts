import {PartialAndUndefined, RequiredAndNotNullBy} from '@augment-vir/common';
import {FullDate} from '../full-date/full-date-shape';

export function hasDateProps<
    PartialFullDate extends PartialAndUndefined<FullDate>,
    /** A union of strings. */
    RequiredKeysUnion extends keyof FullDate,
>(
    dateInput: PartialAndUndefined<FullDate>,
    keys: ReadonlyArray<RequiredKeysUnion>,
): dateInput is RequiredAndNotNullBy<PartialFullDate, RequiredKeysUnion> {
    try {
        assertHasDateProps(dateInput, keys);
        return true;
    } catch (error) {
        return false;
    }
}

export function assertHasDateProps<
    PartialFullDate extends PartialAndUndefined<FullDate>,
    /** A union of strings. */
    RequiredKeysUnion extends keyof FullDate,
>(
    dateInput: PartialAndUndefined<FullDate>,
    keys: ReadonlyArray<RequiredKeysUnion>,
): asserts dateInput is RequiredAndNotNullBy<PartialFullDate, RequiredKeysUnion> {
    const missingKeys: PropertyKey[] = [];
    keys.forEach((key) => {
        if (dateInput[key] == undefined) {
            missingKeys.push(key);
        }
    });

    if (missingKeys.length) {
        throw new Error(`Missing required FullDate key(s): ${missingKeys.join(', ')}`);
    }
}
