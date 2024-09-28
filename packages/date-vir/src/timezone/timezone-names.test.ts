import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {Info} from 'luxon';
import {allTimezoneNames} from './timezone-names.js';
import {Timezone} from './timezones.js';

describe('allTimezoneNames', () => {
    it('has all valid time zone names', () => {
        allTimezoneNames.forEach((timezoneName) => {
            assert.tsType(timezoneName).equals<Timezone>;
            if (!Info.isValidIANAZone(timezoneName)) {
                throw new Error(`'${timezoneName}' is not a valid time zone`);
            }
        });
    });
});
