import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {toTimestamp} from '../formatting/timestamp.js';
import {type FullDate} from '../full-date/full-date-shape.js';
import {
    exampleFullDateUtc,
    exampleTimestamp,
    nonUserTimezone,
} from '../full-date/full-date.mock.js';
import {userTimezone} from '../timezone/timezones.js';
import {toJsDate} from './js-date-conversion.js';

describe(toJsDate.name, () => {
    itCases(
        (input: FullDate) => Number(toJsDate(input)),
        [
            {
                it: 'converts an example fullDate into a JS date',
                input: exampleFullDateUtc,
                expect: exampleTimestamp,
            },
        ],
    );

    it('produces the same instant as the Luxon timestamp path', () => {
        const cases: ReadonlyArray<Readonly<FullDate>> = [
            // user-timezone dates: exercise the JS Date constructor fast path
            {
                year: 2024,
                month: 6,
                day: 5,
                hour: 14,
                minute: 19,
                second: 7,
                millisecond: 877,
                timezone: userTimezone,
            },
            {
                year: 2023,
                month: 1,
                day: 1,
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
                timezone: userTimezone,
            },
            {
                year: 2025,
                month: 12,
                day: 31,
                hour: 23,
                minute: 59,
                second: 59,
                millisecond: 999,
                timezone: userTimezone,
            },
            // a US spring-forward instant: a no-op in most zones, a DST edge in US zones,
            // either way the fast path must match the Luxon path
            {
                year: 2024,
                month: 3,
                day: 10,
                hour: 2,
                minute: 30,
                second: 0,
                millisecond: 0,
                timezone: userTimezone,
            },
            // not in the user's timezone: falls back to the Luxon path
            {
                year: 2024,
                month: 6,
                day: 5,
                hour: 14,
                minute: 19,
                second: 7,
                millisecond: 877,
                timezone: nonUserTimezone,
            },
            // two-digit year in the user's timezone: falls back to avoid the Date
            // constructor mapping years 0-99 to 1900-1999
            {
                year: 50,
                month: 6,
                day: 5,
                hour: 14,
                minute: 19,
                second: 7,
                millisecond: 877,
                timezone: userTimezone,
            },
        ];

        for (const fullDate of cases) {
            assert.strictEquals(
                toJsDate(fullDate).getTime(),
                new Date(toTimestamp(fullDate)).getTime(),
            );
        }
    });
});
