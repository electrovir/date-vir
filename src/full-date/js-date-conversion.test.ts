import {itCases} from '@augment-vir/browser-testing';
import {FullDate} from './full-date-shape';
import {exampleFullDate, exampleTimestamp} from './full-date.test-helper';
import {toJsDate} from './js-date-conversion';

describe(toJsDate.name, () => {
    itCases(
        (input: FullDate) => Number(toJsDate(input)),
        [
            {
                it: 'converts an example fullDate into a JS date',
                input: exampleFullDate,
                expect: exampleTimestamp,
            },
        ],
    );
});
