import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import type {AnyDuration} from '@date-vir/duration';
import {roundDuration} from './round-duration.js';

describe(roundDuration.name, () => {
    it('has correct types', () => {
        assert.tsType(roundDuration({days: 5}, 4)).equals<{days: number}>();
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
