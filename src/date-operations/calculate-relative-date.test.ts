import {itCases} from '@augment-vir/browser-testing';
import {exampleFullDateUtc} from '../full-date/full-date.test-helper';
import {calculateRelativeDate} from './calculate-relative-date';

describe(calculateRelativeDate.name, () => {
    itCases(calculateRelativeDate, [
        {
            it: 'calculates relative dates',
            inputs: [
                exampleFullDateUtc,
                {
                    days: 2,
                },
            ],
            expect: {
                ...exampleFullDateUtc,
                day: exampleFullDateUtc.day + 2,
            },
        },
    ]);
});
