import {itCases} from '@augment-vir/browser-testing';
import {pickObjectKeys} from '@augment-vir/common';
import {assert, fixture as renderFixture} from '@open-wc/testing';
import {html} from 'element-vir';
import {assertInstanceOf} from 'run-time-assertions';
import {timezones} from '../timezone/timezones';
import {FullDatePartEnum} from './full-date-shape';
import {exampleFullDateUtc} from './full-date.test-helper';
import {parseInputElementValue, parseStrangeString} from './parsing';

describe(parseInputElementValue.name, () => {
    itCases(parseInputElementValue, [
        {
            it: 'reads a valid html input date string',
            inputs: [
                '1999-05-06',
                timezones['Africa/Bissau'],
            ],
            expect: {
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,

                year: 1999,
                month: 5,
                day: 6,

                timezone: timezones['Africa/Bissau'],
            },
        },
        {
            it: 'returns undefined on a missing input element',
            inputs: [
                undefined,
                timezones['Africa/Bujumbura'],
            ],
            expect: undefined,
        },
        {
            it: 'returns undefined with an invalid input',
            inputs: [
                'not a date',
                timezones['Africa/Bujumbura'],
            ],
            expect: undefined,
        },
    ]);

    async function setupInputElementTest(type: FullDatePartEnum, value: string) {
        const inputElement = await renderFixture(html`
            <input type=${type} value=${value} />
        `);

        assertInstanceOf(inputElement, HTMLInputElement);

        return inputElement;
    }

    it('reads from user input times', async () => {
        const inputElement = await setupInputElementTest(FullDatePartEnum.Time, '06:09');

        assert.deepStrictEqual(
            pickObjectKeys(parseInputElementValue(inputElement, timezones['Africa/Accra'])!, [
                'hour',
                'minute',
                'second',
                'millisecond',
                'timezone',
            ]),
            {
                hour: 6,
                minute: 9,
                second: 0,
                millisecond: 0,

                timezone: timezones['Africa/Accra'],
            },
        );
    });
    it('reads from user input times with seconds', async () => {
        const inputElement = await setupInputElementTest(FullDatePartEnum.Time, '06:09:45');

        assert.deepStrictEqual(
            pickObjectKeys(parseInputElementValue(inputElement, timezones['Africa/Accra'])!, [
                'hour',
                'minute',
                'second',
                'millisecond',
                'timezone',
            ]),
            {
                hour: 6,
                minute: 9,
                second: 45,
                millisecond: 0,

                timezone: timezones['Africa/Accra'],
            },
        );
    });

    it('reads from user input dates', async () => {
        const inputElement = await setupInputElementTest(FullDatePartEnum.Date, '2023-05-04');

        assert.deepStrictEqual(
            pickObjectKeys(parseInputElementValue(inputElement, timezones['Africa/Accra'])!, [
                'year',
                'month',
                'day',
                'timezone',
            ]),
            {
                year: 2023,
                month: 5,
                day: 4,

                timezone: timezones['Africa/Accra'],
            },
        );
    });

    it('reads from user input datetime values', async () => {
        const inputElement = await setupInputElementTest(
            FullDatePartEnum.DateTime,
            '2023-05-04T05:06',
        );

        assert.deepStrictEqual(parseInputElementValue(inputElement, timezones['Africa/Accra']), {
            year: 2023,
            month: 5,
            day: 4,
            hour: 5,
            minute: 6,
            millisecond: 0,
            second: 0,

            timezone: timezones['Africa/Accra'],
        });
    });
});

describe(parseStrangeString.name, () => {
    itCases(parseStrangeString, [
        {
            it: 'parses arbitrary string format',
            input: {
                dateString: '877-7-14-19 5 2023 6',
                // 2023-06-05T14:19:00.870Z
                formatString: 'S-s-h-m d yyyy M',
                timezone: exampleFullDateUtc.timezone,
            },
            expect: exampleFullDateUtc,
        },
        {
            it: 'fails with invalid inputs',
            input: {
                dateString: '',
                formatString: '',
                timezone: exampleFullDateUtc.timezone,
            },
            throws: 'Failed to parse string',
        },
    ]);
});
