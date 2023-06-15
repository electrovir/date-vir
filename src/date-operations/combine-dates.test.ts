import {assertTypeOf, itCases} from '@augment-vir/browser-testing';
import {getObjectTypedKeys, omitObjectKeys} from '@augment-vir/common';
import {
    DatePart,
    FullDate,
    FullDatePartEnum,
    TimePart,
    datePartShape,
    timePartShape,
} from '../full-date/full-date-shape';
import {exampleFullDate, nonUserTimezone} from '../full-date/full-date.test-helper';
import {userTimezone} from '../timezone/timezones';
import {MaybeDatePart, combineDateParts} from './combine-dates';

describe(combineDateParts.name, () => {
    itCases(combineDateParts, [
        {
            it: 'does not modify parts that are the same',
            input: {
                [FullDatePartEnum.Date]: exampleFullDate,
                [FullDatePartEnum.Time]: exampleFullDate,
            },
            expect: exampleFullDate,
        },
        {
            it: 'handles undefined date part',
            input: {
                [FullDatePartEnum.Time]: exampleFullDate,
            },
            expect: omitObjectKeys(
                exampleFullDate,
                getObjectTypedKeys(datePartShape.defaultValue).filter(
                    (
                        key,
                    ): key is Exclude<keyof (typeof datePartShape)['runTimeType'], 'timezone'> =>
                        key !== 'timezone',
                ),
            ),
        },
        {
            it: 'handles undefined time part',
            input: {
                [FullDatePartEnum.Date]: exampleFullDate,
            },
            expect: omitObjectKeys(
                exampleFullDate,
                getObjectTypedKeys(timePartShape.defaultValue).filter(
                    (
                        key,
                    ): key is Exclude<keyof (typeof timePartShape)['runTimeType'], 'timezone'> =>
                        key !== 'timezone',
                ),
            ),
        },
        {
            it: 'merges two date parts',
            input: {
                [FullDatePartEnum.Time]: {
                    hour: 12,
                    minute: 32,
                    second: 52,
                    millisecond: 100,
                    timezone: userTimezone,
                },
                [FullDatePartEnum.Date]: {
                    year: 2023,
                    month: 8,
                    day: 9,
                    timezone: userTimezone,
                },
            },
            expect: {
                hour: 12,
                minute: 32,
                second: 52,
                millisecond: 100,
                year: 2023,
                month: 8,
                day: 9,
                timezone: userTimezone,
            },
        },
        {
            it: 'merges two different FullDate instances',
            input: {
                [FullDatePartEnum.Time]: {
                    hour: 12,
                    minute: 32,
                    second: 52,
                    millisecond: 100,

                    year: 2023,
                    month: 8,
                    day: 9,
                    timezone: userTimezone,
                },
                [FullDatePartEnum.Date]: {
                    hour: 7,
                    minute: 56,
                    second: 46,
                    millisecond: 987,

                    year: 2022,
                    month: 1,
                    day: 21,
                    timezone: userTimezone,
                },
            },
            expect: {
                hour: 12,
                minute: 32,
                second: 52,
                millisecond: 100,
                year: 2022,
                month: 1,
                day: 21,
                timezone: userTimezone,
            },
        },
        {
            it: 'errors if timezones are different',
            input: {
                [FullDatePartEnum.Time]: {
                    hour: 12,
                    minute: 32,
                    second: 52,
                    millisecond: 100,

                    year: 2023,
                    month: 8,
                    day: 9,
                    timezone: nonUserTimezone,
                },
                [FullDatePartEnum.Date]: {
                    hour: 7,
                    minute: 56,
                    second: 46,
                    millisecond: 987,

                    year: 2022,
                    month: 1,
                    day: 21,
                    timezone: userTimezone,
                },
            },
            throws: 'Time and date parts have mismatching timezones',
        },
    ]);

    it('has proper types', () => {
        assertTypeOf(combineDateParts({})).toEqualTypeOf<undefined>();
        assertTypeOf(
            combineDateParts({
                date: exampleFullDate,
            }),
        ).toEqualTypeOf<DatePart>();
        assertTypeOf(
            combineDateParts({
                time: exampleFullDate,
            }),
        ).toEqualTypeOf<TimePart>();
        assertTypeOf(
            combineDateParts({
                date: exampleFullDate,
                time: exampleFullDate,
            }),
        ).toEqualTypeOf<FullDate>();
        assertTypeOf(
            combineDateParts({
                date: exampleFullDate,
                time: exampleFullDate as FullDate | undefined,
            }),
        ).toEqualTypeOf<FullDate | DatePart>();
        assertTypeOf(
            combineDateParts({
                date: exampleFullDate as FullDate | undefined,
                time: exampleFullDate,
            }),
        ).toEqualTypeOf<FullDate | TimePart>();
        assertTypeOf(
            combineDateParts({
                date: exampleFullDate as FullDate | undefined,
                time: exampleFullDate as FullDate | undefined,
            }),
        ).toEqualTypeOf<MaybeDatePart>();
    });
});
