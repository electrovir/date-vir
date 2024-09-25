import {describe, itCases} from '@augment-vir/test';
import {DurationUnitSelection} from './duration-selection.js';
import {expandDuration} from './expand-duration.js';

describe(expandDuration.name, () => {
    itCases(expandDuration<Partial<DurationUnitSelection>>, [
        {
            it: 'expands milliseconds to seconds',
            inputs: [
                {milliseconds: 1000},
                {seconds: true},
            ],
            expect: {
                seconds: 1,
            },
        },
        {
            it: 'expands many seconds to specific units',
            inputs: [
                {seconds: 5_356_800},
                {
                    weeks: true,
                    seconds: true,
                },
            ],
            expect: {
                weeks: 8,
                seconds: 518_400,
            },
        },
        {
            it: 'if nothing is selected then nothing is returned',
            inputs: [
                {seconds: 5_356_800},
                {},
            ],
            expect: {},
        },
    ]);
});
