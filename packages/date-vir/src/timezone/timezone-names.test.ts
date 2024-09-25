import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {assertValidTimezone} from './timezone-checks.js';
import {allTimezoneNames, Timezone} from './timezone-names.js';

describe('allTimezoneNames', () => {
    it('has all valid time zone names', () => {
        allTimezoneNames.forEach((timezoneName) => {
            assert.tsType(timezoneName).equals<Timezone>;
            assertValidTimezone(timezoneName);
        });
    });
});
