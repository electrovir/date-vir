import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {allTimezoneNames} from 'date-vir';

/**
 * Probes the current JS environment (here: Node.js) for whether it accepts the given timezone.
 * `Intl.DateTimeFormat` throws a `RangeError` for any timezone the environment doesn't recognize,
 * so a successful construction means the environment considers it valid.
 */
function isConstructableInEnvironment(timezoneName: string): boolean {
    try {
        new Intl.DateTimeFormat('en-US', {
            timeZone: timezoneName,
            timeZoneName: 'longOffset',
        });

        return true;
    } catch {
        return false;
    }
}

describe('allTimezoneNames', () => {
    it('are all valid in Node.js', () => {
        const invalidTimezones = allTimezoneNames.filter(
            (timezoneName) => !isConstructableInEnvironment(timezoneName),
        );

        assert.deepEquals(invalidTimezones, []);
    });
});
