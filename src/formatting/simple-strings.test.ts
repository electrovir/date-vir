import {itCases} from '@augment-vir/browser-testing';
import {exampleFullDateUtc} from '../full-date/full-date.test-helper';
import {utcTimezone} from '../timezone/timezones';
import {toSimpleString} from './simple-strings';

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
