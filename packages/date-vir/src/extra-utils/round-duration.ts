import {check} from '@augment-vir/assert';
import {mapObjectValues, round} from '@augment-vir/common';
import {AnyDuration} from '@date-vir/duration';

/** Round every unit in a given duration to the given number of decimal points. */
export function roundDuration<InputDuration extends AnyDuration>(
    duration: Readonly<InputDuration>,
    /**
     * How many decimals to round to. Leave undefined to skip rounding. (Though if you skip
     * rounding, why are you using this function?)
     */
    decimalCount: number | undefined,
): InputDuration {
    return mapObjectValues(duration, (key, value): number | undefined => {
        if (decimalCount == undefined || !check.isNumber(value)) {
            return value as number | undefined;
        } else {
            return round({number: value, digits: decimalCount});
        }
    }) as AnyDuration as InputDuration;
}
