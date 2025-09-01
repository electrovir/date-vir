import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {checkValidShape, defineShape, unionShape} from 'object-shape-tester';
import {getNowInIsoString} from '../extra-utils/now.js';
import {createFullDate} from '../full-date/create-full-date.js';
import {utcTimezone} from '../timezone/timezones.js';
import {isValidIsoString, utcIsoStringShape} from './string-format-types.js';
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

describe('utcIsoStringShape', () => {
    itCases(
        (input: unknown) => checkValidShape(input, utcIsoStringShape()),
        [
            {
                it: 'matches a valid UTC ISO string',
                input: getNowInIsoString(),
                expect: true,
            },
            {
                it: 'rejects an invalid UTC ISO string',
                input: 'lol',
                expect: false,
            },
        ],
    );

    it('accepts a nested value', () => {
        assert.isTrue(
            checkValidShape(
                {
                    now: new Date().toISOString(),
                },
                defineShape({
                    now: utcIsoStringShape(),
                }),
            ),
        );
    });
    it('accepts a union nested value', () => {
        assert.isTrue(
            checkValidShape(
                {
                    now: new Date().toISOString(),
                },
                defineShape({
                    now: unionShape(undefined, null, utcIsoStringShape()),
                }),
            ),
        );
    });
});
