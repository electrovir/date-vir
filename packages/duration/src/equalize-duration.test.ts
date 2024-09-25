import {describe, itCases} from '@augment-vir/test';
import {DurationUnitSelection} from './duration-selection.js';
import {equalizeDuration} from './equalize-duration.js';

describe(equalizeDuration.name, () => {
    itCases(equalizeDuration<Readonly<DurationUnitSelection>>, [
        {
            it: 'equalizes a ton of seconds',
            inputs: [
                {
                    seconds: 5_356_800,
                },
                {
                    months: true,
                    hours: true,
                    weeks: true,
                    seconds: true,
                },
                {
                    roundToDigits: 0,
                },
            ],
            expect: {seconds: 5_356_800, hours: 1488, weeks: 9, months: 2},
        },
    ]);
});
