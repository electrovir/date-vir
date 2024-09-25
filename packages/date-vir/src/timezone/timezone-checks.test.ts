import {check} from '@augment-vir/assert';
import {describe, FunctionTestCase, itCases} from '@augment-vir/test';
import {assertValidTimezone, isValidTimezone} from './timezone-checks.js';

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
