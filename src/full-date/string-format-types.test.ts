import {itCases} from '@augment-vir/browser-testing';
import {utcTimezone} from '../timezone/timezones';
import {createFullDate} from './create-full-date';
import {toIsoString} from './primitive-conversions';
import {isValidIsoString} from './string-format-types';

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
