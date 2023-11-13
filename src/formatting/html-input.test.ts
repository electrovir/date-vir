import {itCases} from '@augment-vir/browser-testing';
import {RequiredBy} from '@augment-vir/common';
import {assertTypeOf} from 'run-time-assertions';
import {SetOptional} from 'type-fest';
import {createFullDate, toNewTimezone} from '../full-date/create-full-date';
import {DatePart, FullDate, FullDatePartEnum} from '../full-date/full-date-shape';
import {exampleFullDateUtc} from '../full-date/full-date.test-helper';
import {timezones, utcTimezone} from '../timezone/timezones';
import {toHtmlInputString} from './html-input';
import {
    DateTimeString,
    DateTimeWithSeconds,
    JustDateString,
    JustTimeString,
    JustTimeWithSecondsString,
} from './string-format-types';

describe(toHtmlInputString.name, () => {
    itCases(toHtmlInputString, [
        {
            it: 'creates date strings in UTC',
            inputs: [
                createFullDate('2023-06-05T14:19:00.870Z', utcTimezone),
                FullDatePartEnum.Date,
            ],
            expect: '2023-06-05',
        },
        {
            it: 'creates date strings in shifted timezones',
            inputs: [
                toNewTimezone(exampleFullDateUtc, timezones['America/Chicago']),
                FullDatePartEnum.Date,
            ],
            expect: '2023-06-05',
        },
        {
            it: 'creates date strings in other time zones without the date changing',
            inputs: [
                createFullDate(
                    '2023-06-05T14:19:00.870Z',
                    // this timezone will create a date that is a day later
                    timezones['Etc/GMT-11'],
                ),
                FullDatePartEnum.Date,
            ],
            expect: '2023-06-06',
        },
        {
            it: 'creates time strings in UTC',
            inputs: [
                createFullDate('2023-06-05T14:19:00.870Z', utcTimezone),
                FullDatePartEnum.Time,
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
                FullDatePartEnum.Time,
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
                FullDatePartEnum.Time,
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
                FullDatePartEnum.Date,
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
                FullDatePartEnum.Date,
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
                FullDatePartEnum.Date,
            ],
            throws: Error,
        },
        {
            it: 'errors if date is missing month',
            inputs: [
                {
                    year: 2023,
                    day: 24,
                } as SetOptional<DatePart,
                    'timezone'>,
                FullDatePartEnum.Date,
            ],
            throws: Error,
        },
        {
            it: 'errors if date is missing year',
            inputs: [
                {
                    month: 10,
                    day: 24,
                } as SetOptional<DatePart,
                    'timezone'>,
                FullDatePartEnum.Date,
            ],
            throws: Error,
        },
        {
            it: 'errors if includeSeconds time is missing second',
            inputs: [
                {
                    hour: 12,
                    minute: 53,
                } as RequiredBy<
                    Partial<FullDate>,
                    | 'hour'
                    | 'minute'
                    | 'second'
                >,
                FullDatePartEnum.Time,
                true,
            ],
            throws: Error,
        },
        {
            it: 'errors if time is missing minute',
            inputs: [
                {
                    hour: 12,
                } as RequiredBy<
                    Partial<FullDate>,
                    | 'hour'
                    | 'minute'
                >,
                FullDatePartEnum.Time,
            ],
            throws: Error,
        },
        {
            it: 'errors if time is missing hour',
            inputs: [
                {
                    minute: 53,
                } as RequiredBy<
                    Partial<FullDate>,
                    | 'hour'
                    | 'minute'
                >,
                FullDatePartEnum.Time,
            ],
            throws: Error,
        },
        {
            it: 'creates time strings in UTC with seconds',
            inputs: [
                createFullDate('2023-06-05T14:19:03.870Z', utcTimezone),
                FullDatePartEnum.Time,
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
            throws: Error,
        },
        {
            it: 'creates time strings in another time zone without the time changing',
            inputs: [
                createFullDate(
                    '2023-06-05T14:19:03.870Z',
                    // this timezone will create a date that is a day later
                    timezones['Etc/GMT-11'],
                ),
                FullDatePartEnum.Time,
                true,
            ],
            expect: '01:19:03',
        },
        {
            it: 'creates a datetime string without seconds',
            inputs: [
                createFullDate('2023-06-05T14:19:03.870Z', utcTimezone),
                FullDatePartEnum.DateTime,
            ],
            expect: '2023-06-05T14:19',
        },
        {
            it: 'creates a datetime string with seconds',
            inputs: [
                createFullDate('2023-06-05T14:19:03.870Z', utcTimezone),
                FullDatePartEnum.DateTime,
                true,
            ],
            expect: '2023-06-05T14:19:03',
        },
    ]);

    it('has proper types', () => {
        assertTypeOf(
            toHtmlInputString(exampleFullDateUtc, FullDatePartEnum.DateTime),
        ).toEqualTypeOf<DateTimeString>();
        assertTypeOf(
            toHtmlInputString(exampleFullDateUtc, FullDatePartEnum.DateTime, true),
        ).toEqualTypeOf<DateTimeWithSeconds>();
        assertTypeOf(
            toHtmlInputString(exampleFullDateUtc, FullDatePartEnum.Date),
        ).toEqualTypeOf<JustDateString>();
        assertTypeOf(
            toHtmlInputString(exampleFullDateUtc, FullDatePartEnum.Time),
        ).toEqualTypeOf<JustTimeString>();
        assertTypeOf(
            toHtmlInputString(exampleFullDateUtc, FullDatePartEnum.Time, true),
        ).toEqualTypeOf<JustTimeWithSecondsString>();
        assertTypeOf(
            toHtmlInputString(
                exampleFullDateUtc,
                FullDatePartEnum.Time,
                true as boolean | undefined,
            ),
        ).toEqualTypeOf<JustTimeWithSecondsString | JustTimeString>();
        assertTypeOf(
            toHtmlInputString(exampleFullDateUtc, FullDatePartEnum.Date as FullDatePartEnum),
        ).toEqualTypeOf<JustDateString | JustTimeString>();
        assertTypeOf(
            toHtmlInputString(exampleFullDateUtc, FullDatePartEnum.Date as FullDatePartEnum, true),
        ).toEqualTypeOf<JustDateString | JustTimeWithSecondsString>();
        assertTypeOf(
            toHtmlInputString(
                exampleFullDateUtc,
                FullDatePartEnum.Date as FullDatePartEnum,
                false as boolean | undefined,
            ),
        ).toEqualTypeOf<
            | JustDateString
            | JustTimeWithSecondsString
            | JustTimeString
            | DateTimeWithSeconds
            | DateTimeString
        >();
    });
});
