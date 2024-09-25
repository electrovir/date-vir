import {describe, it, itCases} from '@augment-vir/test';
import {ShapeMismatchError} from 'object-shape-tester';

import {assert} from '@augment-vir/assert';
import {Timezone} from '../timezone/timezone-names.js';
import {UtcTimezone, utcTimezone} from '../timezone/timezones.js';
import {FullDate, fullDateShape} from './full-date-shape.js';
import {exampleFullDateUtc, nonUtcTimezone} from './full-date.mock.js';
import {assertIsValidFullDate, hasTimezone} from './is-valid-full-date.js';

describe(assertIsValidFullDate.name, () => {
    itCases(
        /** Wrap the function just so we get type completion since the function accepts any inputs. */
        (input: FullDate) => assertIsValidFullDate(input),
        [
            {
                it: 'accepts the shape default value',
                input: fullDateShape.defaultValue,
                throws: undefined,
            },
            {
                it: 'rejects an invalid timezone',
                input: {
                    ...fullDateShape.defaultValue,
                    timezone: 'not a real timezone' as Timezone,
                },
                throws: {
                    matchMessage: 'is not a valid time zone',
                },
            },
            {
                it: 'rejects a missing timezone object',
                input: {
                    ...fullDateShape.defaultValue,
                    timezone: undefined as unknown as Timezone,
                },
                throws: {
                    matchConstructor: ShapeMismatchError,
                },
            },
            {
                it: 'rejects an invalid hour',
                input: {
                    ...fullDateShape.defaultValue,
                    hour: 24,
                },
                throws: {
                    matchConstructor: Error,
                },
            },
            {
                it: 'rejects an invalid minute',
                input: {
                    ...fullDateShape.defaultValue,
                    minute: 60,
                },
                throws: {
                    matchConstructor: Error,
                },
            },
            {
                it: 'rejects an invalid second',
                input: {
                    ...fullDateShape.defaultValue,
                    second: 60,
                },
                throws: {
                    matchConstructor: Error,
                },
            },
            {
                it: 'rejects an invalid millisecond',
                input: {
                    ...fullDateShape.defaultValue,
                    millisecond: 1001,
                },
                throws: {
                    matchConstructor: Error,
                },
            },
            {
                it: 'rejects an invalid month',
                input: {
                    ...fullDateShape.defaultValue,
                    month: 0,
                },
                throws: {
                    matchConstructor: Error,
                },
            },
            {
                it: 'rejects an invalid day',
                input: {
                    ...fullDateShape.defaultValue,
                    day: 42,
                },
                throws: {
                    matchConstructor: Error,
                },
            },
            {
                it: 'rejects February 30',
                input: {
                    ...fullDateShape.defaultValue,
                    month: 2,
                    day: 30,
                },
                throws: {
                    matchConstructor: Error,
                },
            },
        ],
    );
});

describe(hasTimezone.name, () => {
    itCases(hasTimezone, [
        {
            it: 'passes when the timezone matches',
            inputs: [
                exampleFullDateUtc,
                exampleFullDateUtc.timezone,
            ],
            expect: true,
        },
        {
            it: 'fails when the timezone does not match',
            inputs: [
                exampleFullDateUtc,
                nonUtcTimezone,
            ],
            expect: false,
        },
    ]);

    it('type guards the input', () => {
        const vagueTimezone = exampleFullDateUtc as FullDate;

        assert.tsType(vagueTimezone).notEquals<FullDate<UtcTimezone>>();

        if (hasTimezone(vagueTimezone, utcTimezone)) {
            assert.tsType(vagueTimezone).equals<FullDate<UtcTimezone>>();
        }
    });
});
