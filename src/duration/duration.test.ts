import {assertTypeOf} from 'run-time-assertions';
import {AnyDuration, Duration} from './duration';
import {DurationUnit} from './duration-unit';

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
