import {itCases} from '@augment-vir/browser-testing';
import {mapObjectValues, randomInteger, round} from '@augment-vir/common';
import {assertTypeOf} from 'run-time-assertions';
import {Duration, DurationUnit} from '../duration';
import {exampleFullDateUtc} from '../full-date/full-date.test-helper';
import {calculateRelativeDate} from './calculate-relative-date';
import {diffDates, diffDatesAllUnits, isDateAfter} from './diff-dates';

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

describe(diffDatesAllUnits.name, () => {
    const diff = {milliseconds: 123_456_789};

    function diffDatesAllUnitsTestWrapper(...inputs: Parameters<typeof diffDatesAllUnits>) {
        const diffOutput = diffDatesAllUnits(...inputs);

        return mapObjectValues(diffOutput, (key, value) => {
            return round({
                /** Use 3 digits so we can still get a distinct value for year diffs. */
                digits: 3,
                number: value,
            });
        });
    }

    itCases(diffDatesAllUnitsTestWrapper, [
        {
            it: 'calculates seconds diff',
            input: {
                start: exampleFullDateUtc,
                end: calculateRelativeDate(exampleFullDateUtc, diff),
            },
            expect: {
                milliseconds: diff.milliseconds,
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
});

describe(diffDates.name, () => {
    itCases(diffDates, [
        {
            it: 'calculates seconds diff',
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
            it: 'calculates inverse if inputs are swapped',
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
        {
            it: 'calculates year diff',
            input: {
                start: exampleFullDateUtc,
                end: {
                    ...exampleFullDateUtc,
                    year: exampleFullDateUtc.year - 10,
                },
                unit: DurationUnit.Years,
            },
            expect: {
                years: -10,
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
