import {itCases} from '@augment-vir/browser-testing';
import {calculateRelativeDate} from '../date-operations/calculate-relative-date';
import {DurationUnit} from '../duration';
import {createFullDate} from '../full-date/create-full-date';
import {exampleFullDateUtc} from '../full-date/full-date.test-helper';
import {timezones, utcTimezone} from '../timezone/timezones';
import {toRelativeString} from './relative-string';

describe(toRelativeString.name, () => {
    itCases(toRelativeString, [
        {
            it: 'calculates past months',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: calculateRelativeDate(exampleFullDateUtc, {months: -2}),
            },
            expect: '2 months ago',
        },
        {
            it: 'calculates future months',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: calculateRelativeDate(exampleFullDateUtc, {months: 2}),
            },
            expect: 'in 2 months',
        },
        {
            it: 'calculates past days',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: calculateRelativeDate(exampleFullDateUtc, {days: -2}),
            },
            expect: '2 days ago',
        },
        {
            it: 'blocks past days',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: calculateRelativeDate(exampleFullDateUtc, {days: -2}),
                options: {
                    blockedRelativeUnits: [DurationUnit.Days],
                },
            },
            expect: '48 hours ago',
        },
        {
            it: 'blocks future days',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: calculateRelativeDate(exampleFullDateUtc, {days: 2}),
                options: {
                    blockedRelativeUnits: [DurationUnit.Days],
                },
            },
            expect: 'in 48 hours',
        },
        {
            it: 'calculates singular past duration',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: calculateRelativeDate(exampleFullDateUtc, {days: -8}),
            },
            expect: 'a week ago',
        },
        {
            it: 'calculates singular future duration',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: calculateRelativeDate(exampleFullDateUtc, {days: 8}),
            },
            expect: 'in a week',
        },
        {
            it: 'returns undefined if no units match',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: calculateRelativeDate(exampleFullDateUtc, {days: -8}),
                options: {
                    blockedRelativeUnits: [
                        DurationUnit.Milliseconds,
                        DurationUnit.Seconds,
                        DurationUnit.Minutes,
                        DurationUnit.Hours,
                        DurationUnit.Days,
                        DurationUnit.Weeks,
                    ],
                },
            },
            expect: undefined,
        },
        {
            it: 'returns just now for close seconds',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: calculateRelativeDate(exampleFullDateUtc, {seconds: 2}),
            },
            expect: 'just now',
        },
        {
            it: 'returns just now for close milliseconds',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: calculateRelativeDate(exampleFullDateUtc, {milliseconds: 200}),
            },
            expect: 'just now',
        },
        {
            it: 'returns just now for close minutes',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: calculateRelativeDate(exampleFullDateUtc, {minutes: 1}),
            },
            expect: 'just now',
        },
        {
            it: 'rounds to a decimal point',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: calculateRelativeDate(exampleFullDateUtc, {seconds: 12_345}),
                options: {
                    decimalDigitCount: 1,
                },
            },
            expect: 'in 3.4 hours',
        },
        {
            it: 'blocks "just now"',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: calculateRelativeDate(exampleFullDateUtc, {milliseconds: 200}),
                options: {
                    blockJustNow: true,
                },
            },
            expect: 'in 200 milliseconds',
        },
        {
            it: 'calculates one month away correctly',
            input: {
                relativeTo: {
                    day: 14,
                    month: 11,
                    year: 2023,
                    hour: 7,
                    minute: 44,
                    second: 59,
                    millisecond: 0,
                    timezone: utcTimezone,
                },
                fullDate: {
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
            expect: 'in a month',
        },
        {
            it: 'calculates years from a long time ago',
            input: {
                fullDate: createFullDate(1134567891011, timezones['Africa/Banjul']),
                relativeTo: createFullDate(1234567891011, timezones['Africa/Banjul']),
            },
            expect: '3 years ago',
        },
        {
            it: 'does not exceed max duration units',
            input: {
                fullDate: createFullDate(1134567891011, timezones['Africa/Banjul']),
                relativeTo: createFullDate(1234567891011, timezones['Africa/Banjul']),
                options: {
                    limitUnitMax: true,
                    blockedRelativeUnits: [DurationUnit.Years],
                },
            },
            expect: undefined,
        },
        {
            it: 'returns just now for identical inputs',
            input: {
                fullDate: createFullDate(1234567891011, timezones['Africa/Banjul']),
                relativeTo: createFullDate(1234567891011, timezones['Africa/Banjul']),
            },
            expect: 'just now',
        },
        {
            it: 'calculates one month away from February correctly',
            input: {
                relativeTo: {
                    day: 5,
                    month: 2,
                    year: 2023,
                    hour: 23,
                    minute: 11,
                    second: 11,
                    millisecond: 111,
                    timezone: utcTimezone,
                },
                fullDate: {
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
            expect: 'in a month',
        },
    ]);
});
