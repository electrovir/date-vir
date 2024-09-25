import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {DurationUnit} from '@date-vir/duration';
import {diffDates} from '../date-operations/diff-dates.js';
import {toIsoString} from '../formatting/timestamp.js';
import {createFullDate, getNowFullDate} from '../full-date/create-full-date.js';
import {FullDate} from '../full-date/full-date-shape.js';
import {UtcTimezone, userTimezone, utcTimezone} from '../timezone/timezones.js';
import {getNowInIsoString, getNowInUserTimezone, getNowInUtcTimezone} from './now.js';

describe(getNowInIsoString.name, () => {
    it('produces same output as stringing together toIsoString and getNowFullDate', () => {
        const resultTest = getNowInIsoString();
        const resultCompare = toIsoString(getNowFullDate(utcTimezone));

        const testParts = resultTest.split(':');
        const compareParts = resultCompare.split(':');

        assert.isTrue(resultTest.endsWith('Z'));
        assert.isLengthExactly(testParts, compareParts.length);

        const testFullDate = createFullDate(resultTest, utcTimezone);
        const compareFullDate = createFullDate(resultCompare, utcTimezone);

        const diff = diffDates({
            start: testFullDate,
            end: compareFullDate,
            unit: DurationUnit.Seconds,
        });

        /** Allow large diff for slow CI action runners. */
        assert.isBelow(diff.seconds, 10);
    });
});

describe(getNowInUserTimezone.name, () => {
    it('creates a time identical to doing getNowFullDate', () => {
        const shortVersion = getNowInUserTimezone();
        const longVersion = getNowFullDate(userTimezone);

        /** Allow buffer for time between instruction execution */
        const diff = diffDates({
            start: shortVersion,
            end: longVersion,
            unit: DurationUnit.Minutes,
        });

        assert.isBelow(diff.minutes, 1);
    });
});

describe(getNowInUtcTimezone.name, () => {
    it('creates a time identical to doing getNowFullDate', () => {
        const shortVersion = getNowInUtcTimezone();
        const longVersion = getNowFullDate(utcTimezone);

        /** Allow buffer for time between instruction execution */
        const diff = diffDates({
            start: shortVersion,
            end: longVersion,
            unit: DurationUnit.Minutes,
        });

        assert.isBelow(diff.minutes, 1);
    });

    it('matches the UTC timezone type', () => {
        assert.tsType(getNowInUtcTimezone()).equals<FullDate<UtcTimezone>>();
        assert.tsType(getNowInUtcTimezone()).notEquals<FullDate>();
    });
});
