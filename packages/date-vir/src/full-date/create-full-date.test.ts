import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {DateTime} from 'luxon';
import {Timezone, userTimezone, utcTimezone} from '../timezone/timezones.js';
import {
    createFullDate,
    createFullDateInUserTimezone,
    createUtcFullDate,
    toNewTimezone,
} from './create-full-date.js';
import {fullDateShape, type FullDate} from './full-date-shape.js';
import {exampleFullDateUtc, exampleIsoString, exampleTimestamp} from './full-date.mock.js';
import {assertValidFullDate} from './is-valid-full-date.js';

describe(createFullDateInUserTimezone.name, () => {
    itCases(createFullDateInUserTimezone, [
        {
            it: 'creates a full date in the user timezone',
            input: fullDateShape.defaultValue,
            expect: createFullDate(fullDateShape.defaultValue, userTimezone),
        },
    ]);

    it('works on the examples', () => {
        const exampleInputs = [
            'June 1, 2024',
            new Date(),
            112_300_120,
        ];

        exampleInputs.forEach((example) => {
            assertValidFullDate(createFullDateInUserTimezone(example));
        });
    });
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

    it('works on the examples', () => {
        const exampleInputs = [
            'June 1, 2024',
            new Date(),
            112_300_120,
        ];

        exampleInputs.forEach((example) => {
            assertValidFullDate(createUtcFullDate(example));
        });
    });
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
                Timezone['Australia/Brisbane'],
            ],
            expect: {
                ...exampleFullDateUtc,
                day: 6,
                hour: 0,
                timezone: Timezone['Australia/Brisbane'],
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
                Timezone['Etc/GMT-11'],
            ],
            expect: {
                ...exampleFullDateUtc,
                day: 6,
                hour: 1,
                timezone: Timezone['Etc/GMT-11'],
            },
        },
        {
            it: 'handles a non UTC timezone for an ISO string without Z',
            inputs: [
                exampleIsoString.slice(0, -1),
                Timezone['Australia/Brisbane'],
            ],
            expect: {
                ...exampleFullDateUtc,
                timezone: Timezone['Australia/Brisbane'],
            },
        },
        {
            it: 'handles a luxon DateTime object',
            inputs: [
                DateTime.fromMillis(exampleTimestamp),
                Timezone['Australia/Brisbane'],
            ],
            expect: {
                ...exampleFullDateUtc,
                day: 6,
                hour: 0,
                timezone: Timezone['Australia/Brisbane'],
            },
        },
        {
            it: 'converts FullDate time zones',
            inputs: [
                exampleIsoString,
                Timezone['Etc/GMT-1'],
            ],
            expect: {
                ...exampleFullDateUtc,
                hour: exampleFullDateUtc.hour + 1,
                timezone: Timezone['Etc/GMT-1'],
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
                Timezone['Australia/Brisbane'],
            ],
            expect: {
                ...exampleFullDateUtc,
                day: 6,
                hour: 0,
                timezone: Timezone['Australia/Brisbane'],
            },
        },
        {
            it: 'rejects an invalid date number',
            inputs: [
                Infinity,
                Timezone['Australia/Brisbane'],
            ],
            throws: {
                matchMessage: 'Failed to parse date input',
            },
        },
        {
            it: 'rejects an invalid date string',
            inputs: [
                'foobar',
                Timezone['Australia/Brisbane'],
            ],
            throws: {
                matchMessage: "Failed to parse date input 'foobar'",
            },
        },
        {
            it: 'rejects an invalid date string',
            inputs: [
                new Date('foobar'),
                Timezone['Australia/Brisbane'],
            ],
            throws: {
                matchMessage: 'Failed to parse date input',
            },
        },
        {
            it: 'rejects an invalid full date object',
            inputs: [
                {
                    ...exampleFullDateUtc,
                    day: 99,
                },
                Timezone['Australia/Brisbane'],
            ],
            throws: {
                matchMessage: 'Failed to parse date input',
            },
        },
    ]);
});

describe(toNewTimezone.name, () => {
    it('adjusts a timezone without modifying the original', () => {
        const myDate = createFullDate(exampleIsoString, Timezone['Etc/GMT+3']);

        const shiftedDate = toNewTimezone(myDate, utcTimezone);

        assert.notDeepEquals(shiftedDate, myDate);
    });

    it('does nothing if the given date is already in the given timezone', () => {
        const myDate = createFullDate(exampleIsoString, exampleFullDateUtc.timezone);

        const shiftedDate: FullDate = toNewTimezone(myDate, utcTimezone);

        assert.deepEquals(shiftedDate, myDate);
    });
    it('works on the example', () => {
        const exampleDate: FullDate = {
            year: 2024,
            month: 1,
            day: 5,
            hour: 1,
            minute: 1,
            second: 1,
            millisecond: 1,
            timezone: 'UTC',
        };

        assert.deepEquals(toNewTimezone(exampleDate, Timezone['Australia/Brisbane']), {
            year: 2024,
            month: 1,
            day: 5,
            hour: 11,
            minute: 1,
            second: 1,
            millisecond: 1,
            timezone: Timezone['Australia/Brisbane'],
        });
    });
});
