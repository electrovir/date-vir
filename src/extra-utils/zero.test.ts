import {itCases} from '@augment-vir/browser-testing';
import {assertTypeOf} from 'run-time-assertions';
import {createFullDate} from '../full-date/create-full-date';
import {FullDate} from '../full-date/full-date-shape';
import {exampleFullDateUtc, exampleTimestamp} from '../full-date/full-date.test-helper';
import {Timezones, UtcTimezone, utcTimezone} from '../timezone/timezones';
import {getNowInUtcTimezone} from './now';
import {clearParts, clearTime, zeroTime} from './zero';

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
        assertTypeOf(clearParts(getNowInUtcTimezone(), ['day'])).toEqualTypeOf<
            FullDate<UtcTimezone>
        >();
        assertTypeOf(clearParts(getNowInUtcTimezone(), ['day'])).not.toEqualTypeOf<
            FullDate<Timezones['Africa/Abidjan']>
        >();

        const startDate: FullDate<UtcTimezone> = getNowInUtcTimezone() as any;

        assertTypeOf(clearParts(startDate, ['day'])).toEqualTypeOf<FullDate<UtcTimezone>>();
        assertTypeOf(clearParts(startDate, ['day'])).not.toEqualTypeOf<
            FullDate<Timezones['Africa/Abidjan']>
        >();
    });
});
