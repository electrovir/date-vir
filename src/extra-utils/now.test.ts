import {assert} from '@open-wc/testing';
import {diffDates} from '../date-operations/diff-dates';
import {DiffUnit} from '../duration';
import {createFullDate, getNowFullDate} from '../full-date/create-full-date';
import {toIsoString} from '../full-date/primitive-conversions';
import {userTimezone, utcTimezone} from '../timezone/timezones';
import {getNowInIsoString, getNowInUserTimezone} from './now';

describe(getNowInIsoString.name, () => {
    it('produces same output as stringing together toIsoString and getNowFullDate', () => {
        const resultTest = getNowInIsoString();
        const resultCompare = toIsoString(getNowFullDate(utcTimezone));

        const testParts = resultTest.split(':');
        const compareParts = resultCompare.split(':');

        assert.isTrue(resultTest.endsWith('Z'));
        assert.lengthOf(testParts, compareParts.length);

        const testFullDate = createFullDate(resultTest, utcTimezone);
        const compareFullDate = createFullDate(resultCompare, utcTimezone);

        const diff = diffDates({start: testFullDate, end: compareFullDate, unit: DiffUnit.Seconds});

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
            unit: DiffUnit.Minutes,
        });

        assert.isBelow(diff.minutes, 1);
    });
});
