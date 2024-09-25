import {describe, itCases} from '@augment-vir/test';
import {exampleFullDateUtc} from '../full-date/full-date.mock.js';
import {overrideDateParts} from './override-date.js';

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
