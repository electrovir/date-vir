import {describe, itCases} from '@augment-vir/test';
import {assertWrapDayOfMonth} from '@date-vir/duration';
import {exampleFullDateUtc} from '../full-date/full-date.mock.js';
import {calculateRelativeDate} from './calculate-relative-date.js';

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
                day: assertWrapDayOfMonth(exampleFullDateUtc.day + 2),
            },
        },
    ]);
});
