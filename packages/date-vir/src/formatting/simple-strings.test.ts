import {describe, itCases} from '@augment-vir/test';
import {exampleFullDateUtc} from '../full-date/full-date.mock.js';
import {utcTimezone} from '../timezone/timezones.js';
import {toDatePartStrings, toSimpleString} from './simple-strings.js';

describe(toSimpleString.name, () => {
    itCases(toSimpleString, [
        {
            it: 'creates most basic string',
            inputs: [
                exampleFullDateUtc,
                {includeSeconds: false, includeTimezone: false},
            ],
            expect: '2023-06-05 14:19',
        },
        {
            it: 'includes seconds',
            inputs: [
                exampleFullDateUtc,
                {includeSeconds: true, includeTimezone: false},
            ],
            expect: '2023-06-05 14:19:07',
        },
        {
            it: 'includes timezone',
            inputs: [
                exampleFullDateUtc,
                {includeSeconds: true, includeTimezone: true},
            ],
            expect: '2023-06-05 14:19:07 (UTC)',
        },
        {
            it: 'pads numbers',
            inputs: [
                {
                    year: 1,
                    month: 2,
                    day: 3,
                    hour: 4,
                    minute: 5,
                    second: 6,
                    timezone: utcTimezone,
                },
                {includeSeconds: true, includeTimezone: true},
            ],
            expect: '0001-02-03 04:05:06 (UTC)',
        },
    ]);
});

describe(toDatePartStrings.name, () => {
    itCases(toDatePartStrings, [
        {
            it: 'includes seconds',
            inputs: [
                {
                    year: 2024,
                    month: 4,
                    day: 24,
                    hour: 6,
                    minute: 4,
                    second: 9,
                    millisecond: 123,
                    timezone: utcTimezone,
                },
                {includeSeconds: true},
            ],
            expect: {
                date: '2024-04-24',
                time: '06:04:09',
                timezone: 'UTC',
            },
        },
        {
            it: 'excludes seconds',
            inputs: [
                {
                    year: 2024,
                    month: 4,
                    day: 24,
                    hour: 6,
                    minute: 4,
                    second: 9,
                    millisecond: 123,
                    timezone: utcTimezone,
                },
                {includeSeconds: false},
            ],
            expect: {
                date: '2024-04-24',
                time: '06:04',
                timezone: 'UTC',
            },
        },
    ]);
});
