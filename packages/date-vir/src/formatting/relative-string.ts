import {check} from '@augment-vir/assert';
import {
    filterMap,
    type PartialWithUndefined,
    type RequiredAndNotNull,
    type SelectFrom,
} from '@augment-vir/common';
import {
    convertDuration,
    flattenUnitsSmallestToLargest,
    getDateUnitString,
    type AnyDuration,
    type DurationUnit,
    type DurationUnitSelection,
    type LocaleOptions,
    type RoundOptions,
} from '@date-vir/duration';
import {diffDates} from '../date-operations/diff-dates.js';
import {type FullDate} from '../full-date/full-date-shape.js';

/**
 * Options for {@link toRelativeString}.
 *
 * @category Internal
 */
export type RelativeStringOptions = PartialWithUndefined<{
    /**
     * Set this to `true` to block a "just now" string to be used when the two dates are very close
     * or the duration is very small (or 0).
     *
     * @default false // (`'just now'` is used)
     * @see `RelativeStringOptions.justNowThresholds`
     */
    blockJustNow: boolean;
    /**
     * Set this to `true` to only use the largest selected unit with a non-zero value. Otherwise,
     * the output string will contain all selected non-zero units.
     *
     * @default false
     */
    useOnlyLargestUnit: boolean;
    /**
     * Any values below this will trigger "just now".
     *
     * @default `defaultJustNowThresholds`
     * @see {@link defaultJustNowThresholds} .
     */
    justNowThresholds: AnyDuration;
    /**
     * The separator between each unit.
     *
     * @default ', '
     */
    sep: string;
    /**
     * By default, when `blockJustNow` is `true` and there is no duration to print (the diff is 0),
     * this will return the smallest selected unit set to 0 and use "0 <unit> ago". Set this
     * property to `true` to instead use "in 0 <unit>".
     *
     * @default false
     */
    useFutureWhenNothing: boolean;
    /**
     * If `true`, unit names are abbreviated.
     *
     * @default false
     */
    abbreviate: boolean;
    /**
     * Customize translations. If this is not provided, or any property is missing, the default
     * english phrases will be used.
     */
    i18n: Partial<{
        /** Creates past relative strings like "5 seconds ago". */
        timeAgo(
            /**
             * This will look like "5 seconds" or "1 year", translated to the configured locale (or
             * the user's current locale.
             */
            unitString: string,
        ): string;
        /** Creates future relative strings like "in 5 seconds". */
        timeIn(
            /**
             * This will look like "5 seconds" or "1 year", translated to the configured locale (or
             * the user's current locale.
             */
            unitString: string,
        ): string;
        /** The string to be used when "just now" is chosen. */
        justNow: string;
    }>;
}> &
    RequiredAndNotNull<RoundOptions> &
    LocaleOptions;

const defaultRelativeStringI18n: Required<NonNullable<RelativeStringOptions['i18n']>> = {
    justNow: 'just now',
    timeAgo(unitString) {
        return `${unitString} ago`;
    },
    timeIn(unitString) {
        return `in ${unitString}`;
    },
};

/**
 * Default value for `RelativeStringOptions.justNowThresholds`.
 *
 * @category Internal
 */
export const defaultJustNowThresholds: AnyDuration = {
    minutes: 1.5,
    seconds: 5,
    milliseconds: 200,
};

/**
 * This function starts with a duration (either by being directly passed a duration or by diffing
 * two dates into a duration) and converts that duration into a relative string like "1 month ago"
 * or "in 1 month". Rounding is automatically set to 0 decimal points, but that can be changed.
 *
 * When extremely close to a `0` difference, the output string will be `'just now'`, which can be
 * disabled.
 *
 * @category Formatting
 * @example
 *
 * ```ts
 * import {toRelativeString, selectAllDurationUnits} from 'date-vir';
 *
 * toRelativeString({days: 1.6}, {days: true}); // `'in 2 days'`
 * toRelativeString({days: 1.6}, {days: true, hours: true}); // `'in 1 day, 14 hours'`
 * toRelativeString({seconds: 1}, selectAllDurationUnits); // `'just now'`
 * ```
 *
 * @throws If no units are selected
 */
