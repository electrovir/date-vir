import {FunctionTestCase, itCases} from '@augment-vir/browser-testing';
import {typedHasProperty} from '@augment-vir/common';
import {assertValidTimezone, isValidTimezone} from './timezone-checks';

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
        throws: Error,
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
