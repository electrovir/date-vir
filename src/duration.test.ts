import {assertTypeOf} from 'run-time-assertions';
import {AnyDuration, Duration, DurationUnit, roundDuration} from './duration';

describe('Duration', () => {
    it('picks a single unit', () => {
        assertTypeOf<Duration<DurationUnit.Days>>().toEqualTypeOf<{days: number}>();
    });

    it('picks multiple units', () => {
        assertTypeOf<Duration<DurationUnit.Days | DurationUnit.Weeks>>().toEqualTypeOf<{
            days: number;
            weeks: number;
        }>();
    });

    it('allows AllDuration', () => {
        assertTypeOf<Duration<unknown>>().toEqualTypeOf<AnyDuration>();
    });
});

describe('DurationUnit', () => {
    it('has all props of AnyDuration', () => {
        assertTypeOf<`${DurationUnit}`>().toEqualTypeOf<keyof AnyDuration>();
        assertTypeOf<keyof AnyDuration>().toEqualTypeOf<`${DurationUnit}`>();
    });
});

describe(roundDuration.name, () => {
    it('has correct types', () => {
        assertTypeOf(roundDuration({days: 5}, 4)).toEqualTypeOf<{days: number}>();
    });
});
