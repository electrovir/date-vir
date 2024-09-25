import {describe, itCases} from '@augment-vir/test';
import {Timezone} from '../timezone/timezones.js';
import {fullDateShape} from './full-date-shape.js';
import {toLuxonDateTime} from './luxon-date-time-conversion.js';

describe(toLuxonDateTime.name, () => {
    itCases(toLuxonDateTime, [
        {
            it: 'fails on invalid timezone',
            input: {
                ...fullDateShape.defaultValue,
                timezone: 'not a real time zone' as Timezone,
            },
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'fails on invalid dates',
            input: {
                ...fullDateShape.defaultValue,
                day: 321,
            },
            throws: {
                matchConstructor: Error,
            },
        },
    ]);
});
