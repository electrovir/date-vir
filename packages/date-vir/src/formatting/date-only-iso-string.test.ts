import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {checkValidShape, defineShape, unionShape} from 'object-shape-tester';
import {getNowFullDate} from '../extra-utils/now.js';
import {type FullDate} from '../full-date/full-date-shape.js';
import {type Timezone, TimezoneName, utcTimezone} from '../timezone/timezones.js';
import {
    dateOnlyUtcIsoStringShape,
    dateOnlyUtcIsoStringToFullDate,
    diffDateOnlyDays,
    getTodayDateOnlyUtcIsoString,
    isValidDateOnlyUtcIsoString,
    toDateOnlyUtcIsoString,
} from './date-only-iso-string.js';

const lateFridayInDenver: Readonly<FullDate> = {
    year: 2026,
    month: 10,
    day: 2,

    hour: 23,
    minute: 30,
    second: 0,
    millisecond: 0,

    timezone: TimezoneName['America/Denver'],
};

const startOfDay = {
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
} as const;

const edgeTimezones: ReadonlyArray<Timezone> = [
    utcTimezone,
    TimezoneName['Pacific/Kiritimati'],
    TimezoneName['Pacific/Pago_Pago'],
    TimezoneName['America/New_York'],
    TimezoneName['America/Asuncion'],
    TimezoneName['Asia/Kolkata'],
    TimezoneName['Australia/Lord_Howe'],
];

function createDateOnly(utcIsoString: string) {
    if (!isValidDateOnlyUtcIsoString(utcIsoString)) {
        throw new Error(`Invalid date-only string: '${utcIsoString}'`);
    }
    return utcIsoString;
}

describe(isValidDateOnlyUtcIsoString.name, () => {
    itCases(isValidDateOnlyUtcIsoString, [
        {
            it: 'accepts midnight UTC',
            input: '2024-05-01T00:00:00.000Z',
            expect: true,
        },
        {
            it: 'accepts a leap day',
            input: '2024-02-29T00:00:00.000Z',
            expect: true,
        },
        {
            it: 'accepts the last day of a year',
            input: '2025-12-31T00:00:00.000Z',
            expect: true,
        },
        {
            it: 'accepts the unix epoch',
            input: '1970-01-01T00:00:00.000Z',
            expect: true,
        },
        {
            it: 'accepts a day before the unix epoch',
            input: '1969-12-31T00:00:00.000Z',
            expect: true,
        },
        {
            it: 'accepts the largest four-digit year',
            input: '9999-12-31T00:00:00.000Z',
            expect: true,
        },
        {
            it: 'rejects a time of day',
            input: '2024-05-01T20:18:17.123Z',
            expect: false,
        },
        {
            it: 'rejects one millisecond after midnight',
            input: '2024-05-01T00:00:00.001Z',
            expect: false,
        },
        {
            it: 'rejects one second after midnight',
            input: '2024-05-01T00:00:01.000Z',
            expect: false,
        },
        {
            it: 'rejects one millisecond before midnight',
            input: '2024-05-01T23:59:59.999Z',
            expect: false,
        },
        {
            it: 'rejects a leap day in a non-leap year',
            input: '2023-02-29T00:00:00.000Z',
            expect: false,
        },
        {
            it: 'rejects a thirteenth month',
            input: '2024-13-01T00:00:00.000Z',
            expect: false,
        },
        {
            it: 'rejects a zeroth day',
            input: '2024-05-00T00:00:00.000Z',
            expect: false,
        },
        {
            it: 'rejects a thirty-first day in a thirty-day month',
            input: '2024-04-31T00:00:00.000Z',
            expect: false,
        },
        {
            it: 'rejects a plain date string',
            input: '2024-05-01',
            expect: false,
        },
        {
            it: 'rejects midnight without milliseconds',
            input: '2024-05-01T00:00:00Z',
            expect: false,
        },
        {
            it: 'rejects midnight with a numeric UTC offset',
            input: '2024-05-01T00:00:00.000+00:00',
            expect: false,
        },
        {
            it: 'rejects midnight in a non-UTC offset',
            input: '2024-05-01T00:00:00.000-06:00',
            expect: false,
        },
        {
            it: 'rejects a lowercase zone designator',
            input: '2024-05-01T00:00:00.000z',
            expect: false,
        },
        {
            it: 'rejects a missing zone designator',
            input: '2024-05-01T00:00:00.000',
            expect: false,
        },
        {
            it: 'rejects surrounding whitespace',
            input: ' 2024-05-01T00:00:00.000Z ',
            expect: false,
        },
        {
            it: 'rejects an empty string',
            input: '',
            expect: false,
        },
        {
            it: 'rejects a non-iso string',
            input: 'May 1, 2024',
            expect: false,
        },
        {
            it: 'rejects a number',
            input: 5,
            expect: false,
        },
        {
            it: 'rejects a millisecond timestamp of midnight',
            input: Date.UTC(2024, 4, 1),
            expect: false,
        },
        {
            it: 'rejects a Date instance',
            input: new Date('2024-05-01T00:00:00.000Z'),
            expect: false,
        },
        {
            it: 'rejects undefined',
            input: undefined,
            expect: false,
        },
        {
            it: 'rejects null',
            input: null,
            expect: false,
        },
        {
            it: 'rejects an object',
            input: {},
            expect: false,
        },
    ]);
});

