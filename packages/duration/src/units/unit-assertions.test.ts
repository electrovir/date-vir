import {AssertionError} from '@augment-vir/assert';
import {describe, type FunctionTestCase, itCases} from '@augment-vir/test';
import {
    assertWrapDayOfMonth,
    assertWrapDayOfWeekIndex,
    assertWrapHour,
    assertWrapMillisecond,
    assertWrapMinute,
    assertWrapMonthNumber,
    assertWrapQuarter,
    assertWrapSecond,
    isValidDayOfMonth,
    isValidDayOfWeekIndex,
    isValidHour,
    isValidMillisecond,
    isValidMinute,
    isValidMonthNumber,
    isValidQuarter,
    isValidSecond,
} from './unit-assertions.js';

const quarterTestCases = [
    {
        it: 'accepts the min quarter number',
        inputs: [1],
        expect: 1,
    },
    {
        it: 'accepts the max quarter number',
        inputs: [4],
        expect: 4,
    },
    {
        it: 'rejects below the min quarter number',
        inputs: [0],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid date quarter number',
        },
    },
    {
        it: 'rejects a non-integer',
        inputs: [2.5],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid date quarter number',
        },
    },
    {
        it: 'rejects above the max quarter number',
        inputs: [5],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid date quarter number',
        },
    },
] as const satisfies ReadonlyArray<FunctionTestCase<NoInfer<typeof assertWrapQuarter>>>;

describe(isValidQuarter.name, () => {
    itCases(
        isValidQuarter,
        quarterTestCases.map((testCase) => {
            return {
                it: testCase.it,
                input: testCase.inputs[0],
                expect: 'expect' in testCase,
            };
        }),
    );
});

describe(assertWrapQuarter.name, () => {
    itCases(assertWrapQuarter, quarterTestCases);
});

const monthTestCases = [
    {
        it: 'accepts the min month number',
        inputs: [1],
        expect: 1,
    },
    {
        it: 'accepts the max month number',
        inputs: [12],
        expect: 12,
    },
    {
        it: 'rejects below the min month number',
        inputs: [0],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid month number',
        },
    },
    {
        it: 'rejects a non-integer',
        inputs: [2.5],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid month number',
        },
    },
    {
        it: 'rejects above the max month number',
        inputs: [13],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid month number',
        },
    },
] as const satisfies ReadonlyArray<FunctionTestCase<NoInfer<typeof assertWrapMonthNumber>>>;

describe(isValidMonthNumber.name, () => {
    itCases(
        isValidMonthNumber,
        monthTestCases.map((testCase) => {
            return {
                it: testCase.it,
                input: testCase.inputs[0],
                expect: 'expect' in testCase,
            };
        }),
    );
});

describe(assertWrapMonthNumber.name, () => {
    itCases(assertWrapMonthNumber, monthTestCases);
});

const weekIndexTestCases = [
    {
        it: 'accepts the min day of week index',
        inputs: [0],
        expect: 0,
    },
    {
        it: 'accepts the max day of week index',
        inputs: [6],
        expect: 6,
    },
    {
        it: 'rejects below the min day of week index',
        inputs: [-1],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid day of week index',
        },
    },
    {
        it: 'rejects a non-integer',
        inputs: [2.5],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid day of week index',
        },
    },
    {
        it: 'rejects above the max day of week index',
        inputs: [7],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid day of week index',
        },
    },
] as const satisfies ReadonlyArray<FunctionTestCase<NoInfer<typeof assertWrapDayOfWeekIndex>>>;

describe(isValidDayOfWeekIndex.name, () => {
    itCases(
        isValidDayOfWeekIndex,
        weekIndexTestCases.map((testCase) => {
            return {
                it: testCase.it,
                input: testCase.inputs[0],
                expect: 'expect' in testCase,
            };
        }),
    );
});

describe(assertWrapDayOfWeekIndex.name, () => {
    itCases(assertWrapDayOfWeekIndex, weekIndexTestCases);
});

const dayOfMonthTestCases = [
    {
        it: 'accepts the min day of month',
        inputs: [1],
        expect: 1,
    },
    {
        it: 'accepts the max day of month',
        inputs: [31],
        expect: 31,
    },
    {
        it: 'rejects below the min day of month',
        inputs: [0],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid day of month',
        },
    },
    {
        it: 'rejects a non-integer',
        inputs: [2.5],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid day of month',
        },
    },
    {
        it: 'rejects above the max day of month',
        inputs: [32],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid day of month',
        },
    },
] as const satisfies ReadonlyArray<FunctionTestCase<NoInfer<typeof assertWrapDayOfMonth>>>;

