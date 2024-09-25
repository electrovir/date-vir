import {
    DurationUnit,
    flattenUnitSelection,
    roundDuration,
    type DurationBySelection,
    type DurationUnitSelection,
    type RoundOptions,
} from '@date-vir/duration';
import {ConversionAccuracy} from 'luxon';
import {FullDate} from '../full-date/full-date-shape.js';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion.js';

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

function getHighestPriorityConversionAccuracy(
    units: ReadonlyArray<DurationUnit>,
): ConversionAccuracy {
    if (units.some((unit) => conversionAccuracies[unit] === 'longterm')) {
        return 'longterm';
    } else {
        return 'casual';
    }
}

/**
 * Diffs two dates and returns the diff in the specified unit or units. When a multiple units are
 * provided with the `units` input property, an array is returned with the full diff duration
 * contained in each entry in the requested unit.
 *
 * Note: when years, quarters, or months are used for the unit, "long term" durations are used to
 * calculate the diff. See more details here:
 * https://moment.github.io/luxon/#/math?id=casual-vs-longterm-conversion-accuracy
 *
 * @category Calculation
 * @example
 *
 * ```ts
 * import {diffDates, DurationUnit} from 'date-vir';
 *
 * const exampleDate: FullDate = {
 *     year: 2024,
 *     month: 1,
 *     day: 5,
 *     hour: 1,
 *     minute: 1,
 *     second: 1,
 *     millisecond: 1,
 *     timezone: 'UTC',
 * };
 *
 * // get the diff in days
 * diffDates({start: exampleDate, end: {...exampleDate, day: 6}}, {days: true}); // {days: 1}
 * // get the full diff separately in days and also years
 * diffDates(
 *     {
 *         start: exampleDate,
 *         end: {
 *             ...exampleDate,
 *             day: exampleDate.day + 1,
 *             hour: exampleDate.hour + 3,
 *         },
 *     },
 *     {
 *         days: true,
 *         hours: true,
 *     },
 * );
 * // {days: 1, hours: 3}
 * ```
 */
export function diffDates<const SelectedUnits extends Readonly<DurationUnitSelection>>(
    {
        start,
        end,
    }: Readonly<{
        start: Readonly<FullDate>;
        end: Readonly<FullDate>;
    }>,
    /** Which units the output should contain. */
    units: SelectedUnits,
    options: Readonly<RoundOptions> = {},
): DurationBySelection<SelectedUnits> {
    const luxonDateStart = toLuxonDateTime(start);
    const luxonDateEnd = toLuxonDateTime(end);

    const selectedUnits: DurationUnit[] = flattenUnitSelection(units);

    const conversionAccuracy = getHighestPriorityConversionAccuracy(selectedUnits);

    const additiveDiff = luxonDateEnd
        .diff(luxonDateStart, selectedUnits, {
            conversionAccuracy,
        })
        .toObject();

    return roundDuration(additiveDiff, options) as DurationBySelection<SelectedUnits>;
}

/**
 * Checks if `fullDate` is after `relativeTo`.
 *
 * @category Calculation
 * @example
 *
 * ```ts
 * import {isDateAfter, type FullDate} from 'date-vir';
 *
 * const exampleDate: FullDate = {
 *     year: 2024,
 *     month: 1,
 *     day: 5,
 *     hour: 1,
 *     minute: 1,
 *     second: 1,
 *     millisecond: 1,
 *     timezone: 'UTC',
 * };
 *
 * isDateAfter({
 *     fullDate: exampleDate,
 *     relativeTo: {
 *         ...exampleDate,
 *         year: 1900,
 *     },
 * }); // `true`
 *
 * isDateAfter({
 *     fullDate: exampleDate,
 *     relativeTo: {
 *         ...exampleDate,
 *         year: 3000,
 *     },
 * }); // `false`
 * ```
 */
export function isDateAfter({
    relativeTo,
    fullDate,
}: {
    relativeTo: Readonly<FullDate>;
    fullDate: Readonly<FullDate>;
}): boolean {
    return (
        diffDates(
            {
                start: relativeTo,
                end: fullDate,
            },
            {milliseconds: true},
        ).milliseconds >= 0
    );
}
