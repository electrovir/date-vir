import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {Info} from 'luxon';
import {allTimezoneNames} from './timezone-names.js';
import {type Timezone} from './timezones.js';

/**
 * Probes the current JS environment (here: the test browser) for whether it accepts the given
 * timezone. `Intl.DateTimeFormat` throws a `RangeError` for any timezone the environment doesn't
 * recognize, so a successful construction means the environment considers it valid.
 */
function isConstructableInEnvironment(timezoneName: string): boolean {
    try {
        Intl.DateTimeFormat('en-US', {
            timeZone: timezoneName,
            timeZoneName: 'longOffset',
        });
        return true;
    } catch {
        return false;
    }
}

describe('allTimezoneNames', () => {
    it('has all valid time zone names', () => {
        allTimezoneNames.forEach((timezoneName) => {
            assert.tsType(timezoneName).equals<Timezone>;
            if (!Info.isValidIANAZone(timezoneName)) {
                throw new Error(`'${timezoneName}' is not a valid time zone`);
            }
        });
    });

    it('are all valid in the current browser', () => {
        const invalidTimezones = allTimezoneNames.filter(
            (timezoneName) => !isConstructableInEnvironment(timezoneName),
        );

        assert.deepEquals(invalidTimezones, []);
    });
});
