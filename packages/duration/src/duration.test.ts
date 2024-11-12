import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {AnyDuration, Duration} from './duration.js';
import {DurationUnit} from './units/duration-unit.js';

describe('Duration', () => {
    it('picks a single unit', () => {
        assert.tsType<Duration<DurationUnit.Days>>().equals<{days: number}>();
    });

    it('picks multiple units', () => {
        assert.tsType<Duration<DurationUnit.Days | DurationUnit.Weeks>>().slowEquals<{
            [DurationUnit.Days]: number;
            [DurationUnit.Weeks]: number;
        }>();
    });

    it('allows AllDuration', () => {
        assert.tsType<Duration<true>>().equals<AnyDuration>();
    });
});