export function toRelativeString(
    datesOrDuration:
        | Readonly<{
              start: Readonly<FullDate>;
              end: Readonly<FullDate>;
          }>
        | Readonly<AnyDuration>,
    /** The units to use in the relative string. */
    units: Readonly<DurationUnitSelection>,
    options: Readonly<RelativeStringOptions>,
): string {
    /**
     * Don't use Luxon's implementation of this (`DateTime.toRelative()`) because it's a hopeless
     * mess.
     */

    const smallestToLargestSelectedUnit = flattenUnitsSmallestToLargest(units);
    const smallestSelectedUnit = smallestToLargestSelectedUnit[0];
    const largestToSmallestSelectedUnit = smallestToLargestSelectedUnit.toReversed();
    if (smallestSelectedUnit == undefined) {
        throw new Error('No units selected for relative string.');
    }

    const diff = getRelativeStringDiff({
        datesOrDuration,
        options,
        units,
        largestToSmallestSelectedUnit,
    });

    const unitCounts: Partial<Record<DurationUnit, number>> = {};
    const isDiffPositive =
        convertDuration(diff, {
            milliseconds: true,
        }).milliseconds >= 0;

    largestToSmallestSelectedUnit.forEach((unit) => {
        if (options.useOnlyLargestUnit && Object.keys(unitCounts).length) {
            return;
        }

        const unitCount: number = diff[unit] || 0;

        if (unitCount) {
            unitCounts[unit] = unitCount;
        }
    });

    const shouldUseJustNow = determineShouldUseJustNow({
        options,
        smallestSelectedUnit,
        unitCounts,
    });

    const i18n: typeof defaultRelativeStringI18n = {
        ...defaultRelativeStringI18n,
        ...options.i18n,
    };

    if (shouldUseJustNow) {
        return i18n.justNow;
    } else if (Object.keys(unitCounts).length) {
        const unitStrings = filterMap(
            largestToSmallestSelectedUnit,
            (unit) => {
                const unitCount = unitCounts[unit];
                if (unitCount) {
                    return getDateUnitString({
                        count: Math.abs(unitCount),
                        unit,
                        locale: options.locale,
                        abbreviate: options.abbreviate,
                        decimalCount: options.decimalCount,
                    });
                } else {
                    return undefined;
                }
            },
            check.isTruthy,
        );

        const allUnitStrings = unitStrings.join(options.sep ?? ', ');

        if (isDiffPositive) {
            return i18n.timeIn(allUnitStrings);
        } else {
            return i18n.timeAgo(allUnitStrings);
        }
    } else {
        const unitString = getDateUnitString({
            count: 0,
            unit: smallestSelectedUnit,
            locale: options.locale,
            abbreviate: options.abbreviate,
            decimalCount: options.decimalCount,
        });

        if (options.useFutureWhenNothing) {
            return i18n.timeIn(unitString);
        } else {
            return i18n.timeAgo(unitString);
        }
    }
}

function getRelativeStringDiff({
    datesOrDuration,
    units,
    options,
    largestToSmallestSelectedUnit,
}: {
    datesOrDuration:
        | Readonly<{
              start: Readonly<FullDate>;
              end: Readonly<FullDate>;
          }>
        | Readonly<AnyDuration>;
    units: Readonly<DurationUnitSelection>;
    largestToSmallestSelectedUnit: DurationUnit[];
    options: Readonly<
        SelectFrom<RelativeStringOptions, {useOnlyLargestUnit: true; decimalCount: true}>
    >;
}): AnyDuration {
    if (options.useOnlyLargestUnit) {
        return findLargestDiff({
            datesOrDuration,
            largestToSmallestSelectedUnit,
            options,
        });
    } else {
        return createDiff(
            datesOrDuration,
            {
                decimalCount: undefined,
            },
            units,
        );
    }
}

