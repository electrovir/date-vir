import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {createFullDate, createUtcFullDate} from '../full-date/create-full-date.js';
import {
    exampleFullDateUtc,
    exampleIsoString,
    exampleTimestamp,
    nonUtcTimezone,
} from '../full-date/full-date.mock.js';
import {utcTimezone} from '../timezone/timezones.js';
import {toHttpDateString, toTimestamp, toUtcIsoString} from './timestamp.js';

describe(toUtcIsoString.name, () => {
    itCases(toUtcIsoString, [
        {
            it: 'converts a UTC FullDate into an ISO string',
            input: exampleFullDateUtc,
            expect: exampleIsoString,
        },
        {
            it: 'converts a timezone shifted date to the same ISO string',
            input: createFullDate(exampleFullDateUtc, nonUtcTimezone),
            expect: exampleIsoString,
        },
        {
            it: 'works on the example',
            input: {
                year: 2024,
                month: 1,
                day: 5,
                hour: 1,
                minute: 1,
                second: 1,
                millisecond: 1,
                timezone: utcTimezone,
            },
            expect: '2024-01-05T01:01:01.001Z',
        },
    ]);
});

describe(toHttpDateString.name, () => {
    itCases(toHttpDateString, [
        {
            it: 'converts a UTC FullDate into an RFC 1123 / HTTP-date string',
            input: exampleFullDateUtc,
            expect: 'Mon, 05 Jun 2023 14:19:07 GMT',
        },
        {
            it: 'renders a timezone shifted date as the same GMT string',
            input: createFullDate(exampleFullDateUtc, nonUtcTimezone),
            expect: 'Mon, 05 Jun 2023 14:19:07 GMT',
        },
        {
            it: 'works on the example',
            input: {
                year: 2024,
                month: 1,
                day: 5,
                hour: 1,
                minute: 1,
                second: 1,
                millisecond: 1,
                timezone: utcTimezone,
            },
            expect: 'Fri, 05 Jan 2024 01:01:01 GMT',
        },
        {
            it: 'formats the unix epoch',
            input: createUtcFullDate(0),
            expect: 'Thu, 01 Jan 1970 00:00:00 GMT',
        },
    ]);

    it('matches Date.prototype.toUTCString() for the same instant', () => {
        const instants = [
            0,
            exampleTimestamp,
            // 2015-10-21T07:28:00.000Z, the canonical RFC 1123 example
            1_445_412_480_000,
            // an instant with sub-second precision, to confirm milliseconds are dropped the same way
            1_700_000_000_123,
        ];

        for (const instant of instants) {
            assert.strictEquals(
                toHttpDateString(createUtcFullDate(instant)),
                new Date(instant).toUTCString(),
            );
        }
    });

    it('contrasts with the ISO 8601 string for the same instant', () => {
        // The two formatters describe the same instant but in different, non-interchangeable formats.
        assert.strictEquals(toHttpDateString(exampleFullDateUtc), 'Mon, 05 Jun 2023 14:19:07 GMT');
        assert.strictEquals(toUtcIsoString(exampleFullDateUtc), exampleIsoString);
        assert.strictEquals(exampleIsoString, '2023-06-05T14:19:07.877Z');
    });
});

describe(toTimestamp.name, () => {
    itCases(toTimestamp, [
        {
            it: 'converts a UTC FullDate into a timestamp',
            input: exampleFullDateUtc,
            expect: exampleTimestamp,
        },
        {
            it: 'converts a timezone shifted FullDate into the same timestamp',
            input: createFullDate(exampleFullDateUtc, nonUtcTimezone),
            expect: exampleTimestamp,
        },
        {
            it: 'works on the example',
            input: {
                year: 2024,
                month: 1,
                day: 5,
                hour: 1,
                minute: 1,
                second: 1,
                millisecond: 1,
                timezone: utcTimezone,
            },
            expect: 1_704_416_461_001,
        },
    ]);
});
