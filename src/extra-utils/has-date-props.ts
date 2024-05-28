import {PartialAndUndefined, RequiredAndNotNullBy} from '@augment-vir/common';
import {FullDate} from '../full-date/full-date-shape';
import {Timezone} from '../timezone/timezone-names';

export function hasDateProps<
    SpecificTimezone extends Timezone,
    PartialFullDate extends PartialAndUndefined<FullDate<SpecificTimezone>>,
    /** A union of strings. */
    RequiredKeysUnion extends keyof FullDate<SpecificTimezone>,
>(
    dateInput: PartialAndUndefined<FullDate<SpecificTimezone>>,
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
    SpecificTimezone extends Timezone,
    PartialFullDate extends PartialAndUndefined<FullDate<SpecificTimezone>>,
    /** A union of strings. */
    RequiredKeysUnion extends keyof FullDate<SpecificTimezone>,
>(
    dateInput: PartialAndUndefined<FullDate<SpecificTimezone>>,
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
