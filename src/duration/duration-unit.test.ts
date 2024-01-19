import {assertTypeOf} from 'run-time-assertions';
import {AnyDuration} from './duration';
import {DurationUnit} from './duration-unit';

describe('DurationUnit', () => {
    it('has all props of AnyDuration', () => {
        assertTypeOf<`${DurationUnit}`>().toEqualTypeOf<keyof AnyDuration>();
        assertTypeOf<keyof AnyDuration>().toEqualTypeOf<`${DurationUnit}`>();
    });
});
