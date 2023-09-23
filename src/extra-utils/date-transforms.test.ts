import {itCases} from '@augment-vir/browser-testing';
import {exampleFullDateUtc} from '../full-date/full-date.test-helper';
import {overrideDateParts} from './date-transforms';

describe(overrideDateParts.name, () => {
    itCases(overrideDateParts, [
        {
            it: 'overrides properties',
            inputs: [
                exampleFullDateUtc,
                {day: 0, year: 0},
            ],
            expect: {
                ...exampleFullDateUtc,
                day: 0,
                year: 0,
            },
        },
    ]);
});
