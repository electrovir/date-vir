import {itCases} from '@augment-vir/browser-testing';
import {calculateRelativeDate} from './calculate-relative-date';
import {exampleFullDate} from './full-date.test-helper';

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
