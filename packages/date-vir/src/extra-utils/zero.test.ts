import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {createFullDate} from '../full-date/create-full-date.js';
import {FullDate} from '../full-date/full-date-shape.js';
import {exampleFullDateUtc, exampleTimestamp} from '../full-date/full-date.mock.js';
import {UtcTimezone, utcTimezone} from '../timezone/timezones.js';
import {getNowInUtcTimezone} from './now.js';
import {clearParts, clearTime, zeroTime} from './zero.js';

describe(clearTime.name, () => {
    itCases(clearTime, [
        {
            it: 'clears a basic utc date',
            input: createFullDate(exampleTimestamp, utcTimezone),
            expect: {
                ...exampleFullDateUtc,

                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
            },
        },
        {
            it: 'matches zero time',
            input: createFullDate(exampleTimestamp, utcTimezone),
            expect: {
                ...exampleFullDateUtc,

                ...zeroTime,
            },
        },
    ]);
});

describe(clearParts.name, () => {
    itCases(clearParts, [
        {
            it: 'does not clear a month to 0',
            inputs: [
                createFullDate(exampleTimestamp, utcTimezone),
                ['month'],
            ],
            expect: {
                ...exampleFullDateUtc,
                month: 1,
            },
        },
        {
            it: 'does not clear a day to 0',
            inputs: [
                createFullDate(exampleTimestamp, utcTimezone),
                ['day'],
            ],
            expect: {
                ...exampleFullDateUtc,
                day: 1,
            },
        },
        {
            it: 'clears multiple parts',
            inputs: [
                createFullDate(exampleTimestamp, utcTimezone),
                [
                    'day',
                    'second',
                    'year',
                ],
            ],
            expect: {
                ...exampleFullDateUtc,
                day: 1,
                second: 0,
                year: 0,
            },
        },
    ]);

    it('preserves the input timezone', () => {
        assert.tsType(clearParts(getNowInUtcTimezone(), ['day'])).equals<FullDate<UtcTimezone>>();
        assert.tsType(clearParts(getNowInUtcTimezone(), ['day'])).notEquals<FullDate>();

        const startDate: FullDate<UtcTimezone> = getNowInUtcTimezone() as any;

        assert.tsType(clearParts(startDate, ['day'])).equals<FullDate<UtcTimezone>>();
        assert.tsType(clearParts(startDate, ['day'])).notEquals<FullDate>();
    });
});
