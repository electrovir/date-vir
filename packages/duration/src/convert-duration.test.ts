import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {convertDuration} from './convert-duration.js';
import {DurationUnit} from './duration-unit.js';
import {AtLeastOneDuration} from './duration.js';

describe(convertDuration.name, () => {
    it('has proper types', () => {
        assert.tsType(convertDuration({days: 54.35}, DurationUnit.Minutes)).equals<{
            minutes: number;
        }>();
    });

    itCases(convertDuration, [
        {
            it: 'converts to milliseconds',
            inputs: [
                {minutes: 32, seconds: 2},
                DurationUnit.Milliseconds,
            ],
            expect: {milliseconds: 1_922_000},
        },
        {
            it: 'works with a negative duration',
            inputs: [
                {minutes: -32, seconds: -2},
                DurationUnit.Milliseconds,
            ],
            expect: {milliseconds: -1_922_000},
        },
        {
            it: 'works with negative and positive durations',
            inputs: [
                {minutes: -32, seconds: 2},
                DurationUnit.Milliseconds,
            ],
            expect: {milliseconds: -1_918_000},
        },
        {
            it: 'converts to seconds',
            inputs: [
                {minutes: 32, seconds: 2},
                DurationUnit.Seconds,
            ],
            expect: {seconds: 1922},
        },
        {
            it: 'handles an empty object',
            inputs: [
                {} as AtLeastOneDuration,
                DurationUnit.Seconds,
            ],
            expect: {seconds: 0},
        },
        {
            it: 'handles infinity',
            inputs: [
                {seconds: Infinity},
                DurationUnit.Milliseconds,
            ],
            expect: {milliseconds: Infinity},
        },
        {
            it: 'handles negative infinity',
            inputs: [
                {seconds: -Infinity},
                DurationUnit.Milliseconds,
            ],
            expect: {milliseconds: -Infinity},
        },
        {
            it: 'handles multiple infinities',
            inputs: [
                {minutes: Infinity, seconds: Infinity},
                DurationUnit.Milliseconds,
            ],
            expect: {milliseconds: Infinity},
        },
    ]);
});
