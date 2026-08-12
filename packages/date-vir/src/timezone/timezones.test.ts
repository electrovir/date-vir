import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {assertValidTimezone} from './timezone-checks.js';
import {Timezone, userTimezone} from './timezones.js';

describe('timezoneName object', () => {
    it('has all valid time zones', () => {
        Object.values(Timezone).forEach((timezone) => {
            assertValidTimezone(timezone);
        });
    });

    it('has values equalling the keys', () => {
        Object.entries(Timezone).forEach(
            ([
                key,
                value,
            ]) => {
                assert.strictEquals(key, value);
            },
        );
    });

    it('has type safety', () => {
        Timezone['Africa/Abidjan'];
        Timezone.UTC;
        Timezone['America/Anchorage'];
        // @ts-expect-error: intentionally incorrect timezone name
        Timezone['Some/Random_Name'];
    });
});

describe('userTimezone', () => {
    it('is a valid time zone name', () => {
        assertValidTimezone(userTimezone);
    });
});
