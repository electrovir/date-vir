import {assertValidShape} from 'object-shape-tester';
import {assertValidTimezone} from '../timezone/timezone-checks.js';
import {Timezone} from '../timezone/timezones.js';
import {FullDate, fullDateShape} from './full-date-shape.js';
import {toLuxonDateTime} from './luxon-date-time-conversion.js';

/**
 * Asserts that the input is a valid {@link FullDate}.
 *
 * @category Assertion
 * @throws An Error if the input is not a valid {@link FullDate}.
 */
export function assertValidFullDate(input: unknown): asserts input is FullDate {
    assertValidShape(input, fullDateShape);
    assertValidTimezone(input.timezone);

    /** Check that the input can be converted to a luxon date correctly. */
    toLuxonDateTime(input);
}

/**
 * Checks and type guards that the input is a valid {@link FullDate}.
 *
 * @category Assertion
 */
export function isValidFullDate(input: unknown): input is FullDate {
    try {
        assertValidFullDate(input);
        return true;
    } catch {
        return false;
    }
}

/**
 * Checks and type guards that the given {@link FullDate} instance has the given timezone.
 *
 * @category Assertion
 */
export function hasTimezone<const SpecificTimezone extends Timezone>(
    input: FullDate,
    timezone: SpecificTimezone,
): input is FullDate<SpecificTimezone> {
    return input.timezone === timezone;
}
