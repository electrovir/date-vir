import {describe, itCases} from '@augment-vir/test';
import {FullDate} from '../full-date/full-date-shape.js';
import {exampleFullDateUtc, exampleTimestamp} from '../full-date/full-date.mock.js';
import {toJsDate} from './js-date-conversion.js';

describe(toJsDate.name, () => {
    itCases(
        (input: FullDate) => Number(toJsDate(input)),
        [
            {
                it: 'converts an example fullDate into a JS date',
                input: exampleFullDateUtc,
                expect: exampleTimestamp,
            },
        ],
    );
});
