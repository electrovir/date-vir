import {describe, itCases} from '@augment-vir/test';
import {createFullDate} from '../full-date/create-full-date.js';
import {
    exampleFullDateUtc,
    exampleIsoString,
    exampleTimestamp,
    nonUtcTimezone,
} from '../full-date/full-date.mock.js';
import {toIsoString, toTimestamp} from './timestamp.js';

describe(toIsoString.name, () => {
    itCases(toIsoString, [
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
    ]);
});
