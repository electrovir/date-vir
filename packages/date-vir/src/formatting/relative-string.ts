import {check} from '@augment-vir/assert';
import {arrayToObject, filterMap, type PartialWithUndefined} from '@augment-vir/common';
import {
    AnyDuration,
    DurationUnit,
    DurationUnitSelection,
    convertDuration,
    flattenUnitSelection,
    singularDurationUnitNames,
} from '@date-vir/duration';
import {diffDates} from '../date-operations/diff-dates.js';
import {FullDate} from '../full-date/full-date-shape.js';

/**
 * Options for {@link toRelativeString}.
 *
 * @category Internal
 */
export type RelativeStringOptions = PartialWithUndefined<{
    /**
     * Set this to `true` to prevent the `'just now'` relative string from being used when the two
     * dates are very close.
     *
     * @default false // (`'just now'` is used)
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
     * The number of decimals to allow for each duration unit's value.
     *
     * @default 0
     */
    allowedDecimals: number;
    /**
     * Any values below this will trigger "just now".
     *
     * @default {
     *
     *         minutes: 1.5,
     *         seconds: 5,
     *         milliseconds: 500,
     * }
     */
    justNowThresholds: {
        minutes: number;
        seconds: number;
        milliseconds: number;
    };
}>;

const defaultJustNowThresholds: NonNullable<RelativeStringOptions['justNowThresholds']> = {
    minutes: 1.5,
    seconds: 5,
    milliseconds: 500,
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
 */
export function toRelativeString(
    datesOrDuration:
        | Readonly<{
              start: Readonly<FullDate>;
              end: Readonly<FullDate>;
          }>
        | Readonly<AnyDuration>,
    units: Readonly<DurationUnitSelection>,
    options: Readonly<RelativeStringOptions> = {},
): string {
    const selectedUnits = flattenUnitSelection(units);
    /** If there are no selected units, return nothing. */
    if (!check.isLengthAtLeast(selectedUnits, 1)) {
        return '';
    }

    const diff: AnyDuration = convertDuration(
        'start' in datesOrDuration ? diffDates(datesOrDuration, units) : datesOrDuration,
        units,
        {
            roundToDigits: options.allowedDecimals || 0,
        },
    );
    const isDiffPositive = convertDuration(diff, {milliseconds: true}).milliseconds >= 0;

    const unitValues = filterMap(
        selectedUnits,
        (unit) => {
            const quantity = diff[unit] || 0;

            if (!quantity) {
                return undefined;
            }

            return {
                quantity,
                unit,
            };
        },
        check.isTruthy,
    ).reverse();

    const justNowThresholds = options.justNowThresholds || defaultJustNowThresholds;

    const shouldUseJustNow =
        !options.blockJustNow &&
        (!check.isLengthAtLeast(unitValues, 1) ||
            (unitValues[0].unit === DurationUnit.Minutes &&
                /* node:coverage ignore next 1 */
                Math.abs(diff.minutes || 0) < justNowThresholds.minutes) ||
            (unitValues[0].unit === DurationUnit.Seconds &&
                /* node:coverage ignore next 1 */
                Math.abs(diff.seconds || 0) < justNowThresholds.seconds) ||
            (unitValues[0].unit === DurationUnit.Milliseconds &&
                /* node:coverage ignore next 1 */
                Math.abs(diff.milliseconds || 0) < justNowThresholds.milliseconds));

    if (shouldUseJustNow) {
        return 'just now';
    } else if (options.useOnlyLargestUnit) {
        if (!unitValues[0]) {
            return '';
        }

        return toRelativeString(
            datesOrDuration,
            {[unitValues[0].unit]: true},
            {
                ...options,
                useOnlyLargestUnit: false,
            },
        );
    } else if (unitValues.length < selectedUnits.length) {
        /**
         * If the finalized units are less than the selected units, rerun the whole calculation to
         * make sure we're using the right accuracy.
         */
        return toRelativeString(
            datesOrDuration,
            arrayToObject(unitValues, ({unit}) => {
                return {
                    key: unit,
                    value: true,
                };
            }),
            options,
        );
    }

    const unitsString = unitValues
        .map(({quantity, unit}) => {
            const absoluteQuantity = Math.abs(quantity);

            return [
                absoluteQuantity,
                ' ',
                singularDurationUnitNames[unit],
                absoluteQuantity > 1 ? 's' : '',
            ].join('');
        })
        .join(', ');

    if (isDiffPositive) {
        return [
            'in',
            unitsString,
        ].join(' ');
    } else {
        return [
            unitsString,
            'ago',
        ].join(' ');
    }
}
