import {describe, itCases} from '@augment-vir/test';
import {createFullDate} from '../full-date/create-full-date.js';
import {utcTimezone} from '../timezone/timezones.js';
import {isValidIsoString} from './string-format-types.js';
import {toIsoString} from './timestamp.js';

describe(isValidIsoString.name, () => {
    itCases(isValidIsoString, [
        {
            it: 'fails on empty string',
            input: '',
            expect: false,
        },
        {
            it: 'fails on non-iso string',
            input: 'March 1, 2023',
            expect: false,
        },
        {
            it: 'succeeds on iso string',
            input: toIsoString(createFullDate('March 1, 2023', utcTimezone)),
            expect: false,
        },
    ]);
});
