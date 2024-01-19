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
