import {assertValidShape} from 'object-shape-tester';
import {assertValidTimezone} from '../timezone/timezone-checks.js';
import {Timezone} from '../timezone/timezone-names.js';
import {FullDate, fullDateShape} from './full-date-shape.js';
import {toLuxonDateTime} from './luxon-date-time-conversion.js';

export function assertIsValidFullDate(input: unknown): asserts input is FullDate {
    assertValidShape(input, fullDateShape);
    assertValidTimezone(input.timezone);

    /** Check that the input can be converted to a luxon date correctly. */
    toLuxonDateTime(input);
}

export function isValidFullDate(input: unknown): input is FullDate {
    try {
        assertIsValidFullDate(input);
        return true;
    } catch {
        return false;
    }
}

export function hasTimezone<const SpecificTimezone extends Timezone>(
    input: FullDate,
    timezone: SpecificTimezone,
): input is FullDate<SpecificTimezone> {
    return input.timezone === timezone;
}
