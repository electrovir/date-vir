import {assertTypeOf, itCases} from '@augment-vir/browser-testing';
import {RequiredBy} from '@augment-vir/common';
import {assert} from '@open-wc/testing';
import {SetOptional} from 'type-fest';
import {timezones, utcTimezone} from '../timezone/timezones';
import {createFullDate, toNewTimezone} from './create-full-date';
import {formatPresets} from './format-presets';
import {DatePart, FullDate, FullDatePartEnum} from './full-date-shape';
import {
    exampleFullDate,
    exampleIsoString,
    exampleTimestamp,
    nonUtcTimezone,
} from './full-date.test-helper';
import {
    toFormattedString,
    toHtmlInputString,
    toIsoString,
    toLocaleString,
    toTimestamp,
} from './primitive-conversions';
import {JustDateString, JustTimeString, JustTimeWithSecondsString} from './string-format-types';

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
                toNewTimezone(exampleFullDate, timezones['America/Chicago']),
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
    ]);

    it('has proper types', () => {
        assertTypeOf(
            toHtmlInputString(exampleFullDate, FullDatePartEnum.Date),
        ).toEqualTypeOf<JustDateString>();
        assertTypeOf(
            toHtmlInputString(exampleFullDate, FullDatePartEnum.Time),
        ).toEqualTypeOf<JustTimeString>();
        assertTypeOf(
            toHtmlInputString(exampleFullDate, FullDatePartEnum.Time, true),
        ).toEqualTypeOf<JustTimeWithSecondsString>();
        assertTypeOf(
            toHtmlInputString(exampleFullDate, FullDatePartEnum.Time, true as boolean | undefined),
        ).toEqualTypeOf<JustTimeWithSecondsString | JustTimeString>();
        assertTypeOf(
            toHtmlInputString(exampleFullDate, FullDatePartEnum.Date as FullDatePartEnum),
        ).toEqualTypeOf<JustDateString | JustTimeString>();
        assertTypeOf(
            toHtmlInputString(exampleFullDate, FullDatePartEnum.Date as FullDatePartEnum, true),
        ).toEqualTypeOf<JustDateString | JustTimeWithSecondsString>();
        assertTypeOf(
            toHtmlInputString(
                exampleFullDate,
                FullDatePartEnum.Date as FullDatePartEnum,
                false as boolean | undefined,
            ),
        ).toEqualTypeOf<JustDateString | JustTimeWithSecondsString | JustTimeString>();
    });
});

describe(toLocaleString.name, () => {
    itCases(toLocaleString, [
        {
            it: 'formats a string with the given locale',
            inputs: [
                exampleFullDate,
                {locale: 'fr'},
            ],
            expect: '05/06/2023',
        },
        {
            it: 'formats a string with the user locale',
            inputs: [
                exampleFullDate,
            ],
            throws: undefined,
        },
    ]);

    it('formats with some more options', () => {
        const result = toLocaleString(
            toNewTimezone(exampleFullDate, timezones['America/Chicago']),
            {
                ...formatPresets.DatetimeFull,
                locale: 'en-us',
            },
        );

        assert.include(
            [
                /** Different options the depend on the browser and operating system */
                'June 5, 2023 at 9:19 AM CDT',
                'June 5, 2023, 9:19 AM CDT',
            ],
            result,
        );
    });
});

describe(toFormattedString.name, () => {
    itCases(toFormattedString, [
        {
            it: 'should produce a string of arbitrary formatting',
            inputs: [
                exampleFullDate,
                'MMM-yyyy',
            ],
            expect: 'Jun-2023',
        },
    ]);
});

describe(toIsoString.name, () => {
    itCases(toIsoString, [
        {
            it: 'converts a UTC FullDate into an ISO string',
            input: exampleFullDate,
            expect: exampleIsoString,
        },
        {
            it: 'converts a timezone shifted date to the same ISO string',
            input: createFullDate(exampleFullDate, nonUtcTimezone),
            expect: exampleIsoString,
        },
    ]);
});

describe(toTimestamp.name, () => {
    itCases(toTimestamp, [
        {
            it: 'converts a UTC FullDate into a timestamp',
            input: exampleFullDate,
            expect: exampleTimestamp,
        },
        {
            it: 'converts a timezone shifted FullDate into the same timestamp',
            input: createFullDate(exampleFullDate, nonUtcTimezone),
            expect: exampleTimestamp,
        },
    ]);
});
