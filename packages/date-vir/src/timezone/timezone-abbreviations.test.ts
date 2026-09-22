import {assert} from '@augment-vir/assert';
import {getObjectTypedValues} from '@augment-vir/common';
import {describe, it, itCases} from '@augment-vir/test';
import {getTimezoneFromAbbreviation, timezoneAbbreviations} from './timezone-abbreviations.js';
import {isValidTimezone} from './timezone-checks.js';

describe(getTimezoneFromAbbreviation.name, () => {
    itCases(getTimezoneFromAbbreviation, [
        {
            it: 'reads a standard time abbreviation',
            input: 'PST',
            expect: 'America/Los_Angeles',
        },
        {
            it: 'reads the daylight saving half of the same region as the same zone',
            input: 'PDT',
            expect: 'America/Los_Angeles',
        },
        {
            it: 'reads a generic abbreviation that Intl never prints',
            input: 'PT',
            expect: 'America/Los_Angeles',
        },
        {
            it: 'ignores casing and surrounding whitespace',
            input: '  pst ',
            expect: 'America/Los_Angeles',
        },
        {
            it: 'resolves a collision toward the most populous region',
            input: 'IST',
            expect: 'Asia/Kolkata',
        },
        {
            it: 'gives up on an unknown abbreviation',
            input: 'not an abbreviation',
            expect: undefined,
        },
        {
            it: 'gives up on an empty string',
            input: '',
            expect: undefined,
        },
    ]);
});

describe('timezoneAbbreviations', () => {
    it('only maps to timezones that can actually construct a date', () => {
        assert.deepEquals(
            getObjectTypedValues(timezoneAbbreviations).filter(
                (timezone) => !isValidTimezone(timezone),
            ),
            [],
        );
    });
});
