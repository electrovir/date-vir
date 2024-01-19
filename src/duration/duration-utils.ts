import {mapObjectValues, round} from '@augment-vir/common';
import {Duration as LuxonDuration} from 'luxon';
import {isRunTimeType} from 'run-time-assertions';
import {AnyDuration, Duration} from './duration';
import {DurationUnit} from './duration-unit';

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
        if (decimalCount == undefined || !isRunTimeType(value, 'number')) {
            return value as number | undefined;
        } else {
            return round({number: value, digits: decimalCount});
        }
    }) as AnyDuration as InputDuration;
}

/** Convert a duration from any combination of units into a single unit. */
export function convertDuration<RequiredDurationUnit extends DurationUnit>(
    inputDuration: AnyDuration,
    requiredUnit: RequiredDurationUnit,
): Duration<RequiredDurationUnit> {
    const luxonDuration = LuxonDuration.fromObject(inputDuration);

    const newUnitValue = luxonDuration.as(requiredUnit);

    return {[requiredUnit]: newUnitValue} as Duration<RequiredDurationUnit>;
}
