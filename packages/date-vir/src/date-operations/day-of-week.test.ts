import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {DayOfWeekName, dayOfWeekNameOrder, type DayOfWeekIndex} from '@date-vir/duration';
import {toNewTimezone} from '../full-date/create-full-date.js';
import {type FullDate} from '../full-date/full-date-shape.js';
import {exampleFullDateUtc} from '../full-date/full-date.mock.js';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion.js';
import {TimezoneName, utcTimezone} from '../timezone/timezones.js';
import {calculateRelativeDate} from './calculate-relative-date.js';
import {getDayOfWeek} from './day-of-week.js';

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

describe(getDayOfWeek.name, () => {
    itCases(getDayOfWeek, [
        {
            it: 'gets the day of a UTC date',
            input: exampleFullDateUtc,
            expect: DayOfWeekName.Monday,
        },
        {
            it: 'uses the date own timezone rather than UTC',
            input: lateFridayInDenver,
            expect: DayOfWeekName.Friday,
        },
        {
            it: 'gets a different day once converted to UTC',
            input: toNewTimezone(lateFridayInDenver, utcTimezone),
            expect: DayOfWeekName.Saturday,
        },
        {
            it: 'uses the date own timezone ahead of UTC',
            input: {
                year: 2026,
                month: 10,
                day: 4,

                hour: 0,
                minute: 30,
                second: 0,
                millisecond: 0,

                timezone: TimezoneName['Asia/Tokyo'],
            },
            /** This is 2026-10-03T15:30Z, a Saturday. */
            expect: DayOfWeekName.Sunday,
        },
        {
            it: 'handles a leap day',
            input: {
                ...exampleFullDateUtc,
                year: 2024,
                month: 2,
                day: 29,
            },
            expect: DayOfWeekName.Thursday,
        },
        {
            it: 'does not map two digit years into the 1900s',
            input: {
                ...exampleFullDateUtc,
                year: 1,
                month: 1,
                day: 1,
            },
            expect: DayOfWeekName.Monday,
        },
    ]);

    it('matches Luxon for every day of a week in many timezones', () => {
        const timezones = [
            utcTimezone,
            TimezoneName['America/Denver'],
            TimezoneName['Asia/Tokyo'],
            TimezoneName['Pacific/Kiritimati'],
            TimezoneName['Pacific/Pago_Pago'],
        ];

        timezones.forEach((timezone) => {
            const start = {
                ...lateFridayInDenver,
                timezone,
            };

            dayOfWeekNameOrder.forEach((_name, dayOffset) => {
                const date = calculateRelativeDate(start, {
                    days: dayOffset,
                });

                assert.strictEquals(
                    getDayOfWeek(date),
                    dayOfWeekNameOrder[(toLuxonDateTime(date).weekday % 7) as DayOfWeekIndex],
                );
            });
        });
    });
});