describe('dateOnlyUtcIsoStringShape', () => {
    itCases(
        (input: unknown) => checkValidShape(input, dateOnlyUtcIsoStringShape()),
        [
            {
                it: 'matches a date-only string',
                input: '2024-05-01T00:00:00.000Z',
                expect: true,
            },
            {
                it: 'rejects a UTC ISO string with a time of day',
                input: '2024-05-01T20:18:17.123Z',
                expect: false,
            },
            {
                it: 'rejects a non-string',
                input: 0,
                expect: false,
            },
        ],
    );

    it('has a valid default', () => {
        assert.isTrue(isValidDateOnlyUtcIsoString(dateOnlyUtcIsoStringShape().default));
    });
    it('accepts a nested value', () => {
        assert.isTrue(
            checkValidShape(
                {
                    day: '2024-05-01T00:00:00.000Z',
                },
                defineShape({
                    day: dateOnlyUtcIsoStringShape(),
                }),
            ),
        );
    });
    it('accepts a union nested value', () => {
        assert.isTrue(
            checkValidShape(
                {
                    day: undefined,
                },
                defineShape({
                    day: unionShape(undefined, null, dateOnlyUtcIsoStringShape()),
                }),
            ),
        );
    });
    it('rejects an invalid nested value', () => {
        assert.isFalse(
            checkValidShape(
                {
                    day: '2024-05-01T00:00:00.001Z',
                },
                defineShape({
                    day: dateOnlyUtcIsoStringShape(),
                }),
            ),
        );
    });
});

