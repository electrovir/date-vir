import {FullDate} from '../full-date/full-date-shape';
import {Timezone} from '../timezone/timezone-names';

/** Override the initial provided FullDate with all subsequent FullDate parts. */
export function overrideDateParts<const SpecificTimezone extends Timezone>(
    date: FullDate<SpecificTimezone>,
    ...overrides: Partial<FullDate<SpecificTimezone>>[]
): FullDate<SpecificTimezone> {
    return Object.assign({}, date, ...overrides);
}
