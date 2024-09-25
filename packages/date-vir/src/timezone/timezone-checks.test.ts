import {typedHasProperty} from '@augment-vir/common';
import {describe, FunctionTestCase, itCases} from '@augment-vir/test';
import {assertValidTimezone, isValidTimezone} from './timezone-checks.js';

const testCases: ReadonlyArray<FunctionTestCase<typeof assertValidTimezone>> = [
    {
        it: 'passes a valid timezone name string',
        input: 'Australia/Melbourne',
        throws: undefined,
    },
    {
        it: 'passes uppercase utc',
        input: 'UTC',
        throws: undefined,
    },
    {
        it: 'fails an invalid timezone',
        input: 'not a timezone',
        throws: {
            matchConstructor: Error,
        },
    },
];

describe(assertValidTimezone.name, () => {
    itCases(assertValidTimezone, testCases);
});

describe(isValidTimezone.name, () => {
    itCases(
        isValidTimezone,
        testCases.map((testCase) => {
            return {
                ...testCase,
                throws: undefined,
                expect: !(typedHasProperty(testCase, 'throws') && testCase.throws),
            };
        }),
    );
});