describe(toDateOnlyUtcIsoString.name, () => {
    itCases(toDateOnlyUtcIsoString, [
        {
            it: 'uses the date own timezone rather than UTC',
            input: lateFridayInDenver,
            expect: createDateOnly('2026-10-02T00:00:00.000Z'),
        },
        {
            it: 'drops the time of a UTC date',
            input: {
                year: 2026,
                month: 10,
                day: 2,
                hour: 13,
                minute: 45,
                second: 12,
                millisecond: 345,
                timezone: utcTimezone,
            },
            expect: createDateOnly('2026-10-02T00:00:00.000Z'),
        },
        {
            it: 'keeps a UTC date that is already midnight',
            input: {
                year: 2026,
                month: 10,
                day: 2,
                ...startOfDay,
                timezone: utcTimezone,
            },
            expect: createDateOnly('2026-10-02T00:00:00.000Z'),
        },
        {
            it: 'keeps the last millisecond of a day on that day',
            input: {
                year: 2026,
                month: 10,
                day: 2,
                hour: 23,
                minute: 59,
                second: 59,
                millisecond: 999,
                timezone: utcTimezone,
            },
            expect: createDateOnly('2026-10-02T00:00:00.000Z'),
        },
        {
            it: 'keeps the day in the furthest-ahead timezone, where UTC is still the previous day',
            input: {
                year: 2026,
                month: 1,
                day: 1,
                hour: 0,
                minute: 30,
                second: 0,
                millisecond: 0,
                timezone: TimezoneName['Pacific/Kiritimati'],
            },
            expect: createDateOnly('2026-01-01T00:00:00.000Z'),
        },
        {
            it: 'keeps the day in the furthest-behind timezone, where UTC is already the next day',
            input: {
                year: 2025,
                month: 12,
                day: 31,
                hour: 23,
                minute: 59,
                second: 0,
                millisecond: 0,
                timezone: TimezoneName['Pacific/Pago_Pago'],
            },
            expect: createDateOnly('2025-12-31T00:00:00.000Z'),
        },
        {
            it: 'keeps the day in a half-hour offset timezone',
            input: {
                year: 2026,
                month: 3,
                day: 1,
                hour: 2,
                minute: 0,
                second: 0,
                millisecond: 0,
                timezone: TimezoneName['Asia/Kolkata'],
            },
            expect: createDateOnly('2026-03-01T00:00:00.000Z'),
        },
        {
            it: 'keeps a leap day',
            input: {
                year: 2024,
                month: 2,
                day: 29,
                hour: 23,
                minute: 0,
                second: 0,
                millisecond: 0,
                timezone: TimezoneName['America/New_York'],
            },
            expect: createDateOnly('2024-02-29T00:00:00.000Z'),
        },
        {
            it: 'keeps the day on a spring-forward DST day',
            input: {
                year: 2026,
                month: 3,
                day: 8,
                hour: 23,
                minute: 0,
                second: 0,
                millisecond: 0,
                timezone: TimezoneName['America/New_York'],
            },
            expect: createDateOnly('2026-03-08T00:00:00.000Z'),
        },
        {
            it: 'keeps the day on a fall-back DST day',
            input: {
                year: 2026,
                month: 11,
                day: 1,
                hour: 1,
                minute: 30,
                second: 0,
                millisecond: 0,
                timezone: TimezoneName['America/New_York'],
            },
            expect: createDateOnly('2026-11-01T00:00:00.000Z'),
        },
        {
            it: 'keeps a day before the unix epoch',
            input: {
                year: 1969,
                month: 12,
                day: 31,
                hour: 18,
                minute: 0,
                second: 0,
                millisecond: 0,
                timezone: TimezoneName['America/New_York'],
            },
            expect: createDateOnly('1969-12-31T00:00:00.000Z'),
        },
    ]);

    it('always produces a valid date-only string', () => {
        edgeTimezones.forEach((timezone) => {
            assert.isTrue(isValidDateOnlyUtcIsoString(toDateOnlyUtcIsoString(lateFridayInDenver)));
            assert.isTrue(
                isValidDateOnlyUtcIsoString(
                    toDateOnlyUtcIsoString({
                        ...lateFridayInDenver,
                        timezone,
                    }),
                ),
            );
        });
    });
});

