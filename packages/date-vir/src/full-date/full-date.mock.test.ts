import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';
import {userTimezone, utcTimezone} from '../timezone/timezones.js';
import {createFullDate} from './create-full-date.js';
import {fullDateShape} from './full-date-shape.js';
import {
    exampleFullDateUtc,
    exampleIsoString,
    exampleTimestamp,
    nonUserTimezone,
    nonUtcTimezone,
} from './full-date.mock.js';

describe('nonUserTimezone', () => {
    it('should not be the user time zone', () => {
        assert.notStrictEquals(nonUserTimezone, userTimezone);
    });
});

describe('nonUtcTimezone', () => {
    it('should not be the utc time zone', () => {
        assert.notStrictEquals(nonUtcTimezone, utcTimezone);
    });
});

describe('exampleUtcFullDate', () => {
    it('matches the example timestamp', () => {
        assert.deepEquals(exampleFullDateUtc, createFullDate(exampleTimestamp, utcTimezone));
    });
});

describe('example dates', () => {
    it('should all be equal', () => {
        const fromString = createFullDate(exampleIsoString, fullDateShape.defaultValue.timezone);
        const fromTimestamp = createFullDate(exampleTimestamp, fullDateShape.defaultValue.timezone);

        assert.deepEquals(exampleFullDateUtc, fromTimestamp);
        assert.deepEquals(exampleFullDateUtc, fromString);
    });
});
