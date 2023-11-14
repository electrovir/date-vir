import {assertTypeOf} from 'run-time-assertions';
import {AnyDuration, Duration, DurationUnit} from './duration';

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

    it('defaults to AnyDuration', () => {
        assertTypeOf<Duration>().toEqualTypeOf<AnyDuration>();
    });
});

describe('DurationUnit', () => {
    it('has all props of AnyDuration', () => {
        assertTypeOf<`${DurationUnit}`>().toEqualTypeOf<keyof AnyDuration>();
        assertTypeOf<keyof AnyDuration>().toEqualTypeOf<`${DurationUnit}`>();
    });
});
