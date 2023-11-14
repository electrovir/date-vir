import {itCases} from '@augment-vir/browser-testing';
import {assertHasDateProps, hasDateProps} from './has-date-props';

describe(assertHasDateProps.name, () => {
    itCases(assertHasDateProps, [
        {
            it: 'accepts single present key',
            inputs: [
                {day: 0},
                ['day'],
            ],
            throws: undefined,
        },
        {
            it: 'accepts single key amongst others',
            inputs: [
                {
                    day: 0,
                    minute: 0,
                },
                ['day'],
            ],
            throws: undefined,
        },
        {
            it: 'accepts multiple required keys',
            inputs: [
                {
                    day: 0,
                    minute: 0,
                    hour: 0,
                },
                [
                    'day',
                    'minute',
                    'hour',
                ],
            ],
            throws: undefined,
        },
        {
            it: 'rejects missing keys',
            inputs: [
                {
                    day: 0,
                },
                [
                    'day',
                    'minute',
                    'hour',
                ],
            ],
            throws: 'Missing required FullDate key(s): minute, hour',
        },
    ]);
});

describe(hasDateProps.name, () => {
    itCases(hasDateProps, [
        {
            it: 'accepts single present key',
            inputs: [
                {day: 0},
                ['day'],
            ],
            expect: true,
        },
        {
            it: 'accepts single key amongst others',
            inputs: [
                {
                    day: 0,
                    minute: 0,
                },
                ['day'],
            ],
            expect: true,
        },
        {
            it: 'accepts multiple required keys',
            inputs: [
                {
                    day: 0,
                    minute: 0,
                    hour: 0,
                },
                [
                    'day',
                    'minute',
                    'hour',
                ],
            ],
            expect: true,
        },
        {
            it: 'rejects missing keys',
            inputs: [
                {
                    day: 0,
                },
                [
                    'day',
                    'minute',
                    'hour',
                ],
            ],
            expect: false,
        },
    ]);
});
