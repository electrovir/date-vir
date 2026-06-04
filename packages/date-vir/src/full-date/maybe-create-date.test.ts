import {describe, itCases} from '@augment-vir/test';
import {Timezone, utcTimezone} from '../timezone/timezones.js';
import {exampleFullDateUtc, exampleIsoString, exampleTimestamp} from './full-date.mock.js';
import {maybeCreateFullDate} from './maybe-create-date.js';

describe(maybeCreateFullDate.name, () => {
    itCases(maybeCreateFullDate, [
        {
            it: 'creates a full date from a valid ISO string',
            inputs: [
                exampleIsoString,
                utcTimezone,
            ],
            expect: exampleFullDateUtc,
        },
        {
            it: 'creates a full date from a numeric timestamp',
            inputs: [
                exampleTimestamp,
                utcTimezone,
            ],
            expect: exampleFullDateUtc,
        },
        {
            it: 'applies the given timezone',
            inputs: [
                exampleIsoString,
                Timezone['Australia/Brisbane'],
            ],
            expect: {
                ...exampleFullDateUtc,
                day: 6,
                hour: 0,
                timezone: Timezone['Australia/Brisbane'],
            },
        },
        {
            it: 'returns undefined for undefined input',
            inputs: [
                undefined,
                utcTimezone,
            ],
            expect: undefined,
        },
        {
            it: 'returns undefined for null input',
            inputs: [
                null,
                utcTimezone,
            ],
            expect: undefined,
        },
        {
            it: 'returns undefined for an empty string',
            inputs: [
                '',
                utcTimezone,
            ],
            expect: undefined,
        },
        {
            it: 'returns undefined for the falsy 0 timestamp',
            inputs: [
                0,
                utcTimezone,
            ],
            expect: undefined,
        },
        {
            it: 'returns undefined instead of throwing on an unparsable string',
            inputs: [
                'foobar',
                utcTimezone,
            ],
            expect: undefined,
        },
        {
            it: 'returns undefined instead of throwing on a non-finite number',
            inputs: [
                Infinity,
                utcTimezone,
            ],
            expect: undefined,
        },
        {
            it: 'returns undefined instead of throwing on an invalid Date',
            inputs: [
                new Date('foobar'),
                utcTimezone,
            ],
            expect: undefined,
        },
    ]);
});
