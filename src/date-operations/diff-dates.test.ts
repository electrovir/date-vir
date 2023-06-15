import {randomInteger} from '@augment-vir/browser';
import {assertTypeOf, itCases} from '@augment-vir/browser-testing';
import {exampleFullDate} from '../full-date/full-date.test-helper';
import {calculateRelativeDate} from './calculate-relative-date';
import {DiffDuration, diffDates} from './diff-dates';

describe(diffDates.name, () => {
    const secondsDiff = randomInteger({min: 1, max: 1_000_000_00});
    const exampleFullDateOffset = calculateRelativeDate(exampleFullDate, {seconds: secondsDiff});

    itCases(diffDates, [
        {
            it: 'calculates diff correctly',
            inputs: [
                exampleFullDate,
                exampleFullDateOffset,
                'seconds',
            ],
            expect: {
                seconds: secondsDiff,
            },
        },
        {
            it: 'calculates the same if the inputs are swapped',
            inputs: [
                exampleFullDateOffset,
                exampleFullDate,
                'seconds',
            ],
            expect: {
                seconds: secondsDiff,
            },
        },
        {
            it: 'rejects an empty array of keys',
            inputs: [
                exampleFullDateOffset,
                exampleFullDate,
                // should have a type error here
                // @ts-expect-error
                [],
            ],
            throws: Error,
        },
        {
            it: 'calculates the same if the key is in an array',
            inputs: [
                exampleFullDateOffset,
                exampleFullDate,
                ['seconds'],
            ],
            expect: {
                seconds: secondsDiff,
            },
        },
        {
            it: 'calculates the same if the key is in an array',
            inputs: [
                exampleFullDateOffset,
                exampleFullDate,
                ['minutes'],
            ],
            expect: {
                minutes: secondsDiff / 60,
            },
        },
        {
            it: 'works with multiple units',
            inputs: [
                exampleFullDateOffset,
                exampleFullDate,
                [
                    'minutes',
                    'seconds',
                ],
            ],
            expect: {
                minutes: Math.floor(secondsDiff / 60),
                seconds: secondsDiff - Math.floor(secondsDiff / 60) * 60,
            },
        },
    ]);

    it('has proper types', () => {
        diffDates(
            exampleFullDateOffset,
            exampleFullDate,
            // does not allow higher order units
            // @ts-expect-error
            'years',
        );
        assertTypeOf(diffDates(exampleFullDateOffset, exampleFullDate, 'seconds')).toEqualTypeOf<{
            seconds: number;
        }>();
        assertTypeOf(diffDates(exampleFullDateOffset, exampleFullDate, 'minutes')).toEqualTypeOf<{
            minutes: number;
        }>();
        assertTypeOf(diffDates(exampleFullDateOffset, exampleFullDate, ['minutes'])).toEqualTypeOf<{
            minutes: number;
        }>();
        assertTypeOf(
            diffDates(exampleFullDateOffset, exampleFullDate, [
                'minutes',
                'seconds',
            ]),
        ).toEqualTypeOf<{
            minutes: number;
            seconds: number;
        }>();
    });
});

describe('DiffDuration', () => {
    it('sets properties from its type parameter', () => {
        assertTypeOf<DiffDuration<'seconds'>>().toEqualTypeOf<{seconds: number}>();
    });
});
