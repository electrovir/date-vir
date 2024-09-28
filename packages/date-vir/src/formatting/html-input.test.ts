import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {SetOptional, type SetRequired} from 'type-fest';
import {createFullDate, toNewTimezone} from '../full-date/create-full-date.js';
import {FullDatePart} from '../full-date/full-date-parts.js';
import {DatePart, FullDate} from '../full-date/full-date-shape.js';
import {exampleFullDateUtc} from '../full-date/full-date.mock.js';
import {Timezone, utcTimezone} from '../timezone/timezones.js';
import {toHtmlInputString} from './html-input.js';
import {
    DateTimeString,
    DateTimeWithSeconds,
    JustDateString,
    JustTimeString,
    JustTimeWithSecondsString,
} from './string-format-types.js';

describe(toHtmlInputString.name, () => {
    itCases(toHtmlInputString, [
        {
            it: 'creates date strings in UTC',
            inputs: [
                createFullDate('2023-06-05T14:19:00.870Z', utcTimezone),
                FullDatePart.Date,
            ],
            expect: '2023-06-05',
        },
        {
            it: 'creates date strings in shifted timezones',
            inputs: [
                toNewTimezone(exampleFullDateUtc, Timezone['America/Chicago']),
                FullDatePart.Date,
            ],
            expect: '2023-06-05',
        },
        {
            it: 'creates date strings in other time zones without the date changing',
            inputs: [
                createFullDate(
                    '2023-06-05T14:19:00.870Z',
                    // this timezone will create a date that is a day later
                    Timezone['Etc/GMT-11'],
                ),
                FullDatePart.Date,
            ],
            expect: '2023-06-06',
        },
        {
            it: 'creates time strings in UTC',
            inputs: [
                createFullDate('2023-06-05T14:19:00.870Z', utcTimezone),
                FullDatePart.Time,
            ],
            expect: '14:19',
        },
        {
            it: 'creates a time string from a time part',
            inputs: [
                {
                    hour: 13,
                    minute: 26,
                },
                FullDatePart.Time,
            ],
            expect: '13:26',
        },
        {
            it: 'creates a time string with seconds from a time part',
            inputs: [
                {
                    hour: 13,
                    minute: 26,
                    second: 6,
                },
                FullDatePart.Time,
                true,
            ],
            expect: '13:26:06',
        },
        {
            it: 'creates a date string with a date part',
            inputs: [
                {
                    year: 2023,
                    month: 10,
                    day: 24,
                },
                FullDatePart.Date,
            ],
            expect: '2023-10-24',
        },
        {
            it: 'pads short years',
            inputs: [
                {
                    year: 2023,
                    month: 10,
                    day: 24,
                },
                FullDatePart.Date,
            ],
            expect: '2023-10-24',
        },
        {
            it: 'errors if date is missing day',
            inputs: [
                {
                    year: 2023,
                    month: 10,
                } as SetOptional<DatePart,
                    'timezone'>,
                FullDatePart.Date,
            ],
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'errors if date is missing month',
            inputs: [
                {
                    year: 2023,
                    day: 24,
                } as SetOptional<DatePart,
                    'timezone'>,
                FullDatePart.Date,
            ],
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'errors if date is missing year',
            inputs: [
                {
                    month: 10,
                    day: 24,
                } as SetOptional<DatePart,
                    'timezone'>,
                FullDatePart.Date,
            ],
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'errors if includeSeconds time is missing second',
            inputs: [
                {
                    hour: 12,
                    minute: 53,
                } as SetRequired<
                    Partial<FullDate>,
                    | 'hour'
                    | 'minute'
                    | 'second'
                >,
                FullDatePart.Time,
                true,
            ],
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'errors if time is missing minute',
            inputs: [
                {
                    hour: 12,
                } as SetRequired<
                    Partial<FullDate>,
                    | 'hour'
                    | 'minute'
                >,
                FullDatePart.Time,
            ],
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'errors if time is missing hour',
            inputs: [
                {
                    minute: 53,
                } as SetRequired<
                    Partial<FullDate>,
                    | 'hour'
                    | 'minute'
                >,
                FullDatePart.Time,
            ],
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'creates time strings in UTC with seconds',
            inputs: [
                createFullDate('2023-06-05T14:19:03.870Z', utcTimezone),
                FullDatePart.Time,
                true,
            ],
            expect: '14:19:03',
        },
        {
            it: 'fails on invalid type',
            inputs: [
                createFullDate('2023-06-05T14:19:03.870Z', utcTimezone),
                'not a type' as any,
            ],
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'creates time strings in another time zone without the time changing',
            inputs: [
                createFullDate(
                    '2023-06-05T14:19:03.870Z',
                    // this timezone will create a date that is a day later
                    Timezone['Etc/GMT-11'],
                ),
                FullDatePart.Time,
                true,
            ],
            expect: '01:19:03',
        },
        {
            it: 'creates a datetime string without seconds',
            inputs: [
                createFullDate('2023-06-05T14:19:03.870Z', utcTimezone),
                FullDatePart.DateTime,
            ],
            expect: '2023-06-05T14:19',
        },
        {
            it: 'creates a datetime string with seconds',
            inputs: [
                createFullDate('2023-06-05T14:19:03.870Z', utcTimezone),
                FullDatePart.DateTime,
                true,
            ],
            expect: '2023-06-05T14:19:03',
        },
    ]);

    it('has proper types', () => {
        assert
            .tsType(toHtmlInputString(exampleFullDateUtc, FullDatePart.DateTime))
            .equals<DateTimeString>();
        assert
            .tsType(toHtmlInputString(exampleFullDateUtc, FullDatePart.DateTime, true))
            .equals<DateTimeWithSeconds>();
        assert
            .tsType(toHtmlInputString(exampleFullDateUtc, FullDatePart.Date))
            .equals<JustDateString>();
        assert
            .tsType(toHtmlInputString(exampleFullDateUtc, FullDatePart.Time))
            .equals<JustTimeString>();
        assert
            .tsType(toHtmlInputString(exampleFullDateUtc, FullDatePart.Time, true))
            .equals<JustTimeWithSecondsString>();
        assert
            .tsType(
                toHtmlInputString(
                    exampleFullDateUtc,
                    FullDatePart.Time,
                    true as boolean | undefined,
                ),
            )
            .equals<JustTimeWithSecondsString | JustTimeString>();
        assert
            .tsType(toHtmlInputString(exampleFullDateUtc, FullDatePart.Date as FullDatePart))
            .equals<JustDateString | JustTimeString>();
        assert
            .tsType(toHtmlInputString(exampleFullDateUtc, FullDatePart.Date as FullDatePart, true))
            .equals<JustDateString | JustTimeWithSecondsString>();
        assert
            .tsType(
                toHtmlInputString(
                    exampleFullDateUtc,
                    FullDatePart.Date as FullDatePart,
                    false as boolean | undefined,
                ),
            )
            .equals<
                | JustDateString
                | JustTimeWithSecondsString
                | JustTimeString
                | DateTimeWithSeconds
                | DateTimeString
            >();
    });
});
