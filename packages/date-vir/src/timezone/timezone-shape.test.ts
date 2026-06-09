import {describe, itCases} from '@augment-vir/test';
import {checkValidShape} from 'object-shape-tester';
import {timezoneShape} from './timezone-shape.js';

describe('timezoneShape', () => {
    itCases(
        (value: unknown) => checkValidShape(value, timezoneShape()),
        [
            {
                it: 'accepts a canonical timezone name',
                input: 'Australia/Melbourne',
                expect: true,
            },
            {
                it: 'accepts utc',
                input: 'UTC',
                expect: true,
            },
            {
                it: 'accepts a legacy IANA alias not in the typed list',
                input: 'America/Indianapolis',
                expect: true,
            },
            {
                it: 'rejects an invalid timezone string',
                input: 'not a real timezone',
                expect: false,
            },
            {
                it: 'rejects a non-string value',
                input: 5,
                expect: false,
            },
        ],
    );
});