describe(isValidDayOfMonth.name, () => {
    itCases(
        isValidDayOfMonth,
        dayOfMonthTestCases.map((testCase) => {
            return {
                it: testCase.it,
                input: testCase.inputs[0],
                expect: 'expect' in testCase,
            };
        }),
    );
});

describe(assertWrapDayOfMonth.name, () => {
    itCases(assertWrapDayOfMonth, dayOfMonthTestCases);
});

const hourTestCases = [
    {
        it: 'accepts the min hour',
        inputs: [0],
        expect: 0,
    },
    {
        it: 'accepts the max hour',
        inputs: [23],
        expect: 23,
    },
    {
        it: 'rejects below the min hour',
        inputs: [-1],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid hour',
        },
    },
    {
        it: 'rejects a non-integer',
        inputs: [2.5],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid hour',
        },
    },
    {
        it: 'rejects above the max hour',
        inputs: [24],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid hour',
        },
    },
] as const satisfies ReadonlyArray<FunctionTestCase<NoInfer<typeof assertWrapHour>>>;

describe(isValidHour.name, () => {
    itCases(
        isValidHour,
        hourTestCases.map((testCase) => {
            return {
                it: testCase.it,
                input: testCase.inputs[0],
                expect: 'expect' in testCase,
            };
        }),
    );
});

describe(assertWrapHour.name, () => {
    itCases(assertWrapHour, hourTestCases);
});

const minuteTestCases = [
    {
        it: 'accepts the min minute',
        inputs: [0],
        expect: 0,
    },
    {
        it: 'accepts the max minute',
        inputs: [59],
        expect: 59,
    },
    {
        it: 'rejects below the min minute',
        inputs: [-1],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid minute',
        },
    },
    {
        it: 'rejects a non-integer',
        inputs: [2.5],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid minute',
        },
    },
    {
        it: 'rejects above the max minute',
        inputs: [60],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid minute',
        },
    },
] as const satisfies ReadonlyArray<FunctionTestCase<NoInfer<typeof assertWrapMinute>>>;

describe(isValidMinute.name, () => {
    itCases(
        isValidMinute,
        minuteTestCases.map((testCase) => {
            return {
                it: testCase.it,
                input: testCase.inputs[0],
                expect: 'expect' in testCase,
            };
        }),
    );
});

describe(assertWrapMinute.name, () => {
    itCases(assertWrapMinute, minuteTestCases);
});

const secondTestCases = [
    {
        it: 'accepts the min second',
        inputs: [0],
        expect: 0,
    },
    {
        it: 'accepts the max second',
        inputs: [59],
        expect: 59,
    },
    {
        it: 'rejects below the min second',
        inputs: [-1],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid second',
        },
    },
    {
        it: 'rejects a non-integer',
        inputs: [2.5],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid second',
        },
    },
    {
        it: 'rejects above the max second',
        inputs: [60],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid second',
        },
    },
] as const satisfies ReadonlyArray<FunctionTestCase<NoInfer<typeof assertWrapSecond>>>;

describe(isValidSecond.name, () => {
    itCases(
        isValidSecond,
        secondTestCases.map((testCase) => {
            return {
                it: testCase.it,
                input: testCase.inputs[0],
                expect: 'expect' in testCase,
            };
        }),
    );
});

describe(assertWrapSecond.name, () => {
    itCases(assertWrapSecond, secondTestCases);
});

const millisecondTestCases = [
    {
        it: 'accepts the min millisecond',
        inputs: [0],
        expect: 0,
    },
    {
        it: 'accepts the max millisecond',
        inputs: [999],
        expect: 999,
    },
    {
        it: 'rejects below the min millisecond',
        inputs: [-1],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid millisecond',
        },
    },
    {
        it: 'rejects a non-integer',
        inputs: [2.5],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid millisecond',
        },
    },
    {
        it: 'rejects above the max millisecond',
        inputs: [1000],
        throws: {
            matchConstructor: AssertionError,
            matchMessage: 'not a valid millisecond',
        },
    },
] as const satisfies ReadonlyArray<FunctionTestCase<NoInfer<typeof assertWrapMillisecond>>>;

describe(isValidMillisecond.name, () => {
    itCases(
        isValidMillisecond,
        millisecondTestCases.map((testCase) => {
            return {
                it: testCase.it,
                input: testCase.inputs[0],
                expect: 'expect' in testCase,
            };
        }),
    );
});

describe(assertWrapMillisecond.name, () => {
    itCases(assertWrapMillisecond, millisecondTestCases);
});
