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
    it('is not the user time zone', () => {
        assert.notStrictEquals(nonUserTimezone, userTimezone);
    });
});

describe('nonUtcTimezone', () => {
    it('is not the utc time zone', () => {
        assert.notStrictEquals(nonUtcTimezone, utcTimezone);
    });
});

describe('exampleUtcFullDate', () => {
    it('matches the example timestamp', () => {
        assert.deepEquals(exampleFullDateUtc, createFullDate(exampleTimestamp, utcTimezone));
    });
});

describe('example dates', () => {
    it('are all equal', () => {
        const fromString = createFullDate(exampleIsoString, fullDateShape.default.timezone);
        const fromTimestamp = createFullDate(exampleTimestamp, fullDateShape.default.timezone);

        assert.deepEquals(exampleFullDateUtc, fromTimestamp);
        assert.deepEquals(exampleFullDateUtc, fromString);
    });
});
