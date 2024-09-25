import {assert} from '@augment-vir/assert';
import {omitObjectKeys} from '@augment-vir/common';
import {describe, it} from '@augment-vir/test';
import {diffDates} from '../date-operations/diff-dates.js';
import {toUtcIsoString} from '../formatting/timestamp.js';
import {createFullDate} from '../full-date/create-full-date.js';
import {FullDate} from '../full-date/full-date-shape.js';
import {nonUserTimezone} from '../full-date/full-date.mock.js';
import {UtcTimezone, userTimezone, utcTimezone} from '../timezone/timezones.js';
import {
    getNowFullDate,
    getNowInIsoString,
    getNowInUserTimezone,
    getNowInUtcTimezone,
} from './now.js';

describe(getNowInIsoString.name, () => {
    it('produces same output as stringing together toIsoString and getNowFullDate', () => {
        const resultTest = getNowInIsoString();
        const resultCompare = toUtcIsoString(getNowFullDate(utcTimezone));

        const testParts = resultTest.split(':');
        const compareParts = resultCompare.split(':');

        assert.isTrue(resultTest.endsWith('Z'));
        assert.isLengthExactly(testParts, compareParts.length);

        const testFullDate = createFullDate(resultTest, utcTimezone);
        const compareFullDate = createFullDate(resultCompare, utcTimezone);

        const diff = diffDates(
            {
                start: testFullDate,
                end: compareFullDate,
            },
            {seconds: true},
        );

        /** Allow large diff for slow CI action runners. */
        assert.isBelow(diff.seconds, 10);
    });
});

describe(getNowInUserTimezone.name, () => {
    it('creates a time identical to doing getNowFullDate', () => {
        const shortVersion = getNowInUserTimezone();
        const longVersion = getNowFullDate(userTimezone);

        /** Allow buffer for time between instruction execution */
        const diff = diffDates(
            {
                start: shortVersion,
                end: longVersion,
            },
            {minutes: true},
        );

        assert.isBelow(diff.minutes, 1);
    });
});

describe(getNowInUtcTimezone.name, () => {
    it('creates a time identical to doing getNowFullDate', () => {
        const shortVersion = getNowInUtcTimezone();
        const longVersion = getNowFullDate(utcTimezone);

        /** Allow buffer for time between instruction execution */
        const diff = diffDates(
            {
                start: shortVersion,
                end: longVersion,
            },
            {minutes: true},
        );

        assert.isBelow(diff.minutes, 1);
    });

    it('matches the UTC timezone type', () => {
        assert.tsType(getNowInUtcTimezone()).equals<FullDate<UtcTimezone>>();
        assert.tsType(getNowInUtcTimezone()).notEquals<FullDate>();
    });
});

describe(getNowFullDate.name, () => {
    it('gets the right current time', () => {
        const nowFromDate = omitObjectKeys(createFullDate(Date.now(), userTimezone), [
            'second',
            'millisecond',
        ]);
        const nowFullDateUserTimezone = omitObjectKeys(getNowFullDate(userTimezone), [
            'second',
            'millisecond',
        ]);
        const nowFullDateOtherTimezone = omitObjectKeys(getNowFullDate(nonUserTimezone), [
            'second',
            'millisecond',
        ]);

        assert.deepEquals(nowFromDate, nowFullDateUserTimezone);
        assert.notDeepEquals(nowFromDate, nowFullDateOtherTimezone);
    });
    it('specifies a timezone', () => {
        const anyTimezone = getNowFullDate(userTimezone);

        // @ts-expect-error: mismatched timezone type parameter
        const specificTimezone: FullDate<UtcTimezone> = anyTimezone;

        assert.tsType(specificTimezone.timezone).equals<UtcTimezone>();
        assert.tsType(specificTimezone.timezone).equals(utcTimezone);
    });
});
