import {ArrayElement, makeWritable, typedObjectFromEntries} from '@augment-vir/common';
import {ConversionAccuracy} from 'luxon';
import {Duration, DurationUnit, roundDuration} from '../duration';
import {FullDate} from '../full-date/full-date-shape';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion';

const accuracyPriority: Readonly<Record<ConversionAccuracy, number>> = {
    longterm: 1,
    casual: 0,
};

const conversionAccuracies: Readonly<Record<DurationUnit, ConversionAccuracy>> = {
    [DurationUnit.Years]: 'longterm',
    [DurationUnit.Quarters]: 'longterm',
    [DurationUnit.Months]: 'longterm',

    [DurationUnit.Weeks]: 'casual',
    [DurationUnit.Days]: 'casual',
    [DurationUnit.Hours]: 'casual',
    [DurationUnit.Minutes]: 'casual',
    [DurationUnit.Seconds]: 'casual',
    [DurationUnit.Milliseconds]: 'casual',
};

function getHighestPriorityConversionAccuracy(units: ReadonlyArray<DurationUnit>) {
    const currentConversionAccuracies = units.map((unit) => conversionAccuracies[unit]);

    const highestPriorityAccuracy = currentConversionAccuracies.reduce(
        (priorityAccuracy, currentAccuracy) => {
            if (accuracyPriority[currentAccuracy] > accuracyPriority[priorityAccuracy]) {
                return currentAccuracy;
            } else {
                return priorityAccuracy;
            }
        },
    );

    return highestPriorityAccuracy;
}

export enum DiffType {
    /**
     * Causes the diffDates function to output the diff split between each unit provided. To get the
     * full duration, each output unit needs to be added together.
     */
    AdditiveUnits = 'additive-units',
    /**
     * Causes the diffDates function to output the diff in each unit provided with each unit being
     * equivalent in value. Meaning, each unit will be the same duration of time converted into that
     * unit.
     */
    EquivalentUnits = 'equivalent-units',
}

/**
 * Diffs two dates and returns the diff in the specific unit.
 *
 * Note: when years, quarters, or months are used for the unit then "long term" durations are used
 * to calculate the diff. See more details here:
 * https://moment.github.io/luxon/#/math?id=casual-vs-longterm-conversion-accuracy
 */
export function diffDates<const ChosenDurationKeys extends Readonly<[DurationUnit]>>(params: {
    start: FullDate;
    end: FullDate;
    /** Which units the output should contain. */
    units: ChosenDurationKeys;
    /**
     * Determine the diff type calculation. See DiffType values for explanations on each one.
     * Optional when only one unit is provided, as the diffType will not change the output either
     * way.
     */
    diffType?: DiffType | undefined;
    /** How many decimals to round the outputs to. Leave undefined to skip rounding entirely. */
    decimalCount?: number | undefined;
}): Duration<ArrayElement<ChosenDurationKeys>>;
export function diffDates<const ChosenDurationKeys extends ReadonlyArray<DurationUnit>>(params: {
    start: FullDate;
    end: FullDate;
    /** Which units the output should contain. */
    units: ChosenDurationKeys;
    /** Determine the diff type calculation. See DiffType values for explanations on each one. */
    diffType: DiffType;
    /** How many decimals to round the outputs to. Leave undefined to skip rounding entirely. */
    decimalCount?: number | undefined;
}): Duration<ArrayElement<ChosenDurationKeys>>;
export function diffDates<const ChosenDurationKeys extends ReadonlyArray<DurationUnit>>({
    start,
    end,
    units,
    diffType: diffTypeInput,
    decimalCount,
}: {
    start: FullDate;
    end: FullDate;
    units: ChosenDurationKeys;
    diffType?: DiffType | undefined;
    decimalCount?: number | undefined;
}): Duration<ArrayElement<ChosenDurationKeys>> {
    const luxonDateStart = toLuxonDateTime(start);
    const luxonDateEnd = toLuxonDateTime(end);

    const diffType =
        units.length === 1
            ? /**
               * When only one unit is provided, it doesn't matter which diff type we use so lets just use this
               * one.
               */
              DiffType.EquivalentUnits
            : diffTypeInput;

    if (!diffType) {
        throw new Error('Failed to diff dates: no diffType was provided.');
    }

    if (diffType === DiffType.AdditiveUnits) {
        const conversionAccuracy = getHighestPriorityConversionAccuracy(units);

        const additiveDiff = luxonDateEnd
            .diff(luxonDateStart, makeWritable(units), {
                conversionAccuracy,
            })
            .toObject();

        return roundDuration(additiveDiff, decimalCount) as Duration<
            ArrayElement<ChosenDurationKeys>
        >;
    } else if (diffType === DiffType.EquivalentUnits) {
        const allUnitDiffEntries = units.map((durationUnit) => {
            const diff = luxonDateEnd
                .diff(luxonDateStart, durationUnit, {
                    conversionAccuracy: conversionAccuracies[durationUnit],
                })
                .toObject();

            const duration = diff[durationUnit];

            /** Ignore this edge case in coverage cause its for type guarding. */
            /* c8 ignore next 5 */
            if (duration == undefined) {
                throw new Error(
                    `Internal date-vir error: failed to find duration for '${durationUnit}'`,
                );
            }

            return [
                durationUnit,
                duration,
            ] as const;
        });

        const equivalentDiff = typedObjectFromEntries(allUnitDiffEntries);

        return roundDuration(equivalentDiff, decimalCount) as Duration<
            ArrayElement<ChosenDurationKeys>
        >;
    } else {
        throw new Error(`Failed to diff dates: provided diffType is invalid: '${diffType}'`);
    }
}

export function isDateAfter({
    relativeTo,
    fullDate,
}: {
    relativeTo: FullDate;
    fullDate: FullDate;
}): boolean {
    return (
        diffDates({start: relativeTo, end: fullDate, units: [DurationUnit.Milliseconds]})
            .milliseconds >= 0
    );
}