describe(dateOnlyUtcIsoStringToFullDate.name, () => {
    itCases(dateOnlyUtcIsoStringToFullDate, [
        {
            it: 'keeps the calendar day in the new timezone',
            inputs: [
                createDateOnly('2026-10-02T00:00:00.000Z'),
                TimezoneName['America/Denver'],
            ],
            expect: {
                year: 2026,
                month: 10,
                day: 2,
                ...startOfDay,
                timezone: TimezoneName['America/Denver'],
            },
        },
        {
            it: 'keeps the calendar day in UTC',
            inputs: [
                createDateOnly('2026-10-02T00:00:00.000Z'),
                utcTimezone,
            ],
            expect: {
                year: 2026,
                month: 10,
                day: 2,
                ...startOfDay,
                timezone: utcTimezone,
            },
        },
        {
            it: 'keeps the calendar day in the furthest-ahead timezone',
            inputs: [
                createDateOnly('2026-01-01T00:00:00.000Z'),
                TimezoneName['Pacific/Kiritimati'],
            ],
            expect: {
                year: 2026,
                month: 1,
                day: 1,
                ...startOfDay,
                timezone: TimezoneName['Pacific/Kiritimati'],
            },
        },
        {
            it: 'keeps the calendar day in the furthest-behind timezone',
            inputs: [
                createDateOnly('2025-12-31T00:00:00.000Z'),
                TimezoneName['Pacific/Pago_Pago'],
            ],
            expect: {
                year: 2025,
                month: 12,
                day: 31,
                ...startOfDay,
                timezone: TimezoneName['Pacific/Pago_Pago'],
            },
        },
        {
            it: 'keeps a leap day',
            inputs: [
                createDateOnly('2024-02-29T00:00:00.000Z'),
                TimezoneName['Asia/Kolkata'],
            ],
            expect: {
                year: 2024,
                month: 2,
                day: 29,
                ...startOfDay,
                timezone: TimezoneName['Asia/Kolkata'],
            },
        },
        {
            it: 'starts at midnight on a DST day whose transition is not at midnight',
            inputs: [
                createDateOnly('2026-03-08T00:00:00.000Z'),
                TimezoneName['America/New_York'],
            ],
            expect: {
                year: 2026,
                month: 3,
                day: 8,
                ...startOfDay,
                timezone: TimezoneName['America/New_York'],
            },
        },
        {
            it: 'starts after midnight on a day where midnight did not exist',
            inputs: [
                createDateOnly('2020-10-04T00:00:00.000Z'),
                TimezoneName['America/Asuncion'],
            ],
            expect: {
                year: 2020,
                month: 10,
                day: 4,
                ...startOfDay,
                hour: 1,
                timezone: TimezoneName['America/Asuncion'],
            },
        },
        {
            it: 'keeps a day before the unix epoch',
            inputs: [
                createDateOnly('1969-12-31T00:00:00.000Z'),
                TimezoneName['America/New_York'],
            ],
            expect: {
                year: 1969,
                month: 12,
                day: 31,
                ...startOfDay,
                timezone: TimezoneName['America/New_York'],
            },
        },
    ]);

    it('round trips through toDateOnlyUtcIsoString in every edge timezone', () => {
        const days = [
            '2020-10-04T00:00:00.000Z',
            '2024-02-29T00:00:00.000Z',
            '2025-12-31T00:00:00.000Z',
            '2026-01-01T00:00:00.000Z',
            '2026-03-08T00:00:00.000Z',
            '2026-11-01T00:00:00.000Z',
        ].map(createDateOnly);

        days.forEach((day) => {
            edgeTimezones.forEach((timezone) => {
                assert.strictEquals(
                    toDateOnlyUtcIsoString(dateOnlyUtcIsoStringToFullDate(day, timezone)),
                    day,
                );
            });
        });
    });
});

