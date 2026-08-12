import {assert} from '@augment-vir/assert';
import {applyBrand} from '@augment-vir/common';
import {describe, it, itCases} from '@augment-vir/test';
import {ShapeMismatchError} from 'object-shape-tester';
import {type TimezoneString, type UtcTimezone, utcTimezone} from '../timezone/timezones.js';
import {type FullDate, fullDateShape} from './full-date-shape.js';
import {exampleFullDateUtc, nonUtcTimezone} from './full-date.mock.js';
import {assertValidFullDate, hasTimezone} from './is-valid-full-date.js';

describe(assertValidFullDate.name, () => {
    itCases(
        /** Wrap the function just so we get type completion since the function accepts any inputs. */
        (input: FullDate) => assertValidFullDate(input),
        [
            {
                it: 'accepts the shape default value',
                input: fullDateShape.default,
                throws: undefined,
            },
            {
                it: 'rejects an invalid timezone',
                input: {
                    ...fullDateShape.default,
                    timezone: applyBrand<TimezoneString>('not a real timezone'),
                },
                throws: {
                    matchConstructor: ShapeMismatchError,
                },
            },
            {
                it: 'accepts a legacy IANA timezone alias',
                input: {
                    ...fullDateShape.default,
                    timezone: applyBrand<TimezoneString>('America/Indianapolis'),
                },
                throws: undefined,
            },
            {
                it: 'rejects a missing timezone object',
                input: {
                    ...fullDateShape.default,
                    // @ts-expect-error: intentionally missing timezone
                    timezone: undefined,
                },
                throws: {
                    matchConstructor: ShapeMismatchError,
                },
            },
            {
                it: 'rejects an invalid hour',
                input: {
                    ...fullDateShape.default,
                    // @ts-expect-error: intentionally incorrect hour
                    hour: 24,
                },
                throws: {
                    matchConstructor: Error,
                },
            },
            {
                it: 'rejects an invalid minute',
                input: {
                    ...fullDateShape.default,
                    // @ts-expect-error: intentionally incorrect minute
                    minute: 60,
                },
                throws: {
                    matchConstructor: Error,
                },
            },
            {
                it: 'rejects an invalid second',
                input: {
                    ...fullDateShape.default,
                    // @ts-expect-error: intentionally incorrect second
                    second: 60,
                },
                throws: {
                    matchConstructor: Error,
                },
            },
            {
                it: 'rejects an invalid millisecond',
                input: {
                    ...fullDateShape.default,
                    millisecond: 1001,
                },
                throws: {
                    matchConstructor: Error,
                },
            },
            {
                it: 'rejects an invalid month',
                input: {
                    ...fullDateShape.default,
                    // @ts-expect-error: intentionally incorrect month
                    month: 0,
                },
                throws: {
                    matchConstructor: Error,
                },
            },
            {
                it: 'rejects an invalid day',
                input: {
                    ...fullDateShape.default,
                    // @ts-expect-error: intentionally incorrect day
                    day: 42,
                },
                throws: {
                    matchConstructor: Error,
                },
            },
            {
                it: 'rejects February 30',
                input: {
                    ...fullDateShape.default,
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
