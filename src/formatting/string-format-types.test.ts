import {itCases} from '@augment-vir/browser-testing';
import {createFullDate} from '../full-date/create-full-date';
import {utcTimezone} from '../timezone/timezones';
import {isValidIsoString} from './string-format-types';
import {toIsoString} from './timestamp';

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
