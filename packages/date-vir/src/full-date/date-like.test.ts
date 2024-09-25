import {describe, it} from '@augment-vir/test';
import {DateTime} from 'luxon';

import {assert} from '@augment-vir/assert';
import {timezones} from '../timezone/timezones.js';
import {createFullDate} from './create-full-date.js';
import {DateLike} from './date-like.js';

describe('DateLike', () => {
    it('allows any of the union types to be assigned to it', () => {
        assert
            .tsType([
                '',
                0,
                new Date(),
                DateTime.fromISO(''),
                createFullDate(0, timezones.UTC),
            ])
            .matches<ReadonlyArray<DateLike>>();
    });
});
