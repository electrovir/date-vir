import {describe, itCases} from '@augment-vir/test';
import {formatDuration} from './format-duration.js';

describe(formatDuration.name, () => {
    itCases(formatDuration, [
        {
            it: 'formats a single unit',
            inputs: [
                {
                    seconds: 4,
                },
            ],
            expect: '4 seconds',
        },
        {
            it: 'formats multiple units largest to smallest',
            inputs: [
                {
                    hours: 3,
                    minutes: 30,
                },
            ],
            expect: '3 hours 30 minutes',
        },
        {
            it: 'formats all units',
            inputs: [
                {
                    years: 1,
                    months: 2,
                    weeks: 3,
                    days: 4,
                    hours: 5,
                    minutes: 6,
                    seconds: 7,
                    milliseconds: 8,
                },
            ],
            expect: '1 year 2 months 3 weeks 4 days 5 hours 6 minutes 7 seconds 8 milliseconds',
        },
        {
            it: 'uses a custom separator',
            inputs: [
                {
                    days: 1,
                    hours: 2,
                },
                {
                    sep: ' and ',
                },
            ],
            expect: '1 day and 2 hours',
        },
        {
            it: 'includes zero values when explicitly defined',
            inputs: [
                {
                    minutes: 5,
                    seconds: 0,
                },
            ],
            expect: '5 minutes 0 seconds',
        },
        {
            it: 'skips undefined values',
            inputs: [
                {
                    hours: undefined,
                    minutes: 10,
                },
            ],
            expect: '10 minutes',
        },
        {
            it: 'returns an empty string for an empty duration',
            inputs: [
                {},
            ],
            expect: '',
        },
        {
            it: 'handles singular counts',
            inputs: [
                {
                    days: 1,
                },
            ],
            expect: '1 day',
        },
        {
            it: 'returns only the largest unit with onlyLargestUnit',
            inputs: [
                {
                    hours: 3,
                    minutes: 30,
                    seconds: 15,
                },
                {
                    onlyLargestUnit: true,
                },
            ],
            expect: '3 hours',
        },
        {
            it: 'returns the single unit with onlyLargestUnit',
            inputs: [
                {
                    seconds: 42,
                },
                {
                    onlyLargestUnit: true,
                },
            ],
            expect: '42 seconds',
        },
    ]);
});
