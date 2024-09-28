import {describe, itCases} from '@augment-vir/test';
import {createFullDate} from '../full-date/create-full-date.js';
import {
    exampleFullDateUtc,
    exampleIsoString,
    exampleTimestamp,
    nonUtcTimezone,
} from '../full-date/full-date.mock.js';
import {utcTimezone} from '../timezone/timezones.js';
import {toTimestamp, toUtcIsoString} from './timestamp.js';

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
