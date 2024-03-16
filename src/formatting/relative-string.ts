import {PartialAndUndefined, areJsonEqual, mapObjectValues, round} from '@augment-vir/common';
import {DiffType, diffDates} from '../date-operations/diff-dates';
import {
    DurationUnit,
    orderedDurationUnits,
    singularDurationUnitNames,
} from '../duration/duration-unit';
import {FullDate} from '../full-date/full-date-shape';

const maxDurations: Readonly<Record<DurationUnit, number>> = {
    [DurationUnit.Milliseconds]: 1000,
    [DurationUnit.Seconds]: 60,
    [DurationUnit.Minutes]: 60,
    [DurationUnit.Hours]: 24,
    [DurationUnit.Days]: 30,
    [DurationUnit.Weeks]: 4,
    [DurationUnit.Months]: 12,
    [DurationUnit.Quarters]: 4,
    [DurationUnit.Years]: Infinity,
};

export type RelativeStringOptions = {
    /**
     * The relative units that the relative string function is not allowed to use. By default, all
     * units are allowed. Thus, you can use this to selectively disable some of them.
     */
    blockedRelativeUnits: ReadonlyArray<DurationUnit>;
    /**
     * The number of digits to round the relative number value to. Defaults to 0, meaning there will
     * be no decimal digits.
     *
     * Example output: {decimalDigitCount: 4} can result in values like 5.6789 whereas
     * {decimalDigitCount: 0} will result in values like 6.
     */
    decimalDigitCount: number;
    /** Set this to true to block the 'just now' relative string. By default, that string is allowed. */
    blockJustNow: true;
    /**
     * Set to true to limit durations to their max value. Each unit's max value is its value when it
     * turns into the subsequent unit. For example, seconds maxes out at 60, at which point it
     * becomes a minute.
     */
    limitUnitMax: true;
};

export function toRelativeString({
    fullDate,
    relativeTo,
    options = {},
}: {
    fullDate: Readonly<FullDate>;
    relativeTo: Readonly<FullDate>;
    options?: PartialAndUndefined<RelativeStringOptions>;
}): string | undefined {
    const roundingDigits = options.decimalDigitCount || 0;

    const allUnitDiffs: Readonly<Record<DurationUnit, number>> = diffDates({
        start: fullDate,
        end: relativeTo,
        units: orderedDurationUnits,
        diffType: DiffType.EquivalentUnits,
    });

    const unitsWithinBounds: Readonly<Record<DurationUnit, boolean>> = mapObjectValues(
        allUnitDiffs,
        (durationUnit, duration) => {
            const roundedDuration = Math.floor(Math.abs(round({digits: 1, number: duration})));

            const isAboveZero: boolean = roundedDuration > 0;

            const isBelowMax: boolean = options.limitUnitMax
                ? roundedDuration < maxDurations[durationUnit]
                : true;
            return isAboveZero && isBelowMax;
        },
    );

    const unitToUse: DurationUnit | undefined = orderedDurationUnits.reduce(
        (chosenUnit, currentUnit) => {
            const isUnitAllowed = !options.blockedRelativeUnits?.includes(currentUnit);

            if (isUnitAllowed && unitsWithinBounds[currentUnit]) {
                return currentUnit;
            } else {
                return chosenUnit;
            }
        },
        undefined as DurationUnit | undefined,
    );

    const shouldUseJustNow = options.blockJustNow
        ? false
        : areJsonEqual(fullDate, relativeTo) ||
          (unitToUse === DurationUnit.Minutes &&
              options.blockedRelativeUnits?.includes(DurationUnit.Seconds) &&
              allUnitDiffs.minutes < 2) ||
          (unitToUse === DurationUnit.Seconds &&
              options.blockedRelativeUnits?.includes(DurationUnit.Milliseconds) &&
              allUnitDiffs.seconds < 11) ||
          (unitToUse === DurationUnit.Milliseconds && allUnitDiffs.milliseconds < 710);

    /** Some short circuits. */
    if (shouldUseJustNow) {
        return 'just now';
    } else if (unitToUse == undefined) {
            return undefined;
    }

    const duration = allUnitDiffs[unitToUse];
    const roundedAbsoluteDuration = Math.abs(round({digits: roundingDigits, number: duration}));
    const isDurationSingular = roundedAbsoluteDuration === 1;
    const unitName: string = [
        singularDurationUnitNames[unitToUse],
        isDurationSingular ? '' : 's',
    ].join('');
    const value = isDurationSingular ? 'a' : roundedAbsoluteDuration;

    if (duration < 0) {
        return `in ${value} ${unitName}`;
    } else {
        return `${value} ${unitName} ago`;
    }
}
