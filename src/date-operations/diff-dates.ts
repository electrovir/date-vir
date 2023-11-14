import {typedObjectFromEntries} from '@augment-vir/common';
import {ConversionAccuracy} from 'luxon';
import {AllDurations, Duration, DurationUnit, orderedDurationUnits} from '../duration';
import {FullDate} from '../full-date/full-date-shape';
import {toLuxonDateTime} from '../full-date/luxon-date-time-conversion';

const conversionAccuracies: Record<DurationUnit, ConversionAccuracy> = {
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

/**
 * Diffs two dates and returns the diff in the specific unit.
 *
 * Note: when years, quarters, or months are used for the unit then "long term" durations are used
 * to calculate the diff. See more details here:
 * https://moment.github.io/luxon/#/math?id=casual-vs-longterm-conversion-accuracy
 */
export function diffDates<const ChosenDurationKey extends DurationUnit>({
    start,
    end,
    unit,
}: {
    start: FullDate;
    end: FullDate;
    unit: ChosenDurationKey;
}): Duration<ChosenDurationKey> {
    const luxonDateStart = toLuxonDateTime(start);
    const luxonDateEnd = toLuxonDateTime(end);

    const diff = luxonDateEnd
        .diff(luxonDateStart, unit as DurationUnit | DurationUnit[], {
            conversionAccuracy: conversionAccuracies[unit],
        })
        .toObject();

    return diff as Duration<ChosenDurationKey>;
}

/**
 * Diffs two dates and returns that diff in each unit. Note that the unit in the returned object are
 * not meant to be added together, each unit is instead the same value but calculated in that given
 * unit.
 *
 * Note: when years, quarters, or months are used for the unit then "long term" durations are used
 * to calculate the diff. See more details here:
 * https://moment.github.io/luxon/#/math?id=casual-vs-longterm-conversion-accuracy
 */
export function diffDatesAllUnits({start, end}: {start: FullDate; end: FullDate}): AllDurations {
    const allUnitDiffEntries = orderedDurationUnits.map((durationUnit) => {
        const diff = diffDates({
            start,
            end,
            unit: durationUnit,
        });

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

    const allDurations = typedObjectFromEntries(allUnitDiffEntries);

    return allDurations;
}

export function isDateAfter({
    relativeTo,
    fullDate,
}: {
    relativeTo: FullDate;
    fullDate: FullDate;
}): boolean {
    return (
        diffDates({start: relativeTo, end: fullDate, unit: DurationUnit.Milliseconds})
            .milliseconds >= 0
    );
}
