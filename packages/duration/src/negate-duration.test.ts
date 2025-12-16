import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {type AnyDuration} from './duration.js';
import {negateDuration} from './negate-duration.js';

describe(negateDuration.name, () => {
    it('preserves type', () => {
        const originalDuration = {
            minutes: 5,
            seconds: 2,
        } satisfies AnyDuration;

        const negatedDuration = negateDuration(originalDuration);

        assert.tsType(negatedDuration).equals(originalDuration);
    });
    itCases(negateDuration, [
        {
            it: 'negates a single property',
            input: {
                minutes: 1,
            },
            expect: {
                minutes: -1,
            },
        },
        {
            it: 'negates two properties',
            input: {
                minutes: 1,
                seconds: 52,
            },
            expect: {
                minutes: -1,
                seconds: -52,
            },
        },
        {
            it: 'handles undefined values',
            input: {
                minutes: 1,
                seconds: 52,
                hours: undefined,
            },
            expect: {
                hours: undefined,
                minutes: -1,
                seconds: -52,
            },
        },
        {
            it: 'negates a negative',
            input: {
                minutes: -32,
                seconds: 4,
            },
            expect: {
                minutes: 32,
                seconds: -4,
            },
        },
    ]);
});
