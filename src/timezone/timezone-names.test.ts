import {assertTypeOf} from '@augment-vir/browser-testing';
import {assertValidTimezone} from './timezone-checks';
import {allTimezoneNames, Timezone} from './timezone-names';

describe('allTimezoneNames', () => {
    it('has all valid time zone names', () => {
        allTimezoneNames.forEach((timezoneName) => {
            assertTypeOf(timezoneName).toEqualTypeOf<Timezone>;
            assertValidTimezone(timezoneName);
        });
    });
});
