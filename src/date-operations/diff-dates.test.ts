import {FunctionTestCase, itCases} from '@augment-vir/browser-testing';
import {randomInteger} from '@augment-vir/common';
import {assertThrows, assertTypeOf} from 'run-time-assertions';
import {AnyDuration, Duration, DurationUnit, orderedDurationUnits} from '../duration';
import {FullDate} from '../full-date/full-date-shape';
import {exampleFullDateUtc} from '../full-date/full-date.test-helper';
import {calculateRelativeDate} from './calculate-relative-date';
import {DiffType, diffDates, isDateAfter} from './diff-dates';

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
    function testSingleUnitDiffArray(input: {
        start: FullDate;
        end: FullDate;
        units: Readonly<[DurationUnit]>;
        diffType?: DiffType | undefined;
    }) {
        return diffDates(input) as AnyDuration;
    }

    function testSingleUnitDiff(input: Parameters<typeof testSingleUnitDiffArray>[0]) {
        return diffDates({...input, unit: input.units[0]});
    }

    const singleUnitTestCases: ReadonlyArray<FunctionTestCase<typeof testSingleUnitDiffArray>> = [
        {
            it: 'calculates seconds diff',
            input: {
                start: exampleFullDateUtc,
                end: exampleFullDateOffset,
                units: [DurationUnit.Seconds],
            },
            expect: {
                seconds: secondsDiff,
            },
        },
        {
            it: 'calculates inverse if inputs are swapped',
            input: {
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                units: [DurationUnit.Seconds],
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
                units: [DurationUnit.Days],
            },
            expect: {
                days: 0.5,
            },
        },
        {
            it: 'calculates year diff',
            input: {
                start: exampleFullDateUtc,
                end: {
                    ...exampleFullDateUtc,
                    year: exampleFullDateUtc.year - 10,
                },
                units: [DurationUnit.Years],
            },
            expect: {
                years: -10,
            },
        },
    ];

    describe('with single entry unit tuple', () => {
        itCases(testSingleUnitDiffArray, singleUnitTestCases);
    });
    describe('with single unit input', () => {
        itCases(testSingleUnitDiff, singleUnitTestCases);
    });

    itCases(diffDates, [
        {
            it: 'calculates equivalent seconds and minutes diff',
            input: {
                start: exampleFullDateUtc,
                end: exampleFullDateOffset,
                units: [
                    DurationUnit.Seconds,
                    DurationUnit.Minutes,
                ],
                diffType: DiffType.EquivalentUnits,
            },
            expect: {
                minutes: secondsDiff / 60,
                seconds: secondsDiff,
            },
        },
        {
            it: 'calculates additive hours and minutes diff',
            input: {
                start: exampleFullDateUtc,
                end: calculateRelativeDate(exampleFullDateUtc, {days: 1.1}),
                units: [
                    DurationUnit.Hours,
                    DurationUnit.Minutes,
                ],
                diffType: DiffType.AdditiveUnits,
            },
            expect: {
                hours: 26,
                minutes: 24,
            },
        },
        {
            it: 'calculates inverse equivalent seconds and minutes diff',
            input: {
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                units: [
                    DurationUnit.Seconds,
                    DurationUnit.Minutes,
                ],
                diffType: DiffType.EquivalentUnits,
            },
            expect: {
                minutes: -secondsDiff / 60,
                seconds: -secondsDiff,
            },
        },
        {
            it: 'calculates diff with longterm accuracy',
            input: {
                start: exampleFullDateUtc,
                end: calculateRelativeDate(exampleFullDateUtc, {days: 492}),
                units: [
                    DurationUnit.Days,
                    DurationUnit.Years,
                ],
                diffType: DiffType.AdditiveUnits,
            },
            expect: {
                years: 1,
                days: 126,
            },
        },
        {
            it: 'calculates inverse additive hours and minutes diff',
            input: {
                start: calculateRelativeDate(exampleFullDateUtc, {days: 1.1}),
                end: exampleFullDateUtc,
                units: [
                    DurationUnit.Hours,
                    DurationUnit.Minutes,
                ],
                diffType: DiffType.AdditiveUnits,
            },
            expect: {
                hours: -26,
                minutes: -24,
            },
        },
        {
            it: 'calculates seconds diff',
            input: {
                start: exampleFullDateUtc,
                end: calculateRelativeDate(exampleFullDateUtc, {milliseconds: 123_456_789}),
                units: orderedDurationUnits,
                diffType: DiffType.EquivalentUnits,
                decimalCount: 3,
            },
            expect: {
                milliseconds: 123_456_789,
                seconds: 123456.789,
                minutes: 2057.613,
                hours: 34.294,
                days: 1.429,
                weeks: 0.204,
                months: 0.048,
                quarters: 0.016,
                years: 0.004,
            },
        },
    ]);

    it('has correct type for a single unit', () => {
        assertTypeOf(
            diffDates({
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                units: [DurationUnit.Years],
            }),
        ).toEqualTypeOf<{years: number}>();
        assertTypeOf(
            diffDates({
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                units: [DurationUnit.Years],
                diffType: DiffType.AdditiveUnits,
            }),
        ).toEqualTypeOf<{years: number}>();
        assertTypeOf(
            diffDates({
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                units: [DurationUnit.Years],
                diffType: DiffType.EquivalentUnits,
            }),
        ).toEqualTypeOf<{years: number}>();
    });

    it('has correct type for multiple units', () => {
        assertTypeOf(
            diffDates({
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                units: [
                    DurationUnit.Days,
                    DurationUnit.Hours,
                ],
                diffType: DiffType.AdditiveUnits,
            }),
        ).toEqualTypeOf<{days: number; hours: number}>();
        assertTypeOf(
            diffDates({
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                units: [
                    DurationUnit.Days,
                    DurationUnit.Hours,
                ],
                diffType: DiffType.EquivalentUnits,
            }),
        ).toEqualTypeOf<{days: number; hours: number}>();
    });

    it('requires diffType input when multiple units are specified', () => {
        assertTypeOf(
            diffDates({
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                units: [
                    DurationUnit.Days,
                ],
            }),
        ).toEqualTypeOf<{days: number}>();
        assertTypeOf(
            diffDates({
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                units: [
                    DurationUnit.Days,
                    DurationUnit.Hours,
                ],
                diffType: DiffType.EquivalentUnits,
            }),
        ).toEqualTypeOf<{days: number; hours: number}>();
        assertThrows(
            () =>
                /** DiffType is missing. */
                // @ts-expect-error
                diffDates({
                    start: exampleFullDateOffset,
                    end: exampleFullDateUtc,
                    units: [
                        DurationUnit.Days,
                        DurationUnit.Hours,
                    ],
                }),
            {matchMessage: 'no diffType'},
        );
    });

    it('fails on invalid diffType', () => {
        assertThrows(
            () =>
                diffDates({
                    start: exampleFullDateOffset,
                    end: exampleFullDateUtc,
                    units: [
                        DurationUnit.Days,
                        DurationUnit.Hours,
                    ],
                    // @ts-expect-error
                    diffType: 'invalid-diff-type',
                }),
            {matchMessage: 'diffType is invalid'},
        );
    });

    it('has proper types', () => {
        assertTypeOf(
            diffDates({
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                units: [DurationUnit.Years],
            }),
        ).toEqualTypeOf<{years: number}>();

        assertTypeOf(
            diffDates({
                start: exampleFullDateUtc,
                end: exampleFullDateOffset,
                units: [DurationUnit.Seconds],
            }),
        ).toMatchTypeOf<{seconds: number}>();
        assertTypeOf(
            diffDates({
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                units: [DurationUnit.Minutes],
            }),
        ).toMatchTypeOf<{
            minutes: number;
        }>();
        assertTypeOf(
            diffDates({
                start: exampleFullDateOffset,
                end: exampleFullDateUtc,
                unit: DurationUnit.Years,
            }),
        ).toEqualTypeOf<{years: number}>();

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
