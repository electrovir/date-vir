import {assert} from '@augment-vir/assert';
import {getObjectTypedKeys, omitObjectKeys} from '@augment-vir/common';
import {describe, it, itCases} from '@augment-vir/test';
import {
    DatePart,
    FullDate,
    FullDatePartEnum,
    TimePart,
    datePartShape,
    timePartShape,
} from '../full-date/full-date-shape.js';
import {exampleFullDateUtc, nonUserTimezone} from '../full-date/full-date.mock.js';
import {Timezone} from '../timezone/timezone-names.js';
import {userTimezone} from '../timezone/timezones.js';
import {MaybeDatePart, combineDateParts} from './combine-dates.js';

describe(combineDateParts.name, () => {
    itCases(combineDateParts, [
        {
            it: 'does not modify parts that are the same',
            input: {
                [FullDatePartEnum.Date]: exampleFullDateUtc,
                [FullDatePartEnum.Time]: exampleFullDateUtc,
            },
            expect: exampleFullDateUtc,
        },
        {
            it: 'handles undefined date part',
            input: {
                [FullDatePartEnum.Time]: exampleFullDateUtc,
            },
            expect: omitObjectKeys(
                exampleFullDateUtc,
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
                [FullDatePartEnum.Date]: exampleFullDateUtc,
            },
            expect: omitObjectKeys(
                exampleFullDateUtc,
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
            throws: {
                matchMessage: 'Time and date parts have mismatching timezones',
            },
        },
    ]);

    it('has proper types', () => {
        assert.tsType(combineDateParts({})).equals<undefined>();
        assert
            .tsType(
                combineDateParts({
                    date: exampleFullDateUtc,
                }),
            )
            .equals<DatePart>();
        assert
            .tsType(
                combineDateParts({
                    time: exampleFullDateUtc,
                }),
            )
            .equals<TimePart>();
        assert
            .tsType(
                combineDateParts({
                    date: exampleFullDateUtc,
                    time: exampleFullDateUtc,
                }),
            )
            .equals<FullDate>();
        assert
            .tsType(
                combineDateParts({
                    date: exampleFullDateUtc,
                    time: exampleFullDateUtc as FullDate | undefined,
                }),
            )
            .equals<FullDate | DatePart>();
        assert
            .tsType(
                combineDateParts({
                    date: exampleFullDateUtc as FullDate | undefined,
                    time: exampleFullDateUtc,
                }),
            )
            .equals<FullDate | TimePart>();
        assert
            .tsType(
                combineDateParts({
                    date: exampleFullDateUtc as FullDate | undefined,
                    time: exampleFullDateUtc as FullDate | undefined,
                }),
            )
            .equals<MaybeDatePart<Timezone>>();
    });
});
