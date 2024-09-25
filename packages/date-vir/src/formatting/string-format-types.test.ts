import {describe, itCases} from '@augment-vir/test';
import {createFullDate} from '../full-date/create-full-date.js';
import {utcTimezone} from '../timezone/timezones.js';
import {isValidIsoString} from './string-format-types.js';
import {toUtcIsoString} from './timestamp.js';

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
            input: toUtcIsoString(createFullDate('March 1, 2023', utcTimezone)),
            expect: true,
        },
        {
            it: 'accepts the example',
            input: '2024-05-01T20:18:17.123Z',
            expect: true,
        },
    ]);
});
