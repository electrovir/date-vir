import {assert, AssertionError, check} from '@augment-vir/assert';
import {applyBrand, createArray} from '@augment-vir/common';
import {describe, type FunctionTestCase, it, itCases} from '@augment-vir/test';
import {Info} from 'luxon';
import {
    assertValidTimezone,
    assertWrapValidTimezone,
    checkWrapValidTimezone,
    isValidTimezone,
} from './timezone-checks.js';
import {type TimezoneString} from './timezones.js';

const validTimezoneTestCases = [
    {
        it: 'wraps a valid timezone name string',
        inputs: ['Australia/Melbourne'],
        expect: 'Australia/Melbourne',
    },
    {
        it: 'wraps a valid legacy timezone alias',
        inputs: ['America/Indianapolis'],
        expect: applyBrand<TimezoneString>('America/Indianapolis'),
    },
    {
        it: 'rejects an invalid timezone',
        inputs: ['not a timezone'],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid time zone',
        },
    },
] as const satisfies ReadonlyArray<FunctionTestCase<NoInfer<typeof assertWrapValidTimezone>>>;

const testCases: ReadonlyArray<FunctionTestCase<typeof assertValidTimezone>> = [
    {
        it: 'passes a valid timezone name string',
        inputs: ['Australia/Melbourne'],
        throws: undefined,
    },
    {
        it: 'passes uppercase utc',
        inputs: ['UTC'],
        throws: undefined,
    },
    {
        it: 'fails an invalid timezone',
        inputs: ['not a timezone'],
        throws: {
            matchConstructor: Error,
        },
    },
];

describe(assertValidTimezone.name, () => {
    itCases(assertValidTimezone, testCases);
});

describe(assertWrapValidTimezone.name, () => {
    itCases(assertWrapValidTimezone, validTimezoneTestCases);
});

describe(checkWrapValidTimezone.name, () => {
    itCases(
        checkWrapValidTimezone,
        validTimezoneTestCases.map((testCase) => {
            return {
                it: testCase.it,
                input: testCase.inputs[0],
                expect: 'expect' in testCase ? testCase.expect : undefined,
            };
        }),
    );
});

describe(isValidTimezone.name, () => {
    itCases(
        isValidTimezone,
        testCases.map((testCase) => {
            return {
                it: testCase.it,
                input: testCase.inputs[0],
                expect: !(check.hasKey(testCase, 'throws') && testCase.throws),
            };
        }),
    );
});

describe('IANA timezone validity cache', () => {
    it('evicts the oldest entry when full', () => {
        const originalIsValidIanaZone = Info.isValidIANAZone;
        const cacheKeyPrefix = `DateVirCacheTest/${crypto.randomUUID()}`;
        let validationCallCount = 0;
        Info.isValidIANAZone = () => {
            validationCallCount += 1;
            return false;
        };

        try {
            assert.isFalse(isValidTimezone(`${cacheKeyPrefix}/oldest`));
            createArray(1000, (index) => `${cacheKeyPrefix}/${index}`).forEach((raw) => {
                assert.isFalse(isValidTimezone(raw));
            });
            assert.isFalse(isValidTimezone(`${cacheKeyPrefix}/oldest`));
            assert.strictEquals(validationCallCount, 1002);
        } finally {
            Info.isValidIANAZone = originalIsValidIanaZone;
        }
    });
});
