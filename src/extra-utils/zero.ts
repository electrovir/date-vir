import {pickObjectKeys, typedObjectFromEntries} from '@augment-vir/common';
import {FullDate, TimePart, timeFullDateKeys} from '../full-date/full-date-shape';
import {overrideDateParts} from './date-transforms';

export const zeroDate = {
    year: 0,
    month: 1,
    day: 1,
    hour: 0,

    minute: 0,
    second: 0,
    millisecond: 0,
} as const satisfies Readonly<Omit<TimePart, 'timezone'>>;

export const emptyDate = zeroDate;

export const zeroTime = pickObjectKeys(zeroDate, timeFullDateKeys);

export function clearTime(inputFullDate: Readonly<FullDate>): FullDate {
    return clearParts(inputFullDate, timeFullDateKeys);
}

export function clearParts(
    inputFullDate: Readonly<FullDate>,
    parts: ReadonlyArray<Exclude<keyof FullDate, 'timezone'>>,
) {
    const clearParts = typedObjectFromEntries(
        parts.map((keyName) => {
            return [
                keyName,
                zeroDate[keyName],
            ];
        }),
    );

    return overrideDateParts(inputFullDate, clearParts);
}
