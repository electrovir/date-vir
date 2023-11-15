import {PartialAndUndefined, areJsonEqual, mapObjectValues, round} from '@augment-vir/common';
import {diffDatesAllUnits} from '../date-operations/diff-dates';
import {DurationUnit, orderedDurationUnits, singularDurationUnitNames} from '../duration';
import {FullDate} from '../full-date/full-date-shape';

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

    const allUnitDiffs: Readonly<Record<DurationUnit, number>> = diffDatesAllUnits({
        start: fullDate,
        end: relativeTo,
    });

    const unitsWithinBounds: Readonly<Record<DurationUnit, boolean>> = mapObjectValues(
        allUnitDiffs,
        (durationUnit, duration) => {
            const isAboveZero: boolean =
                Math.floor(Math.abs(round({digits: 1, number: duration}))) > 0;
            return isAboveZero;
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
          (unitToUse === DurationUnit.Minutes && allUnitDiffs.minutes < 2) ||
          (unitToUse === DurationUnit.Seconds && allUnitDiffs.seconds < 11) ||
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
