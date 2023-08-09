import {itCases} from '@augment-vir/browser-testing';
import {overrideDateParts} from './date-transforms';
import {exampleFullDate} from './full-date.test-helper';

describe(overrideDateParts.name, () => {
    itCases(overrideDateParts, [
        {
            it: 'overrides properties',
            inputs: [
                exampleFullDate,
                {day: 0, year: 0},
            ],
            expect: {
                ...exampleFullDate,
                day: 0,
                year: 0,
            },
        },
    ]);
});
