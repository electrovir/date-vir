import {itCases} from '@augment-vir/browser-testing';
import {ShapeMismatchError} from 'object-shape-tester';
import {Timezone} from '../timezone/timezone-names';
import {FullDate, fullDateShape} from './full-date-shape';
import {assertIsValidFullDate} from './is-valid-full-date';

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
                throws: 'is not a valid time zone',
            },
            {
                it: 'rejects a missing timezone object',
                input: {
                    ...fullDateShape.defaultValue,
                    timezone: undefined as unknown as Timezone,
                },
                throws: ShapeMismatchError,
            },
            {
                it: 'rejects an invalid hour',
                input: {
                    ...fullDateShape.defaultValue,
                    hour: 24,
                },
                throws: Error,
            },
            {
                it: 'rejects an invalid minute',
                input: {
                    ...fullDateShape.defaultValue,
                    minute: 60,
                },
                throws: Error,
            },
            {
                it: 'rejects an invalid second',
                input: {
                    ...fullDateShape.defaultValue,
                    second: 60,
                },
                throws: Error,
            },
            {
                it: 'rejects an invalid millisecond',
                input: {
                    ...fullDateShape.defaultValue,
                    millisecond: 1001,
                },
                throws: Error,
            },
            {
                it: 'rejects an invalid month',
                input: {
                    ...fullDateShape.defaultValue,
                    month: 0,
                },
                throws: Error,
            },
            {
                it: 'rejects an invalid day',
                input: {
                    ...fullDateShape.defaultValue,
                    day: 42,
                },
                throws: Error,
            },
            {
                it: 'rejects February 30',
                input: {
                    ...fullDateShape.defaultValue,
                    month: 2,
                    day: 30,
                },
                throws: Error,
            },
        ],
    );
});
