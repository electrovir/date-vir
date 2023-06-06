import {assertTypeOf} from '@augment-vir/browser-testing';
import {DateTime} from 'luxon';
import {timezones} from '../timezone/timezones';
import {createFullDate} from './create-full-date';
import {DateLike} from './date-like';

describe('DateLike', () => {
    it('allows any of the union types to be assigned to it', () => {
        assertTypeOf([
            '',
            0,
            new Date(),
            DateTime.fromISO(''),
            createFullDate(0, timezones.UTC),
        ]).toMatchTypeOf<ReadonlyArray<DateLike>>();
    });
});
