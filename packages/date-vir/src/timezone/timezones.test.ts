import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {assertValidTimezone} from './timezone-checks.js';
import {TimezoneName, userTimezone, type TimezoneString} from './timezones.js';

describe('timezoneName object', () => {
    it('has all valid time zones', () => {
        Object.values(TimezoneName).forEach((timezone) => {
            assertValidTimezone(timezone);
        });
    });

    it('has values equalling the keys', () => {
        Object.entries(TimezoneName).forEach(
            ([
                key,
                value,
            ]) => {
                assert.strictEquals(key, value);
            },
        );
    });

    it('has type safety', () => {
        TimezoneName['Africa/Abidjan'];
        TimezoneName.UTC;
        TimezoneName['America/Anchorage'];
        // @ts-expect-error: intentionally incorrect timezone name
        TimezoneName['Some/Random_Name'];
    });
});

describe('userTimezone', () => {
    it('is a valid time zone name', () => {
        assert.tsType(userTimezone).equals<TimezoneString>();
        assertValidTimezone(userTimezone);
    });
});
