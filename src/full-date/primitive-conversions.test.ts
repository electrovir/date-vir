import {assertTypeOf, itCases} from '@augment-vir/browser-testing';
import {timezones, utcTimezone} from '../timezone/timezones';
import {createFullDate, toNewTimezone} from './create-full-date';
import {formatPresets} from './format-presets';
import {
    exampleFullDate,
    exampleIsoString,
    exampleTimestamp,
    nonUtcTimezone,
} from './full-date.test-helper';
import {
    HtmlInputElementTypeEnum,
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
                HtmlInputElementTypeEnum.Date,
            ],
            expect: '2023-06-05',
        },
        {
            it: 'creates date strings in shifted timezones',
            inputs: [
                toNewTimezone(exampleFullDate, timezones['America/Chicago']),
                HtmlInputElementTypeEnum.Date,
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
                HtmlInputElementTypeEnum.Date,
            ],
            expect: '2023-06-06',
        },
        {
            it: 'creates time strings in UTC',
            inputs: [
                createFullDate('2023-06-05T14:19:00.870Z', utcTimezone),
                HtmlInputElementTypeEnum.Time,
            ],
            expect: '14:19',
        },
        {
            it: 'creates time strings in UTC with seconds',
            inputs: [
                createFullDate('2023-06-05T14:19:03.870Z', utcTimezone),
                HtmlInputElementTypeEnum.Time,
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
                HtmlInputElementTypeEnum.Time,
                true,
            ],
            expect: '01:19:03',
        },
    ]);

    it('has proper types', () => {
        assertTypeOf(
            toHtmlInputString(exampleFullDate, HtmlInputElementTypeEnum.Date),
        ).toEqualTypeOf<JustDateString>();
        assertTypeOf(
            toHtmlInputString(exampleFullDate, HtmlInputElementTypeEnum.Time),
        ).toEqualTypeOf<JustTimeString>();
        assertTypeOf(
            toHtmlInputString(exampleFullDate, HtmlInputElementTypeEnum.Time, true),
        ).toEqualTypeOf<JustTimeWithSecondsString>();
        assertTypeOf(
            toHtmlInputString(
                exampleFullDate,
                HtmlInputElementTypeEnum.Time,
                true as boolean | undefined,
            ),
        ).toEqualTypeOf<JustTimeWithSecondsString | JustTimeString>();
        assertTypeOf(
            toHtmlInputString(
                exampleFullDate,
                HtmlInputElementTypeEnum.Date as HtmlInputElementTypeEnum,
            ),
        ).toEqualTypeOf<JustDateString | JustTimeString>();
        assertTypeOf(
            toHtmlInputString(
                exampleFullDate,
                HtmlInputElementTypeEnum.Date as HtmlInputElementTypeEnum,
                true,
            ),
        ).toEqualTypeOf<JustDateString | JustTimeWithSecondsString>();
        assertTypeOf(
            toHtmlInputString(
                exampleFullDate,
                HtmlInputElementTypeEnum.Date as HtmlInputElementTypeEnum,
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
            it: 'formats a string with some more options',
            inputs: [
                toNewTimezone(exampleFullDate, timezones['America/Chicago']),
                {
                    ...formatPresets.DatetimeFull,
                    locale: 'en-us',
                },
            ],
            expect: 'June 5, 2023 at 9:19 AM CDT',
        },
        {
            it: 'formats a string with the user locale',
            inputs: [
                exampleFullDate,
            ],
            throws: undefined,
        },
    ]);
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
