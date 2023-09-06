import {assert} from '@open-wc/testing';
import {DiffUnit, diffDates} from '../date-operations/diff-dates';
import {createFullDate, getNowFullDate} from '../full-date/create-full-date';
import {toIsoString} from '../full-date/primitive-conversions';
import {utcTimezone} from '../timezone/timezones';
import {getNowInIsoString} from './now-in-iso-string';

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
