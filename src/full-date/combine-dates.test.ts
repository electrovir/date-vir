import {itCases} from '@augment-vir/browser-testing';
import {userTimezone, utcTimezone} from '../timezone/timezones';
import {combineDateParts} from './combine-dates';
import {FullDatePartEnum} from './full-date-shape';
import {exampleFullDate} from './full-date.test-helper';

describe(combineDateParts.name, () => {
    itCases(combineDateParts, [
        {
            it: 'does not modify parts that are the same',
            input: {
                [FullDatePartEnum.Date]: exampleFullDate,
                [FullDatePartEnum.Time]: exampleFullDate,
            },
            expect: exampleFullDate,
        },
        {
            it: 'merges two date parts',
            input: {
                [FullDatePartEnum.Time]: {
                    hour: 12,
                    minute: 32,
                    second: 52,
                    millisecond: 100,
                    timezone: userTimezone,
                },
                [FullDatePartEnum.Date]: {
                    year: 2023,
                    month: 8,
                    day: 9,
                    timezone: utcTimezone,
                },
            },
            expect: {
                hour: 12,
                minute: 32,
                second: 52,
                millisecond: 100,
                year: 2023,
                month: 8,
                day: 9,
                timezone: userTimezone,
            },
        },
        {
            it: 'merges two different FullDate instances',
            input: {
                [FullDatePartEnum.Time]: {
                    hour: 12,
                    minute: 32,
                    second: 52,
                    millisecond: 100,

                    year: 2023,
                    month: 8,
                    day: 9,
                    timezone: userTimezone,
                },
                [FullDatePartEnum.Date]: {
                    hour: 7,
                    minute: 56,
                    second: 46,
                    millisecond: 987,

                    year: 2022,
                    month: 1,
                    day: 21,
                    timezone: utcTimezone,
                },
            },
            expect: {
                hour: 12,
                minute: 32,
                second: 52,
                millisecond: 100,
                year: 2022,
                month: 1,
                day: 21,
                timezone: userTimezone,
            },
        },
    ]);
});
