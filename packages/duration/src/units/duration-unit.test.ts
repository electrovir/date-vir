import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import type {AnyDuration} from '../duration.js';
import {DurationUnit} from './duration-unit.js';

describe('DurationUnit', () => {
    it('has all props of AnyDuration', () => {
        assert.tsType<DurationUnit>().equals<keyof AnyDuration>();
    });
});
