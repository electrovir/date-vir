import {itCases} from '@augment-vir/browser-testing';
import {Timezone} from '../timezone/timezone-names';
import {fullDateShape} from './full-date-shape';
import {toLuxonDateTime} from './luxon-date-time-conversion';

describe(toLuxonDateTime.name, () => {
    itCases(toLuxonDateTime, [
        {
            it: 'fails on invalid timezone',
            input: {
                ...fullDateShape.defaultValue,
                timezone: 'not a real time zone' as Timezone,
            },
            throws: Error,
        },
        {
            it: 'fails on invalid dates',
            input: {
                ...fullDateShape.defaultValue,
                day: 321,
            },
            throws: Error,
        },
    ]);
});
