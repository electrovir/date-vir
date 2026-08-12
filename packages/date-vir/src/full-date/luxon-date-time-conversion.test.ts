import {applyBrand} from '@augment-vir/common';
import {describe, itCases} from '@augment-vir/test';
import {type TimezoneString} from '../timezone/timezones.js';
import {fullDateShape} from './full-date-shape.js';
import {toLuxonDateTime} from './luxon-date-time-conversion.js';

describe(toLuxonDateTime.name, () => {
    itCases(toLuxonDateTime, [
        {
            it: 'fails on invalid timezone',
            input: {
                ...fullDateShape.default,
                timezone: applyBrand<TimezoneString>('not a real time zone'),
            },
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'fails on invalid dates',
            input: {
                ...fullDateShape.default,
                // @ts-expect-error: intentionally incorrect day
                day: 321,
            },
            throws: {
                matchConstructor: Error,
            },
        },
    ]);
});
