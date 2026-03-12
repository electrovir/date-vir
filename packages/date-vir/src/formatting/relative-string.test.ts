import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {selectAllDurationUnits} from '@date-vir/duration';
import {calculateRelativeDate} from '../date-operations/calculate-relative-date.js';
import {createFullDate} from '../full-date/create-full-date.js';
import {exampleFullDateUtc} from '../full-date/full-date.mock.js';
import {Timezone, utcTimezone} from '../timezone/timezones.js';
import {toRelativeString} from './relative-string.js';

describe(toRelativeString.name, () => {
    it('abbreviates', () => {
        const result = toRelativeString(
            {
                start: exampleFullDateUtc,
                end: calculateRelativeDate(exampleFullDateUtc, {
                    days: -2,
                }),
            },
            {
                weeks: true,
                hours: true,
            },
            {
                abbreviate: true,
                decimalCount: 0,
            },
        );
        assert.isIn(result, [
            /** Safari and Chrome */
            '48 hr ago',
            /** Firefox */
            '48 hrs ago',
        ]);
    });

    itCases(toRelativeString, [
        {
            it: 'calculates past months',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        months: -2,
                    }),
                },
                selectAllDurationUnits,
                {
                    decimalCount: 0,
                },
            ],
            expect: '2 months ago',
        },
        {
            it: 'calculates future months',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        months: 2,
                    }),
                },
                selectAllDurationUnits,
                {
                    decimalCount: 0,
                },
            ],
            expect: 'in 2 months',
        },
        {
            it: 'calculates past days',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        days: -2,
                    }),
                },
                selectAllDurationUnits,
                {
                    decimalCount: 0,
                },
            ],
            expect: '2 days ago',
        },
        {
            it: 'rounds only one unit',
            inputs: [
                {
                    days: 1.6,
                },
                {
                    days: true,
                },
                {
                    decimalCount: 0,
                },
            ],
            expect: 'in 2 days',
        },
        {
            it: 'rounds multiple units',
            inputs: [
                {
                    days: 1.9,
                },
                {
                    days: true,
                    hours: true,
                },
                {
                    decimalCount: 0,
                },
            ],
            expect: 'in 1 day, 22 hours',
        },
        {
            it: 'rounds largest unit',
            inputs: [
                {
                    days: 1.9,
                },
                {
                    days: true,
                    hours: true,
                },
                {
                    useOnlyLargestUnit: true,
                    decimalCount: 0,
                },
            ],
            expect: 'in 2 days',
        },
        {
            it: 'rounds less with multiple units',
            inputs: [
                {
                    days: 1.6,
                },
                {
                    days: true,
                    hours: true,
                },
                {
                    decimalCount: 0,
                },
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
                    decimalCount: 0,
                },
            ],
            expect: 'in 2 days',
        },
        {
            it: 'blocks past days',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        days: -2,
                    }),
                },
                {
                    weeks: true,
                    hours: true,
                },
                {
                    decimalCount: 0,
                },
            ],
            expect: '48 hours ago',
        },
        {
            it: 'handles exact time without just now',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: exampleFullDateUtc,
                },
                {
                    weeks: true,
                    hours: true,
                    seconds: true,
                },
                {
                    blockJustNow: true,
                    useOnlyLargestUnit: true,
                    decimalCount: 0,
                },
            ],
            expect: '0 seconds ago',
        },
        {
            it: 'handles exact time without just now in the future',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: exampleFullDateUtc,
                },
                {
                    weeks: true,
                    hours: true,
                    seconds: true,
                },
                {
                    blockJustNow: true,
                    useOnlyLargestUnit: true,
                    useFutureWhenNothing: true,
                    decimalCount: 0,
                },
            ],
            expect: 'in 0 seconds',
        },
        {
            it: 'uses custom minutes just now thresholds',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        minutes: 5,
                    }),
                },
                {
                    minutes: true,
                },
                {
                    justNowThresholds: {
                        minutes: 10,
                    },
                    decimalCount: 0,
                },
            ],
            expect: 'just now',
        },
        {
            it: 'uses default minutes just now thresholds',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        minutes: 1,
                    }),
                },
                {
                    minutes: true,
                },
                {
                    decimalCount: 0,
                },
            ],
            expect: 'just now',
        },
        {
            it: 'does not use default minutes just now thresholds',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        minutes: 50,
                    }),
                },
                {
                    minutes: true,
                    seconds: true,
                    milliseconds: true,
                },
                {
                    useOnlyLargestUnit: true,
                    decimalCount: 0,
                },
            ],
            expect: 'in 50 minutes',
        },
        {
            it: 'uses custom seconds just now thresholds',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        seconds: 50,
                    }),
                },
                {
                    seconds: true,
                },
                {
                    justNowThresholds: {
                        minutes: 10,
                        seconds: 100,
                    },
                    decimalCount: 0,
                },
            ],
            expect: 'just now',
        },
        {
            it: 'does not use just now if smaller units are selected',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        seconds: 50,
                    }),
                },
                {
                    seconds: true,
                    milliseconds: true,
                },
                {
                    justNowThresholds: {
                        minutes: 10,
                        seconds: 100,
                    },
                    decimalCount: 0,
                },
            ],
            expect: 'in 50 seconds',
        },
        {
            it: 'uses default seconds just now thresholds',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        seconds: 1,
                    }),
                },
                {
                    seconds: true,
                },
                {
                    decimalCount: 0,
                },
            ],
            expect: 'just now',
        },
        {
            it: 'does not use default seconds just now thresholds',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        seconds: 100,
                    }),
                },
                {
                    seconds: true,
                    milliseconds: true,
                },
                {
                    useOnlyLargestUnit: true,
                    decimalCount: 0,
                },
            ],
            expect: 'in 100 seconds',
        },
        {
            it: 'uses custom milliseconds just now thresholds',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        milliseconds: 5000,
                    }),
                },
                {
                    milliseconds: true,
                },
                {
                    useOnlyLargestUnit: true,
                    justNowThresholds: {
                        minutes: 10,
                        seconds: 100,
                        milliseconds: 10_000,
                    },
                    decimalCount: 0,
                },
            ],
            expect: 'just now',
        },
        {
            it: 'uses default milliseconds just now thresholds',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        milliseconds: 50,
                    }),
                },
                {
                    milliseconds: true,
                },
                {
                    useOnlyLargestUnit: true,
                    decimalCount: 0,
                },
            ],
            expect: 'just now',
        },
        {
            it: 'does not use default milliseconds just now thresholds',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        milliseconds: 5000,
                    }),
                },
                {
                    milliseconds: true,
                },
                {
                    decimalCount: 0,
                },
            ],
            expect: 'in 5,000 milliseconds',
        },
        {
            it: 'blocks future days',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        days: 2,
                    }),
                },
                {
                    weeks: true,
                    hours: true,
                },
                {
                    decimalCount: 0,
                },
            ],
            expect: 'in 48 hours',
        },
        {
            it: 'calculates split past duration',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        days: -8,
                    }),
                },
                selectAllDurationUnits,
                {
                    decimalCount: 0,
                },
            ],
            expect: '1 week, 1 day ago',
        },
        {
            it: 'calculates singular past duration',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        days: -8,
                    }),
                },
                selectAllDurationUnits,
                {
                    useOnlyLargestUnit: true,
                    decimalCount: 0,
                },
            ],
            expect: '1 week ago',
        },
        {
            it: 'calculates split future duration',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        days: 8,
                    }),
                },
                selectAllDurationUnits,
                {
                    decimalCount: 0,
                },
            ],
            expect: 'in 1 week, 1 day',
        },
        {
            it: 'calculates singular future duration',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        days: 8,
                    }),
                },
                selectAllDurationUnits,
                {
                    useOnlyLargestUnit: true,
                    decimalCount: 0,
                },
            ],
            expect: 'in 1 week',
        },
        {
            it: 'errors if no units selected',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        days: -8,
                    }),
                },
                {},
                {
                    decimalCount: 0,
                },
            ],
            throws: {
                matchMessage: 'No units selected',
            },
        },
        {
            it: 'returns just now for close seconds',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        seconds: 2,
                    }),
                },
                {
                    ...selectAllDurationUnits,
                    milliseconds: false,
                },
                {
                    decimalCount: 0,
                },
            ],
            expect: 'just now',
        },
        {
            it: 'returns just now for close milliseconds',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        milliseconds: 200,
                    }),
                },
                selectAllDurationUnits,
                {
                    decimalCount: 0,
                },
            ],
            expect: 'just now',
        },
        {
            it: 'returns just now for close minutes',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        minutes: 1,
                    }),
                },
                {
                    ...selectAllDurationUnits,
                    seconds: false,
                    milliseconds: false,
                },
                {
                    decimalCount: 0,
                },
            ],
            expect: 'just now',
        },
        {
            it: 'returns just now when less than seconds but milliseconds are blocked',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        milliseconds: 1,
                    }),
                },
                {
                    ...selectAllDurationUnits,
                    milliseconds: false,
                },
                {
                    decimalCount: 0,
                },
            ],
            expect: 'just now',
        },
        {
            it: 'rounds to a decimal point in singular values',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        seconds: 12_345,
                    }),
                },
                selectAllDurationUnits,
                {
                    decimalCount: 1,
                    useOnlyLargestUnit: true,
                },
            ],
            expect: 'in 0.1 days',
        },
        {
            it: 'rounds to a decimal point in singular values',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        seconds: 12_345,
                    }),
                },
                selectAllDurationUnits,
                {
                    useOnlyLargestUnit: true,
                    decimalCount: 0,
                },
            ],
            expect: 'in 3 hours',
        },
        {
            it: 'blocks "just now"',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        milliseconds: 200,
                    }),
                },
                selectAllDurationUnits,
                {
                    blockJustNow: true,
                    decimalCount: 0,
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
                    decimalCount: 0,
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
                    decimalCount: 0,
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
                },
                {
                    blockJustNow: true,
                    useOnlyLargestUnit: true,
                    decimalCount: 0,
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
                {
                    decimalCount: 0,
                },
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
                    decimalCount: 0,
                },
            ],
            expect: 'in 1 month',
        },
        {
            it: 'uses months for large days',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        days: -108,
                    }),
                },
                {
                    years: true,
                    months: true,
                    days: true,
                    hours: true,
                    minutes: true,
                    seconds: true,
                },
                {
                    blockJustNow: true,
                    useOnlyLargestUnit: true,
                    decimalCount: 0,
                },
            ],
            expect: '4 months ago',
        },
        {
            it: 'works on a specific amount that was failing with empty string',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        days: -84,
                    }),
                },
                {
                    years: true,
                    months: true,
                    days: true,
                    hours: true,
                    minutes: true,
                    seconds: true,
                },
                {
                    blockJustNow: true,
                    useOnlyLargestUnit: true,
                    decimalCount: 0,
                },
            ],
            expect: '3 months ago',
        },
        {
            it: 'works on short time period empty string',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        seconds: 0,
                    }),
                },
                {
                    years: true,
                    months: true,
                    days: true,
                    hours: true,
                    minutes: true,
                    seconds: true,
                },
                {
                    blockJustNow: true,
                    useOnlyLargestUnit: true,
                    decimalCount: 0,
                },
            ],
            expect: '0 seconds ago',
        },
    ]);
});
