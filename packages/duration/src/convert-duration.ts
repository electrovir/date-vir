import {Duration as LuxonDuration} from 'luxon';
import {
    flattenUnitsSmallestToLargest,
    type DurationBySelection,
    type DurationUnitSelection,
} from './duration-selection.js';
import {type AnyDuration} from './duration.js';
import {type RoundOptions} from './round-options.js';
import {DurationUnit} from './units/duration-unit.js';

/**
 * This is mostly copied from `@augment-vir/common` so that the `@date-vir/duration` package doesn't
 * need to depend on any `@augment-vir/*` packages as that would cause a circular dependency inside
 * of the `@augment-vir/*` packages.
 */
function round(value: number, {decimalCount}: RoundOptions): number {
    if (decimalCount == undefined) {
        return value;
    }

    const digitFactor = Math.pow(10, decimalCount);
    const multiplied = value * digitFactor;
    return Number((Math.round(multiplied) / digitFactor).toFixed(decimalCount));
}
/** Round up only if the decimal is >=.9 */
function roundNarrow(value: number): number {
    return round(Math.max(value - 0.4, 0), {decimalCount: 0});
}

function getSign(value: number): number {
    if (value === 0) {
        return 0;
    } else {
        return Math.sign(value);
    }
}

/**
 * Convert a duration from any combination of units into the selected units.
 *
 * @category Duration
 * @example
 *
 * ```ts
 * import {convertDuration} from 'date-vir';
 *
 * convertDuration({seconds: 5, milliseconds: 5}, {minutes: true}); // `{minutes: 0.25}`
 * convertDuration({seconds: 5_356_800}, {weeks: true, seconds: true}); // `{weeks: 8, seconds: 518_400}`
 * ```
 */
export function convertDuration<const SelectedUnits extends Readonly<DurationUnitSelection>>(
    duration: Readonly<AnyDuration>,
    /** Select which duration units to convert to. */
    units: SelectedUnits,
    rawOptions: RoundOptions = {},
): DurationBySelection<SelectedUnits> {
    const finalDuration: AnyDuration = {};
    const options: Required<RoundOptions> = {
        decimalCount:
            rawOptions.decimalCount == undefined
                ? undefined
                : Math.round(Math.abs(rawOptions.decimalCount)),
    };

    /** Handle infinite units. */
    const hasInfinity = Object.values(duration).includes(Infinity);
    const hasNegativeInfinity = Object.values(duration).includes(-Infinity);

    const selectedUnits = flattenUnitsSmallestToLargest(units).reverse();

    if (hasInfinity || hasNegativeInfinity) {
        selectedUnits.forEach((unit) => {
            finalDuration[unit] = hasInfinity ? Infinity : -Infinity;
        });

        return finalDuration as DurationBySelection<SelectedUnits>;
    }

    let millisecondsRemaining: number = LuxonDuration.fromObject(duration).as(
        DurationUnit.Milliseconds,
    );

    const finalDurationSign = getSign(millisecondsRemaining);

    selectedUnits.forEach((durationUnit, index) => {
        const isLastUnit = index === selectedUnits.length - 1;

        if (durationUnit === DurationUnit.Milliseconds) {
            finalDuration.milliseconds = round(millisecondsRemaining, options);
        } else {
            const rawQuantity = LuxonDuration.fromObject({milliseconds: millisecondsRemaining}).as(
                durationUnit,
            );
            // positive or negative
            const signModifier = Math.sign(rawQuantity);
            const absoluteQuantity = Math.abs(rawQuantity);

            const absoluteRoundedUnitQuantity = isLastUnit
                ? round(absoluteQuantity, options)
                : Math.floor(
                      options.decimalCount == undefined
                          ? absoluteQuantity
                          : roundNarrow(absoluteQuantity),
                  );

            const signedRoundedQuantity =
                absoluteRoundedUnitQuantity === 0
                    ? /** Use this ternary to prevent `-0` assignment. */
                      0
                    : absoluteRoundedUnitQuantity * signModifier;

            finalDuration[durationUnit] = signedRoundedQuantity;
            millisecondsRemaining -= LuxonDuration.fromObject({
                [durationUnit]: signedRoundedQuantity,
            }).as(DurationUnit.Milliseconds);

            if (finalDurationSign !== getSign(millisecondsRemaining)) {
                /**
                 * If rounding resulted in the amount of milliseconds remaining flipping across `0`,
                 * just zero it out to prevent crazy values.
                 */
                millisecondsRemaining = 0;
            }
        }
    });

    return finalDuration as DurationBySelection<SelectedUnits>;
}

/**
 * Round every unit in a given duration to the given number of decimal points.
 *
 * @category Duration
 * @example
 *
 * ```ts
 * import {roundDuration} from 'date-vir';
 *
 * roundDuration({days: 1.002, minutes: 0.125}, 2); // `{days: 1, minutes: 0.13}`
 * ```
 */
export function roundDuration<InputDuration extends AnyDuration>(
    duration: Readonly<InputDuration>,
    options: RoundOptions,
): InputDuration {
    return Object.fromEntries(
        Object.entries(duration).map(
            ([
                durationUnit,
                quantity,
            ]): [DurationUnit, number] => {
                return [
                    durationUnit as DurationUnit,
                    round(quantity, options),
                ];
            },
        ),
    ) as InputDuration;
}
