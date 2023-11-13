import {itCases} from '@augment-vir/browser-testing';
import {createFullDate} from '../full-date/create-full-date';
import {
    exampleFullDateUtc,
    exampleIsoString,
    exampleTimestamp,
    nonUtcTimezone,
} from '../full-date/full-date.test-helper';
import {toIsoString, toTimestamp} from './timestamp';

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
