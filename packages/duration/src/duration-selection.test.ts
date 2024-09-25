import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import type {DurationBySelection} from './duration-selection.js';
import type {AllDurations} from './duration.js';

describe('DurationBySelection', () => {
    it('defaults to all durations', () => {
        assert.tsType<DurationBySelection<undefined>>().equals<AllDurations>();
    });
    it('picks only the selected units', () => {
        assert
            .tsType<
                DurationBySelection<{
                    days: true;
                    seconds: true;
                }>
            >()
            .equals<{days: number; seconds: number}>();
    });
});
