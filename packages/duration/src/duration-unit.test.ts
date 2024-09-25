import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {DurationUnit} from './duration-unit.js';
import {AnyDuration} from './duration.js';

describe('DurationUnit', () => {
    it('has all props of AnyDuration', () => {
        assert.tsType<`${DurationUnit}`>().equals<keyof AnyDuration>();
        assert.tsType<keyof AnyDuration>().equals<`${DurationUnit}`>();
    });
});
