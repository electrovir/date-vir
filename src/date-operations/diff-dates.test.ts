import {itCases} from '@augment-vir/browser-testing';
import {randomInteger} from '@augment-vir/common';
import {assertTypeOf} from 'run-time-assertions';
import {Duration, DurationUnit} from '../duration';
import {exampleFullDateUtc} from '../full-date/full-date.test-helper';
import {calculateRelativeDate} from './calculate-relative-date';
import {diffDates, isDateAfter} from './diff-dates';

const secondsDiff = randomInteger({min: 1, max: 1_000_000_00});
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
            it: 'calculates diff correctly',
            input: {
                start: exampleFullDateUtc,
                end: exampleFullDateOffset,
                unit: DurationUnit.Seconds,
            },
            expect: {
                seconds: secondsDiff,
            },
        },
        {
            it: 'calculates the inverse if the inputs are swapped',
            input: {
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                unit: DurationUnit.Seconds,
            },
            expect: {
                seconds: secondsDiff * -1,
            },
        },
        {
            it: 'returns a fractional diff',
            input: {
                start: exampleFullDateUtc,
                end: calculateRelativeDate(exampleFullDateUtc, {
                    seconds: /* half a day in seconds */ 43_200,
                }),
                unit: DurationUnit.Days,
            },
            expect: {
                days: 0.5,
            },
        },
    ]);

    it('has proper types', () => {
        diffDates({
            start: exampleFullDateOffset,
            end: exampleFullDateUtc,
            // does not allow higher order units
            // @ts-expect-error
            unit: 'years',
        });

        assertTypeOf(
            diffDates({
                start: exampleFullDateUtc,
                end: exampleFullDateOffset,
                unit: DurationUnit.Seconds,
            }),
        ).toMatchTypeOf<{seconds: number}>();
        assertTypeOf(
            diffDates({
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                unit: DurationUnit.Minutes,
            }),
        ).toMatchTypeOf<{
            minutes: number;
        }>();
    });
});

describe('DiffDuration', () => {
    it('sets properties from its type parameter', () => {
        assertTypeOf<Duration<DurationUnit.Seconds>>().toMatchTypeOf<{seconds: number}>();
    });
});
