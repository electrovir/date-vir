import {itCases} from '@augment-vir/browser-testing';
import {omitObjectKeys} from '@augment-vir/common';
import {assert} from '@open-wc/testing';
import {DateTime} from 'luxon';
import {timezones, userTimezone, utcTimezone} from '../timezone/timezones';
import {
    createFullDate,
    createFullDateInUserTimezone,
    createUtcFullDate,
    getNowFullDate,
    toNewTimezone,
} from './create-full-date';
import {FullDate, fullDateShape} from './full-date-shape';
import {
    exampleFullDateUtc,
    exampleIsoString,
    exampleTimestamp,
    nonUserTimezone,
} from './full-date.test-helper';

describe(createFullDateInUserTimezone.name, () => {
    itCases(createFullDateInUserTimezone, [
        {
            it: 'creates a full date in the user timezone',
            input: fullDateShape.defaultValue,
            expect: createFullDate(fullDateShape.defaultValue, userTimezone),
        },
    ]);
});

describe(createUtcFullDate.name, () => {
    itCases(createUtcFullDate, [
        {
            it: 'creates a full date in the utc timezone',
            input: fullDateShape.defaultValue,
            expect: {
                ...fullDateShape.defaultValue,
                timezone: utcTimezone,
            },
        },
    ]);
});

describe(createFullDate.name, () => {
    itCases(createFullDate, [
        {
            it: 'handles a full ISO string',
            inputs: [
                exampleIsoString,
                utcTimezone,
            ],
            expect: exampleFullDateUtc,
        },
        {
            it: 'works on short month-year string',
            inputs: [
                'jan-2021',
                utcTimezone,
            ],
            expect: {
                day: 1,
                hour: 0,
                millisecond: 0,
                minute: 0,
                month: 1,
                second: 0,
                timezone: 'UTC',
                year: 2021,
            },
        },
        {
            it: 'works on full month-year string',
            inputs: [
                'january-2021',
                utcTimezone,
            ],
            expect: {
                day: 1,
                hour: 0,
                millisecond: 0,
                minute: 0,
                month: 1,
                second: 0,
                timezone: 'UTC',
                year: 2021,
            },
        },
        {
            it: 'works on full month-year string',
            inputs: [
                'january-2021',
                utcTimezone,
            ],
            expect: {
                day: 1,
                hour: 0,
                millisecond: 0,
                minute: 0,
                month: 1,
                second: 0,
                timezone: 'UTC',
                year: 2021,
            },
        },
        {
            it: 'works on month number-year string',
            inputs: [
                '1-2021',
                utcTimezone,
            ],
            expect: {
                day: 1,
                hour: 0,
                millisecond: 0,
                minute: 0,
                month: 1,
                second: 0,
                timezone: 'UTC',
                year: 2021,
            },
        },
        {
            it: 'handles a weird formatted date',
            inputs: [
                'March 1 2023',
                utcTimezone,
            ],
            expect: {
                year: 2023,
                month: 3,
                day: 1,
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
                timezone: utcTimezone,
            },
        },
        {
            it: 'handles a full ISO string with Z for a different time zone',
            inputs: [
                exampleIsoString,
                timezones['Australia/Brisbane'],
            ],
            expect: {
                ...exampleFullDateUtc,
                day: 6,
                hour: 0,
                timezone: timezones['Australia/Brisbane'],
            },
        },
        {
            it: 'handles an ISO string without Z',
            inputs: [
                exampleIsoString.slice(0, -1),
                utcTimezone,
            ],
            expect: exampleFullDateUtc,
        },
        {
            it: 'handles an ISO string with a timezone that changes the date',
            inputs: [
                exampleIsoString,
                timezones['Etc/GMT-11'],
            ],
            expect: {
                ...exampleFullDateUtc,
                day: 6,
                hour: 1,
                timezone: timezones['Etc/GMT-11'],
            },
        },
        {
            it: 'handles a non UTC timezone for an ISO string without Z',
            inputs: [
                exampleIsoString.slice(0, -1),
                timezones['Australia/Brisbane'],
            ],
            expect: {
                ...exampleFullDateUtc,
                timezone: timezones['Australia/Brisbane'],
            },
        },
        {
            it: 'handles a luxon DateTime object',
            inputs: [
                DateTime.fromMillis(exampleTimestamp),
                timezones['Australia/Brisbane'],
            ],
            expect: {
                ...exampleFullDateUtc,
                day: 6,
                hour: 0,
                timezone: timezones['Australia/Brisbane'],
            },
        },
        {
            it: 'converts FullDate time zones',
            inputs: [
                exampleIsoString,
                timezones['Etc/GMT-1'],
            ],
            expect: {
                ...exampleFullDateUtc,
                hour: exampleFullDateUtc.hour + 1,
                timezone: timezones['Etc/GMT-1'],
            },
        },
        {
            it: 'handles a numeric input in UTC',
            inputs: [
                Number(new Date(exampleIsoString)),
                utcTimezone,
            ],
            expect: {
                ...exampleFullDateUtc,
                timezone: utcTimezone,
            },
        },
        {
            it: 'handles a numeric input in a different time zone',
            inputs: [
                Number(new Date(exampleIsoString)),
                timezones['Australia/Brisbane'],
            ],
            expect: {
                ...exampleFullDateUtc,
                day: 6,
                hour: 0,
                timezone: timezones['Australia/Brisbane'],
            },
        },
        {
            it: 'rejects an invalid date number',
            inputs: [
                Infinity,
                timezones['Australia/Brisbane'],
            ],
            throws: 'Failed to parse date input',
        },
        {
            it: 'rejects an invalid date string',
            inputs: [
                'foobar',
                timezones['Australia/Brisbane'],
            ],
            throws: "Failed to parse date input 'foobar'",
        },
        {
            it: 'rejects an invalid date string',
            inputs: [
                new Date('foobar'),
                timezones['Australia/Brisbane'],
            ],
            throws: 'Failed to parse date input',
        },
        {
            it: 'rejects an invalid full date object',
            inputs: [
                {
                    ...exampleFullDateUtc,
                    day: 99,
                },
                timezones['Australia/Brisbane'],
            ],
            throws: 'Failed to parse date input',
        },
    ]);
});

describe(toNewTimezone.name, () => {
    it('adjusts a timezone without modifying the original', () => {
        const myDate = createFullDate(exampleIsoString, timezones['Etc/GMT+3']);

        const shiftedDate = toNewTimezone(myDate, utcTimezone);

        assert.notDeepEqual<FullDate>(shiftedDate, myDate);
    });

    it('does nothing if the given date is already in the given timezone', () => {
        const myDate = createFullDate(exampleIsoString, exampleFullDateUtc.timezone);

        const shiftedDate = toNewTimezone(myDate, utcTimezone);

        assert.deepStrictEqual(shiftedDate, myDate);
    });
});

describe(getNowFullDate.name, () => {
    it('gets the right current time', () => {
        const nowFromDate = omitObjectKeys(createFullDate(Date.now(), userTimezone), [
            'second',
            'millisecond',
        ]);
        const nowFullDateUserTimezone = omitObjectKeys(getNowFullDate(userTimezone), [
            'second',
            'millisecond',
        ]);
        const nowFullDateOtherTimezone = omitObjectKeys(getNowFullDate(nonUserTimezone), [
            'second',
            'millisecond',
        ]);

        assert.deepStrictEqual(nowFromDate, nowFullDateUserTimezone);
        assert.notDeepEqual(nowFromDate, nowFullDateOtherTimezone);
    });
});
