import {describe, itCases} from '@augment-vir/test';
import {checkValidShape} from 'object-shape-tester';
import {atLeastOneDurationShape} from './duration-shape.js';

describe('atLeastOneDurationShape', () => {
    itCases(
        (value: unknown) => checkValidShape(value, atLeastOneDurationShape()),
        [
            {
                it: 'accepts one duration unit',
                input: {
                    seconds: 1,
                },
                expect: true,
            },
            {
                it: 'accepts multiple duration units',
                input: {
                    days: 1,
                    hours: 2,
                },
                expect: true,
            },
            {
                it: 'rejects an empty duration',
                input: {},
                expect: false,
            },
            {
                it: 'rejects an invalid duration unit',
                input: {
                    decades: 1,
                },
                expect: false,
            },
        ],
    );
});
