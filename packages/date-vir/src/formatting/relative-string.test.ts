import {describe, itCases} from '@augment-vir/test';
import {selectAllDurationUnits} from '@date-vir/duration';
import {calculateRelativeDate} from '../date-operations/calculate-relative-date.js';
import {createFullDate} from '../full-date/create-full-date.js';
import {exampleFullDateUtc} from '../full-date/full-date.mock.js';
import {Timezone, utcTimezone} from '../timezone/timezones.js';
import {toRelativeString} from './relative-string.js';

describe(toRelativeString.name, () => {
    itCases(toRelativeString, [
        {
            it: 'calculates past months',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {months: -2}),
                },
                selectAllDurationUnits,
            ],
            expect: '2 months ago',
        },
        {
            it: 'calculates future months',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {months: 2}),
                },
                selectAllDurationUnits,
            ],
            expect: 'in 2 months',
        },
        {
            it: 'calculates past days',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {days: -2}),
                },
                selectAllDurationUnits,
            ],
            expect: '2 days ago',
        },
        {
            it: 'rounds only one unit',
            inputs: [
                {
                    days: 1.6,
                },
                {days: true},
            ],
            expect: 'in 2 days',
        },
        {
            it: 'rounds multiple units',
            inputs: [
                {
                    days: 1.9,
                },
                {days: true, hours: true},
            ],
            expect: 'in 2 days',
        },
        {
            it: 'rounds less with multiple units',
            inputs: [
                {
                    days: 1.6,
                },
                {days: true, hours: true},
            ],
            expect: 'in 1 day, 14 hours',
        },
        {
            it: 'rounds with largest unit',
            inputs: [
                {
                    days: 1.6,
                },
                selectAllDurationUnits,
                {
                    useOnlyLargestUnit: true,
                },
            ],
            expect: 'in 2 days',
        },
        {
            it: 'blocks past days',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {days: -2}),
                },
                {
                    weeks: true,
                    hours: true,
                },
            ],
            expect: '48 hours ago',
        },
        {
            it: 'blocks future days',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {days: 2}),
                },
                {
                    weeks: true,
                    hours: true,
                },
            ],
            expect: 'in 48 hours',
        },
        {
            it: 'calculates split past duration',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {days: -8}),
                },
                selectAllDurationUnits,
            ],
            expect: '1 week, 1 day ago',
        },
        {
            it: 'calculates singular past duration',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {days: -8}),
                },
                selectAllDurationUnits,
                {
                    useOnlyLargestUnit: true,
                },
            ],
            expect: '1 week ago',
        },
        {
            it: 'calculates split future duration',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {days: 8}),
                },
                selectAllDurationUnits,
            ],
            expect: 'in 1 week, 1 day',
        },
        {
            it: 'calculates singular future duration',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {days: 8}),
                },
                selectAllDurationUnits,
                {
                    useOnlyLargestUnit: true,
                },
            ],
            expect: 'in 1 week',
        },
        {
            it: 'returns empty string if no units selected',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {days: -8}),
                },
                {},
            ],
            expect: '',
        },
        {
            it: 'returns just now for close seconds',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {seconds: 2}),
                },
                {
                    ...selectAllDurationUnits,
                    milliseconds: false,
                },
            ],
            expect: 'just now',
        },
        {
            it: 'returns just now for close milliseconds',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {milliseconds: 200}),
                },
                selectAllDurationUnits,
            ],
            expect: 'just now',
        },
        {
            it: 'returns just now for close minutes',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {minutes: 1}),
                },
                {
                    ...selectAllDurationUnits,
                    seconds: false,
                },
            ],
            expect: 'just now',
        },
        {
            it: 'returns just now when less than seconds but milliseconds are blocked',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {milliseconds: 1}),
                },
                {
                    ...selectAllDurationUnits,
                    milliseconds: false,
                },
            ],
            expect: 'just now',
        },
        {
            it: 'rounds to a decimal point in singular values',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {seconds: 12_345}),
                },
                selectAllDurationUnits,
                {
                    allowedDecimals: 1,
                    useOnlyLargestUnit: true,
                },
            ],
            expect: 'in 3.4 hours',
        },
        {
            it: 'blocks "just now"',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {milliseconds: 200}),
                },
                selectAllDurationUnits,
                {
                    blockJustNow: true,
                },
            ],
            expect: 'in 200 milliseconds',
        },
        {
            it: 'calculates one month away correctly',
            inputs: [
                {
                    start: {
                        day: 14,
                        month: 11,
                        year: 2023,
                        hour: 7,
                        minute: 44,
                        second: 59,
                        millisecond: 0,
                        timezone: utcTimezone,
                    },
                    end: {
                        day: 14,
                        month: 12,
                        year: 2023,
                        hour: 7,
                        minute: 44,
                        second: 51,
                        millisecond: 0,
                        timezone: utcTimezone,
                    },
                },
                selectAllDurationUnits,
                {
                    useOnlyLargestUnit: true,
                },
            ],
            expect: 'in 1 month',
        },
        {
            it: 'calculates years from a long time ago',
            inputs: [
                {
                    end: createFullDate(1_134_567_891_011, Timezone['Africa/Banjul']),
                    start: createFullDate(1_234_567_891_011, Timezone['Africa/Banjul']),
                },
                selectAllDurationUnits,
                {
                    useOnlyLargestUnit: true,
                },
            ],
            expect: '3 years ago',
        },
        {
            it: 'prints 1 minute ago',
            inputs: [
                {
                    end: {
                        day: 16,
                        month: 3,
                        year: 2024,
                        hour: 8,
                        minute: 42,
                        second: 20,
                        millisecond: 68,
                        timezone: utcTimezone,
                    },
                    start: {
                        day: 16,
                        month: 3,
                        year: 2024,
                        hour: 8,
                        minute: 43,
                        second: 21,
                        millisecond: 278,
                        timezone: utcTimezone,
                    },
                },

                {
                    ...selectAllDurationUnits,
                    milliseconds: false,
                    quarters: false,
                },
                {
                    blockJustNow: true,
                    useOnlyLargestUnit: true,
                },
            ],
            expect: '1 minute ago',
        },
        {
            it: 'returns just now for identical inputs',
            inputs: [
                {
                    end: createFullDate(1_234_567_891_011, Timezone['Africa/Banjul']),
                    start: createFullDate(1_234_567_891_011, Timezone['Africa/Banjul']),
                },
                selectAllDurationUnits,
            ],
            expect: 'just now',
        },
        {
            it: 'calculates one month away from February correctly',
            inputs: [
                {
                    start: {
                        day: 5,
                        month: 2,
                        year: 2023,
                        hour: 23,
                        minute: 11,
                        second: 11,
                        millisecond: 111,
                        timezone: utcTimezone,
                    },
                    end: {
                        day: 5,
                        month: 3,
                        year: 2023,
                        hour: 11,
                        minute: 11,
                        second: 11,
                        millisecond: 111,
                        timezone: utcTimezone,
                    },
                },
                selectAllDurationUnits,
                {
                    useOnlyLargestUnit: true,
                },
            ],
            expect: 'in 1 month',
        },
    ]);
});
