import {round} from '@augment-vir/common';
import {describe, itCases} from '@augment-vir/test';
import {DateUnit} from '@date-vir/duration';
import {endTime} from '../extra-utils/end.js';
import {zeroDate} from '../extra-utils/zero.js';
import type {FullDate} from '../full-date/full-date-shape.js';
import {utcTimezone} from '../timezone/timezones.js';
import {calculateDatePosition, getDateUnit, getEndDateOf, getStartDateOf} from './date-position.js';

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
        return round(calculateDatePosition(...args), {digits: 2});
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
            expect: 1.93,
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

describe(getStartDateOf.name, () => {
    itCases(getStartDateOf, [
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
    ]);
});

describe(getEndDateOf.name, () => {
    itCases(getEndDateOf, [
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
            it: 'gets the quarter number',
            inputs: [
                exampleDate,
                DateUnit.Quarter,
            ],
            expect: 4,
        },
    ]);
});
