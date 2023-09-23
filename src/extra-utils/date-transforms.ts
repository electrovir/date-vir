import {FullDate} from '../full-date/full-date-shape';

/** Override the initial provided FullDate with all subsequent FullDate parts. */
export function overrideDateParts(date: FullDate, ...overrides: Partial<FullDate>[]): FullDate {
    return Object.assign({}, date, ...overrides);
}
