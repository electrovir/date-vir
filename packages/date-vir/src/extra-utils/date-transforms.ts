import {FullDate} from '../full-date/full-date-shape.js';
import {Timezone} from '../timezone/timezone-names.js';

/** Override the initial provided FullDate with all subsequent FullDate parts. */
export function overrideDateParts<const SpecificTimezone extends Timezone>(
    date: FullDate<SpecificTimezone>,
    ...overrides: Partial<FullDate<SpecificTimezone>>[]
): FullDate<SpecificTimezone> {
    return Object.assign({}, date, ...overrides);
}
