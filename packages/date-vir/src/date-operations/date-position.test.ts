import {round} from '@augment-vir/common';
import {describe, itCases} from '@augment-vir/test';
import {DateUnit} from '@date-vir/duration';
import {endTime} from '../extra-utils/end.js';
import {zeroDate} from '../extra-utils/zero.js';
import {type FullDate} from '../full-date/full-date-shape.js';
import {Timezone, utcTimezone} from '../timezone/timezones.js';
import {calculateDatePosition, getDateUnit, getEndDate, getStartDate} from './date-position.js';

const exampleDate = {
    year: 2024,
    month: 11,
    day: 7,

    hour: 12,
    minute: 12,
    second: 12,
    millisecond: 12,

    timezone: utcTimezone,
} satisfies FullDate;

describe(calculateDatePosition.name, () => {
    function testCalculateDatePosition(...args: Parameters<typeof calculateDatePosition>) {
        return round(calculateDatePosition(...args), {
            digits: 2,
        });
    }

    itCases(testCalculateDatePosition, [
        {
            it: 'gets week number in month',
            inputs: [
                exampleDate,
                {
                    get: DateUnit.Week,
                    in: DateUnit.Month,
                },
            ],
            expect: 1.22,
        },
        {
            it: 'gets comment example week number in year',
            inputs: [
                {
                    day: 5,
                    month: 4,
                    year: 2020,

                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,

                    timezone: utcTimezone,
                },
                {
                    get: DateUnit.Week,
                    in: DateUnit.Year,
                },
            ],
            expect: 14.14,
        },
        {
            it: 'gets first week of the year',
            inputs: [
                {
                    day: 1,
                    month: 1,
                    year: 2020,

                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,

                    timezone: utcTimezone,
                },
                {
                    get: DateUnit.Week,
                    in: DateUnit.Year,
                },
            ],
            expect: 0.57,
        },
        {
            it: 'gets comment example day number in week',
            inputs: [
                {
                    day: 5,
                    month: 4,
                    year: 2020,

                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,

                    timezone: utcTimezone,
                },
                {
                    get: DateUnit.Day,
                    in: DateUnit.Week,
                },
            ],
            expect: 0,
        },
        {
            it: 'gets hour number in month',
            inputs: [
                exampleDate,
                {
                    get: DateUnit.Hour,
                    in: DateUnit.Month,
                },
            ],
            expect: 156.2,
        },
        {
            it: 'rejects invalid calculation',
            inputs: [
                exampleDate,
                // @ts-expect-error: intentionally incorrect calculation
                {
                    get: DateUnit.Month,
                    in: DateUnit.Day,
                },
            ],
            throws: {
                matchMessage: 'cannot get month in day',
            },
        },
    ]);
});

describe(getStartDate.name, () => {
    itCases(getStartDate, [
        {
            it: 'gets the start of a month',
            inputs: [
                exampleDate,
                DateUnit.Month,
            ],
            expect: {
                ...zeroDate,
                year: exampleDate.year,
                month: exampleDate.month,
                timezone: exampleDate.timezone,
            },
        },
        {
            it: 'gets the start of a UTC day',
            inputs: [
                exampleDate,
                DateUnit.Day,
            ],
            expect: {
                ...zeroDate,
                year: exampleDate.year,
                month: exampleDate.month,
                day: exampleDate.day,
                timezone: exampleDate.timezone,
            },
        },
        {
            it: 'gets the start of a non-UTC day',
            inputs: [
                {
                    year: 2024,
                    month: 6,
                    day: 15,

                    hour: 8,
                    minute: 30,
                    second: 45,
                    millisecond: 500,

                    timezone: Timezone['America/New_York'],
                },
                DateUnit.Day,
            ],
            expect: {
                ...zeroDate,
                year: 2024,
                month: 6,
                day: 15,
                timezone: Timezone['America/New_York'],
            },
        },
        {
            it: 'gets the start of a year',
            inputs: [
                {
                    day: 5,
                    month: 4,
                    year: 2020,

                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,

                    timezone: utcTimezone,
                },
                DateUnit.Year,
            ],
            expect: {
                ...zeroDate,
                year: 2020,
                timezone: utcTimezone,
            },
        },
        {
            it: 'gets the start of a week',
            inputs: [
                {
                    day: 5,
                    month: 4,
                    year: 2020,

                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,

                    timezone: utcTimezone,
                },
                DateUnit.Week,
            ],
            expect: {
                ...zeroDate,
                day: 5,
                month: 4,
                year: 2020,
                timezone: utcTimezone,
            },
        },
    ]);
});

describe(getEndDate.name, () => {
    itCases(getEndDate, [
        {
            it: 'gets the end of a month',
            inputs: [
                exampleDate,
                DateUnit.Month,
            ],
            expect: {
                ...endTime,
                year: exampleDate.year,
                month: exampleDate.month,
                day: 30,
                timezone: exampleDate.timezone,
            },
        },
        {
            it: 'gets the end of a week',
            inputs: [
                {
                    day: 5,
                    month: 4,
                    year: 2020,

                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,

                    timezone: utcTimezone,
                },
                DateUnit.Week,
            ],
            expect: {
                ...endTime,
                year: 2020,
                month: 4,
                day: 11,
                timezone: utcTimezone,
            },
        },
    ]);
});

describe(getDateUnit.name, () => {
    itCases(getDateUnit, [
        {
            it: 'gets the week number',
            inputs: [
                exampleDate,
                DateUnit.Week,
            ],
            expect: 45,
        },
        {
            it: 'gets the month number',
            inputs: [
                exampleDate,
                DateUnit.Month,
            ],
            expect: exampleDate.month,
        },
        {
            it: 'gets comment example week',
            inputs: [
                {
                    day: 5,
                    month: 4,
                    year: 2020,

                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,

                    timezone: utcTimezone,
                },
                DateUnit.Week,
            ],
            expect: 14,
        },
        {
            it: 'gets comment example month',
            inputs: [
                {
                    day: 5,
                    month: 4,
                    year: 2020,

                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,

                    timezone: utcTimezone,
                },
                DateUnit.Month,
            ],
            expect: 4,
        },
    ]);
});
