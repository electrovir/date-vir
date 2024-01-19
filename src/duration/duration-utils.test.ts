import {itCases} from '@augment-vir/browser-testing';
import {assertTypeOf} from 'run-time-assertions';
import {AnyDuration, AtLeastOneDuration} from './duration';
import {DurationUnit} from './duration-unit';
import {convertDuration, roundDuration} from './duration-utils';

describe(roundDuration.name, () => {
    it('has correct types', () => {
        assertTypeOf(roundDuration({days: 5}, 4)).toEqualTypeOf<{days: number}>();
    });

    const durationWithDecimals: AnyDuration = {
        days: 5.3421321,
        hours: 3.1241345,
        milliseconds: 9.758923,
    };

    itCases(roundDuration, [
        {
            it: 'rounds to zero decimal places',
            inputs: [
                durationWithDecimals,
                0,
            ],
            expect: {
                days: 5,
                hours: 3,
                milliseconds: 10,
            },
        },
        {
            it: 'rounds to 3 decimal places',
            inputs: [
                durationWithDecimals,
                3,
            ],
            expect: {
                days: 5.342,
                hours: 3.124,
                milliseconds: 9.759,
            },
        },
    ]);
});

describe(convertDuration.name, () => {
    it('has proper types', () => {
        assertTypeOf(convertDuration({days: 54.35}, DurationUnit.Minutes)).toEqualTypeOf<{
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
            expect: {seconds: 1_922},
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
