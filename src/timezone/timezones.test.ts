import {assert} from '@open-wc/testing';
import {assertValidTimezone} from './timezone-checks';
import {timezones, userTimezone} from './timezones';

describe('timezoneName object', () => {
    it('has all valid time zones', () => {
        Object.values(timezones).forEach((timezone) => {
            assertValidTimezone(timezone);
        });
    });

    it('has values equalling the keys', () => {
        Object.entries(timezones).forEach(
            ([
                key,
                value,
            ]) => {
                assert.strictEqual(key, value);
            },
        );
    });

    it('has type safety', () => {
        timezones['Africa/Abidjan'];
        timezones.UTC;
        timezones['America/Anchorage'];
        // @ts-expect-error
        timezones['Some/Random_Name'];
    });
});

describe('userTimezone', () => {
    it('is a valid time zone name', () => {
        assertValidTimezone(userTimezone);
    });
});
