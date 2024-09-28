import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {AnyDuration, selectAllDurationUnits} from '@date-vir/duration';
import {convertDuration, roundDuration} from './convert-duration.js';
import {AtLeastOneDuration} from './duration.js';

describe(convertDuration.name, () => {
    it('has proper types', () => {
        assert.tsType(convertDuration({days: 54.35}, {minutes: true, hours: true})).equals<{
            hours: number;
            minutes: number;
        }>();
    });

    itCases(convertDuration, [
        {
            it: 'expands milliseconds to seconds',
            inputs: [
                {milliseconds: 1000},
                {seconds: true},
            ],
            expect: {
                seconds: 1,
            },
        },
        {
            it: 'does not expand',
            inputs: [
                {
                    months: -2,
                },
                selectAllDurationUnits,
            ],
            expect: {
                years: 0,
                quarters: 0,
                months: -2,
                weeks: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0,
            },
        },
        {
            it: 'does not flip signs',
            inputs: [
                {
                    months: -0.99,
                },
                selectAllDurationUnits,
                {
                    roundToDigits: 1,
                },
            ],
            expect: {
                years: 0,
                quarters: 0,
                months: -1,
                weeks: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0,
            },
        },
        {
            it: 'expands many seconds to specific units',
            inputs: [
                {seconds: 5_356_800},
                {
                    weeks: true,
                    seconds: true,
                },
            ],
            expect: {
                weeks: 8,
                seconds: 518_400,
            },
        },
        {
            it: 'if nothing is selected then nothing is returned',
            inputs: [
                {seconds: 5_356_800},
                {},
            ],
            expect: {},
        },
        {
            it: 'converts to milliseconds',
            inputs: [
                {minutes: 32, seconds: 2},
                {milliseconds: true},
            ],
            expect: {milliseconds: 1_922_000},
        },
        {
            it: 'works with a negative duration',
            inputs: [
                {minutes: -32, seconds: -2},
                {milliseconds: true},
            ],
            expect: {milliseconds: -1_922_000},
        },
        {
            it: 'works with negative and positive durations',
            inputs: [
                {minutes: -32, seconds: 2},
                {milliseconds: true},
            ],
            expect: {milliseconds: -1_918_000},
        },
        {
            it: 'converts to seconds',
            inputs: [
                {minutes: 32, seconds: 2},
                {seconds: true},
            ],
            expect: {seconds: 1922},
        },
        {
            it: 'handles an empty object',
            inputs: [
                {} as AtLeastOneDuration,
                {seconds: true},
            ],
            expect: {seconds: 0},
        },
        {
            it: 'handles infinity',
            inputs: [
                {seconds: Infinity},
                {milliseconds: true},
            ],
            expect: {milliseconds: Infinity},
        },
        {
            it: 'handles negative infinity',
            inputs: [
                {seconds: -Infinity},
                {milliseconds: true},
            ],
            expect: {milliseconds: -Infinity},
        },
        {
            it: 'handles multiple infinities',
            inputs: [
                {minutes: Infinity, seconds: Infinity},
                {milliseconds: true},
            ],
            expect: {milliseconds: Infinity},
        },
    ]);
});

describe(roundDuration.name, () => {
    it('has correct types', () => {
        assert.tsType(roundDuration({days: 5}, {roundToDigits: 4})).equals<{days: number}>();
    });

    const durationWithDecimals: AnyDuration = {
        days: 5.342_132_1,
        hours: 3.124_134_5,
        milliseconds: 9.758_923,
    };

    itCases(roundDuration, [
        {
            it: 'rounds to zero decimal places',
            inputs: [
                durationWithDecimals,
                {roundToDigits: 0},
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
                {roundToDigits: 3},
            ],
            expect: {
                days: 5.342,
                hours: 3.124,
                milliseconds: 9.759,
            },
        },
    ]);
});
