import {assert} from '@open-wc/testing';
import {userTimezone, utcTimezone} from '../timezone/timezones';
import {createFullDate} from './create-full-date';
import {fullDateShape} from './full-date-shape';
import {
    exampleFullDateUtc,
    exampleIsoString,
    exampleTimestamp,
    nonUserTimezone,
    nonUtcTimezone,
} from './full-date.test-helper';

describe('nonUserTimezone', () => {
    it('should not be the user time zone', () => {
        assert.notStrictEqual(nonUserTimezone, userTimezone);
    });
});

describe('nonUtcTimezone', () => {
    it('should not be the utc time zone', () => {
        assert.notStrictEqual(nonUtcTimezone, utcTimezone);
    });
});

describe('exampleUtcFullDate', () => {
    it('matches the example timestamp', () => {
        assert.deepStrictEqual(exampleFullDateUtc, createFullDate(exampleTimestamp, utcTimezone));
    });
});

describe('example dates', () => {
    it('should all be equal', () => {
        const fromString = createFullDate(exampleIsoString, fullDateShape.defaultValue.timezone);
        const fromTimestamp = createFullDate(exampleTimestamp, fullDateShape.defaultValue.timezone);

        assert.deepStrictEqual(exampleFullDateUtc, fromTimestamp);
        assert.deepStrictEqual(exampleFullDateUtc, fromString);
    });
});
