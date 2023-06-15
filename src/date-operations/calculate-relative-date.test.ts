import {itCases} from '@augment-vir/browser-testing';
import {exampleFullDate} from '../full-date/full-date.test-helper';
import {calculateRelativeDate} from './calculate-relative-date';

describe(calculateRelativeDate.name, () => {
    itCases(calculateRelativeDate, [
        {
            it: 'calculates relative dates',
            inputs: [
                exampleFullDate,
                {
                    days: 2,
                },
            ],
            expect: {
                ...exampleFullDate,
                day: exampleFullDate.day + 2,
            },
        },
    ]);
});
