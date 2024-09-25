import {Duration as LuxonDuration} from 'luxon';
import {DurationUnit} from './duration-unit.js';
import {AnyDuration, Duration} from './duration.js';

/**
 * Convert a duration from any combination of units into a single unit.
 *
 * @category Duration
 * @example
 *
 * ```ts
 * import {convertDuration} from 'date-vir';
 *
 * convertDuration({seconds: 5, milliseconds: 5}, DurationUnit.Minutes); // `{minutes: 0.25}`
 * ```
 */
export function convertDuration<RequiredDurationUnit extends DurationUnit>(
    inputDuration: AnyDuration,
    requiredUnit: RequiredDurationUnit,
): Duration<RequiredDurationUnit> {
    if (hasInfinity(inputDuration)) {
        return {[requiredUnit]: Infinity} as Duration<RequiredDurationUnit>;
    } else if (hasNegativeInfinity(inputDuration)) {
        return {[requiredUnit]: -Infinity} as Duration<RequiredDurationUnit>;
    }

    const luxonDuration = LuxonDuration.fromObject(inputDuration);

    const newUnitValue = luxonDuration.as(requiredUnit);

    return {[requiredUnit]: newUnitValue} as Duration<RequiredDurationUnit>;
}

function hasInfinity(duration: AnyDuration): boolean {
    return Object.values(duration).includes(Infinity);
}
function hasNegativeInfinity(duration: AnyDuration): boolean {
    return Object.values(duration).includes(-Infinity);
}