describe(diffDateOnlyDays.name, () => {
    itCases(diffDateOnlyDays, [
        {
            it: 'counts days forward',
            inputs: [
                {
                    start: createDateOnly('2026-10-02T00:00:00.000Z'),
                    end: createDateOnly('2026-10-05T00:00:00.000Z'),
                },
            ],
            expect: 3,
        },
        {
            it: 'counts days backward',
            inputs: [
                {
                    start: createDateOnly('2026-10-05T00:00:00.000Z'),
                    end: createDateOnly('2026-10-02T00:00:00.000Z'),
                },
            ],
            expect: -3,
        },
        {
            it: 'is zero for the same day',
            inputs: [
                {
                    start: createDateOnly('2026-10-02T00:00:00.000Z'),
                    end: createDateOnly('2026-10-02T00:00:00.000Z'),
                },
            ],
            expect: 0,
        },
        {
            it: 'counts one day across a month boundary',
            inputs: [
                {
                    start: createDateOnly('2026-09-30T00:00:00.000Z'),
                    end: createDateOnly('2026-10-01T00:00:00.000Z'),
                },
            ],
            expect: 1,
        },
        {
            it: 'counts one day across a year boundary',
            inputs: [
                {
                    start: createDateOnly('2025-12-31T00:00:00.000Z'),
                    end: createDateOnly('2026-01-01T00:00:00.000Z'),
                },
            ],
            expect: 1,
        },
        {
            it: 'counts the leap day',
            inputs: [
                {
                    start: createDateOnly('2024-02-28T00:00:00.000Z'),
                    end: createDateOnly('2024-03-01T00:00:00.000Z'),
                },
            ],
            expect: 2,
        },
        {
            it: 'has no leap day in a non-leap year',
            inputs: [
                {
                    start: createDateOnly('2023-02-28T00:00:00.000Z'),
                    end: createDateOnly('2023-03-01T00:00:00.000Z'),
                },
            ],
            expect: 1,
        },
        {
            it: 'counts a full leap year',
            inputs: [
                {
                    start: createDateOnly('2024-01-01T00:00:00.000Z'),
                    end: createDateOnly('2025-01-01T00:00:00.000Z'),
                },
            ],
            expect: 366,
        },
        {
            it: 'counts a full non-leap year',
            inputs: [
                {
                    start: createDateOnly('2025-01-01T00:00:00.000Z'),
                    end: createDateOnly('2026-01-01T00:00:00.000Z'),
                },
            ],
            expect: 365,
        },
        {
            it: 'counts a century that is not a leap year at its start',
            inputs: [
                {
                    start: createDateOnly('1900-02-28T00:00:00.000Z'),
                    end: createDateOnly('1900-03-01T00:00:00.000Z'),
                },
            ],
            expect: 1,
        },
        {
            it: 'counts a leap day in a year divisible by 400',
            inputs: [
                {
                    start: createDateOnly('2000-02-28T00:00:00.000Z'),
                    end: createDateOnly('2000-03-01T00:00:00.000Z'),
                },
            ],
            expect: 2,
        },
        {
            it: 'counts whole days across a US DST change',
            inputs: [
                {
                    start: createDateOnly('2026-03-07T00:00:00.000Z'),
                    end: createDateOnly('2026-03-09T00:00:00.000Z'),
                },
            ],
            expect: 2,
        },
        {
            it: 'counts across the unix epoch',
            inputs: [
                {
                    start: createDateOnly('1969-12-31T00:00:00.000Z'),
                    end: createDateOnly('1970-01-02T00:00:00.000Z'),
                },
            ],
            expect: 2,
        },
        {
            it: 'counts a long span',
            inputs: [
                {
                    start: createDateOnly('2000-01-01T00:00:00.000Z'),
                    end: createDateOnly('2100-01-01T00:00:00.000Z'),
                },
            ],
            expect: 36_525,
        },
        {
            it: 'stays whole with decimal rounding options',
            inputs: [
                {
                    start: createDateOnly('2026-10-02T00:00:00.000Z'),
                    end: createDateOnly('2026-10-05T00:00:00.000Z'),
                },
                {
                    decimalCount: 3,
                },
            ],
            expect: 3,
        },
    ]);
});

describe(getTodayDateOnlyUtcIsoString.name, () => {
    it('produces a valid date-only string in every edge timezone', () => {
        edgeTimezones.forEach((timezone) => {
            assert.isTrue(isValidDateOnlyUtcIsoString(getTodayDateOnlyUtcIsoString(timezone)));
        });
    });
    it('is one or two days ahead in the furthest-ahead timezone versus the furthest-behind', () => {
        const dayDiff = diffDateOnlyDays({
            start: getTodayDateOnlyUtcIsoString(TimezoneName['Pacific/Pago_Pago']),
            end: getTodayDateOnlyUtcIsoString(TimezoneName['Pacific/Kiritimati']),
        });
        assert.isTrue(dayDiff === 1 || dayDiff === 2);
    });
    it('matches the calendar day of now in the given timezone', () => {
        const before = toDateOnlyUtcIsoString(getNowFullDate(TimezoneName['America/New_York']));
        const today = getTodayDateOnlyUtcIsoString(TimezoneName['America/New_York']);
        const after = toDateOnlyUtcIsoString(getNowFullDate(TimezoneName['America/New_York']));

        assert.isTrue(today === before || today === after);
    });
});
