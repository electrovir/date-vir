import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {userLocale} from '../locale.js';
import {DateUnit, getDateUnitString} from './date-unit.js';
import {DurationUnit} from './duration-unit.js';

describe(getDateUnitString.name, () => {
    it("uses the user's locale", () => {
        const baseParams = {
            count: 1,
            unit: DurationUnit.Days,
        };

        assert.strictEquals(
            getDateUnitString(baseParams),
            getDateUnitString({...baseParams, locale: userLocale}),
        );
    });

    itCases(getDateUnitString, [
        {
            it: 'rounds up',
            input: {
                unit: DateUnit.Year,
                count: 1.5,
                locale: 'en',
            },
            expect: '2 years',
        },
        {
            it: 'abbreviates years',
            input: {
                unit: DateUnit.Year,
                count: 1.5,
                locale: 'en',
                abbreviate: true,
            },
            expect: '2 yrs',
        },
        {
            it: 'rounds down',
            input: {
                unit: DateUnit.Year,
                count: 1.4,
                locale: 'en',
            },
            expect: '1 year',
        },
        {
            it: 'does not rounds up',
            input: {
                unit: DateUnit.Year,
                count: 1.5,
                locale: 'en',
                decimalCount: 1,
            },
            expect: '1.5 years',
        },
        {
            it: 'does not rounds down',
            input: {
                unit: DateUnit.Year,
                count: 1.4,
                locale: 'en',
                decimalCount: 1,
            },
            expect: '1.4 years',
        },
        {
            it: 'gets single year in English',
            input: {
                unit: DateUnit.Year,
                count: 1,
                locale: 'en',
            },
            expect: '1 year',
        },
        {
            it: 'gets multiple years in English',
            input: {
                unit: DateUnit.Year,
                count: 2,
                locale: 'en',
            },
            expect: '2 years',
        },
        {
            it: 'supports DurationUnit',
            input: {
                unit: DurationUnit.Years,
                count: 1,
                locale: 'en',
            },
            expect: '1 year',
        },
        // cspell:disable
        {
            it: 'gets single year in Spanish',
            input: {
                unit: DateUnit.Year,
                count: 1,
                locale: 'es',
            },
            expect: '1 año',
        },
        {
            it: 'gets multiple years in Spanish',
            input: {
                unit: DateUnit.Year,
                count: 2,
                locale: 'es',
            },
            expect: '2 años',
        },
    ]);
});