function createDiff(
    datesOrDuration:
        | Readonly<{
              start: Readonly<FullDate>;
              end: Readonly<FullDate>;
          }>
        | Readonly<AnyDuration>,
    options: Readonly<RoundOptions> | undefined,
    units: Readonly<DurationUnitSelection>,
) {
    return 'start' in datesOrDuration
        ? diffDates(datesOrDuration, units, options)
        : convertDuration(datesOrDuration, units, options);
}

function findLargestDiff({
    datesOrDuration,
    options,
    largestToSmallestSelectedUnit,
}: {
    datesOrDuration:
        | Readonly<{
              start: Readonly<FullDate>;
              end: Readonly<FullDate>;
          }>
        | Readonly<AnyDuration>;
    largestToSmallestSelectedUnit: DurationUnit[];
    options: Readonly<
        SelectFrom<RelativeStringOptions, {useOnlyLargestUnit: true; decimalCount: true}>
    >;
}): AnyDuration {
    for (const unit of largestToSmallestSelectedUnit) {
        const innerDiff: AnyDuration = createDiff(datesOrDuration, options, {
            [unit]: true,
        });
        /* node:coverage disable: the `|| 0` fallback isn't reachable since we always request `unit`. */
        const roundedValue = Math.abs(innerDiff[unit] || 0);
        /* node:coverage enable */

        if (!roundedValue) {
            continue;
        }

        /**
         * When rounding pushes a fractional value (< 1) up to an integer >= 1 it inflates the
         * displayed unit (e.g. 0.67 years becomes "1 year" for an 8-month duration). Require the
         * unrounded value to be close enough to the integer (>= 0.9, matching `roundNarrow`) before
         * accepting the promotion. Values that already round below 1 (like 0.1 days with
         * `decimalCount: 1`) still qualify.
         */
        if (roundedValue >= 1) {
            const unroundedDiff = createDiff(
                datesOrDuration,
                {
                    decimalCount: undefined,
                },
                {
                    [unit]: true,
                },
            );
            /* node:coverage disable: the `|| 0` fallback isn't reachable since we always request `unit`. */
            const unroundedValue = Math.abs(unroundedDiff[unit] || 0);
            /* node:coverage enable */
            if (unroundedValue < 0.9) {
                continue;
            }
        }

        return innerDiff;
    }

    return {};
}

function determineShouldUseJustNow({
    options,
    smallestSelectedUnit,
    unitCounts,
}: {
    smallestSelectedUnit: DurationUnit;
    unitCounts: Partial<Record<DurationUnit, number>>;
    options: Readonly<
        SelectFrom<
            RelativeStringOptions,
            {
                justNowThresholds: true;
                blockJustNow: true;
            }
        >
    >;
}): boolean {
    if (options.blockJustNow) {
        return false;
    }

    const thresholds: AnyDuration = {
        ...defaultJustNowThresholds,
        ...options.justNowThresholds,
    };

    if (!(smallestSelectedUnit in thresholds) || Object.keys(unitCounts).length > 1) {
        return false;
    } else if (!Object.keys(unitCounts).length || smallestSelectedUnit in unitCounts) {
        /* node:coverage disable: these fallbacks aren't required at runtime but are required for type safety. */
        /**
         * We've already verify that `smallestSelectedUnit` is in `thresholds` so the `|| 0`
         * fallback is safe.
         */
        const unitThreshold: number = thresholds[smallestSelectedUnit] || 0;
        /**
         * We've already verify that `smallestSelectedUnit` is in `unitCounts` so the `|| 0`
         * fallback is safe.
         */
        const unitValue: number = unitCounts[smallestSelectedUnit] || 0;
        /* node:coverage enable */

        return unitValue <= unitThreshold;
    }

    return false;
}
