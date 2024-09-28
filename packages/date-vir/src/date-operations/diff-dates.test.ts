import {assert} from '@augment-vir/assert';
import {randomInteger} from '@augment-vir/common';
import {describe, it, itCases} from '@augment-vir/test';
import {DurationUnit, selectAllDurationUnits} from '@date-vir/duration';
import {exampleFullDateUtc} from '../full-date/full-date.mock.js';
import {calculateRelativeDate} from './calculate-relative-date.js';
import {diffDates, isDateAfter} from './diff-dates.js';

const secondsDiff = randomInteger({min: 1, max: 100_000_000});
const exampleFullDateOffset = calculateRelativeDate(exampleFullDateUtc, {seconds: secondsDiff});

describe(isDateAfter.name, () => {
    itCases(isDateAfter, [
        {
            it: 'detects a date is after another',
            input: {
                relativeTo: exampleFullDateUtc,
                fullDate: exampleFullDateOffset,
            },
            expect: true,
        },
        {
            it: 'calculates the opposite if the inputs are swapped',
            input: {
                relativeTo: exampleFullDateOffset,
                fullDate: exampleFullDateUtc,
            },
            expect: false,
        },
    ]);
});

describe(diffDates.name, () => {
    itCases(diffDates, [
        {
            it: 'works on the JSDoc example',
            inputs: [
                {
                    start: {
                        year: 2024,
                        month: 1,
                        day: 5,
                        hour: 1,
                        minute: 1,
                        second: 1,
                        millisecond: 1,
                        timezone: 'UTC',
                    },
                    end: {
                        year: 2024,
                        month: 1,
                        day: 6,
                        hour: 4,
                        minute: 1,
                        second: 1,
                        millisecond: 1,
                        timezone: 'UTC',
                    },
                },
                {
                    days: true,
                    hours: true,
                },
            ],
            expect: {
                days: 1,
                hours: 3,
            },
        },
        {
            it: 'calculates two months ago',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {months: -2}),
                },
                selectAllDurationUnits,
            ],
            expect: {
                years: 0,
                quarters: 0,
                months: -2,
                weeks: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0,
            },
        },
        {
            it: 'calculates seconds diff',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: exampleFullDateOffset,
                },
                {seconds: true},
            ],
            expect: {
                seconds: secondsDiff,
            },
        },
        {
            it: 'calculates inverse if inputs are swapped',
            inputs: [
                {
                    start: exampleFullDateOffset,
                    end: exampleFullDateUtc,
                },
                {seconds: true},
            ],
            expect: {
                seconds: secondsDiff * -1,
            },
        },
        {
            it: 'returns a fractional diff',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {
                        seconds: /* half a day in seconds */ 43_200,
                    }),
                },
                {days: true},
            ],
            expect: {
                days: 0.5,
            },
        },
        {
            it: 'calculates year diff',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: {
                        ...exampleFullDateUtc,
                        year: exampleFullDateUtc.year - 10,
                    },
                },
                {
                    years: true,
                },
            ],
            expect: {
                years: -10,
            },
        },
        {
            it: 'calculates hours and minutes diff',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {days: 1.1}),
                },
                {hours: true, minutes: true},
            ],
            expect: {
                hours: 26,
                minutes: 24,
            },
        },
        {
            it: 'calculates diff with longterm accuracy',
            inputs: [
                {
                    start: exampleFullDateUtc,
                    end: calculateRelativeDate(exampleFullDateUtc, {days: 492}),
                },
                {years: true, days: true},
            ],
            expect: {
                years: 1,
                days: 126,
            },
        },
        {
            it: 'calculates inverse hours and minutes diff',
            inputs: [
                {
                    start: calculateRelativeDate(exampleFullDateUtc, {days: 1.1}),
                    end: exampleFullDateUtc,
                },
                {
                    hours: true,
                    minutes: true,
                },
            ],
            expect: {
                hours: -26,
                minutes: -24,
            },
        },
    ]);

    it('has correct type for a single unit', () => {
        assert
            .tsType(
                diffDates(
                    {
                        start: exampleFullDateOffset,
                        end: exampleFullDateUtc,
                    },
                    {years: true},
                ),
            )
            .equals<{years: number}>();
        assert
            .tsType(
                diffDates(
                    {
                        start: exampleFullDateOffset,
                        end: exampleFullDateUtc,
                    },
                    {seconds: true},
                ),
            )
            .equals<{seconds: number}>();
    });

    it('has correct type for multiple units', () => {
        assert
            .tsType(
                diffDates(
                    {
                        start: exampleFullDateOffset,
                        end: exampleFullDateUtc,
                    },
                    {days: true, hours: true},
                ),
            )
            .equals<{[DurationUnit.Days]: number; [DurationUnit.Hours]: number}>();
    });
});
