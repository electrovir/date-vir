import {randomInteger} from '@augment-vir/browser';
import {assertTypeOf, itCases} from '@augment-vir/browser-testing';
import {Duration} from '../duration';
import {exampleFullDateUtc} from '../full-date/full-date.test-helper';
import {calculateRelativeDate} from './calculate-relative-date';
import {DiffUnit, diffDates, isDateAfter} from './diff-dates';

const secondsDiff = randomInteger({min: 1, max: 1_000_000_00});
const exampleFullDateOffset = calculateRelativeDate(exampleFullDateUtc, {seconds: secondsDiff});

describe(isDateAfter.name, () => {
    itCases(isDateAfter, [
        {
            it: 'detects a date is after another',
            input: {
                start: exampleFullDateUtc,
                end: exampleFullDateOffset,
            },
            expect: true,
        },
        {
            it: 'calculates the opposite if the inputs are swapped',
            input: {
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
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
                unit: DiffUnit.Seconds,
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
                unit: DiffUnit.Seconds,
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
                unit: DiffUnit.Days,
            },
            expect: {
                days: 0.5,
            },
        },
        {
            it: 'rejects an empty array of keys',
            input: {
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                // should have a type error here because array is empty
                // @ts-expect-error
                unit: [],
            },
            throws: Error,
        },
        {
            it: 'calculates the same if the key is in an array',
            input: {
                start: exampleFullDateUtc,
                end: exampleFullDateOffset,
                unit: [DiffUnit.Seconds],
            },
            expect: {
                seconds: secondsDiff,
            },
        },
        {
            it: 'calculates the same if the key is in an array',
            input: {
                start: exampleFullDateUtc,
                end: exampleFullDateOffset,
                unit: [DiffUnit.Minutes],
            },
            expect: {
                minutes: secondsDiff / 60,
            },
        },
        {
            it: 'works with multiple units',
            input: {
                start: exampleFullDateUtc,
                end: exampleFullDateOffset,
                unit: [
                    DiffUnit.Minutes,
                    DiffUnit.Seconds,
                ],
            },
            expect: {
                minutes: Math.floor(secondsDiff / 60),
                seconds: secondsDiff - Math.floor(secondsDiff / 60) * 60,
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
                unit: DiffUnit.Seconds,
            }),
        ).toMatchTypeOf<{seconds: number}>();
        assertTypeOf(
            diffDates({
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                unit: DiffUnit.Minutes,
            }),
        ).toMatchTypeOf<{
            minutes: number;
        }>();
        assertTypeOf(
            diffDates({
                start: exampleFullDateUtc,
                end: exampleFullDateOffset,
                unit: [DiffUnit.Minutes],
            }),
        ).toMatchTypeOf<{
            minutes: number;
        }>();
        assertTypeOf(
            diffDates({
                start: exampleFullDateUtc,
                end: exampleFullDateOffset,
                unit: [
                    DiffUnit.Minutes,
                    DiffUnit.Seconds,
                ],
            }),
        ).toMatchTypeOf<{
            minutes: number;
            seconds: number;
        }>();
    });
});

describe('DiffDuration', () => {
    it('sets properties from its type parameter', () => {
        assertTypeOf<Duration<DiffUnit.Seconds>>().toMatchTypeOf<{seconds: number}>();
    });
});
