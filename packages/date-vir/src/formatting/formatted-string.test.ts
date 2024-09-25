import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {toNewTimezone} from '../full-date/create-full-date.js';
import {formatPresets} from '../full-date/format-presets.js';
import {exampleFullDateUtc} from '../full-date/full-date.mock.js';
import {timezones} from '../timezone/timezones.js';
import {toFormattedString, toLocaleString} from './formatted-string.js';

describe(toLocaleString.name, () => {
    itCases(toLocaleString, [
        {
            it: 'formats a string with the given locale',
            inputs: [
                exampleFullDateUtc,
                {locale: 'fr'},
            ],
            expect: '05/06/2023',
        },
        {
            it: 'formats a string with the user locale',
            inputs: [
                exampleFullDateUtc,
            ],
            throws: undefined,
        },
    ]);

    it('formats with some more options', () => {
        const result = toLocaleString(
            toNewTimezone(exampleFullDateUtc, timezones['America/Chicago']),
            {
                ...formatPresets.DatetimeFull,
                locale: 'en-us',
            },
        );

        assert.hasValue(
            [
                /** Different options that depend on the browser and operating system */
                'June 5, 2023 at 9:19 AM CDT',
                'June 5, 2023, 9:19 AM CDT',
            ],
            result,
        );
    });
});

describe(toFormattedString.name, () => {
    itCases(toFormattedString, [
        {
            it: 'should produce a string of arbitrary formatting',
            inputs: [
                exampleFullDateUtc,
                'MMM-yyyy',
            ],
            expect: 'Jun-2023',
        },
    ]);
});
