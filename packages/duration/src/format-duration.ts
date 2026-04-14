import {type AnyDuration} from './duration.js';
import {type LocaleOptions} from './locale.js';
import {type RoundOptions} from './round-options.js';
import {getDateUnitString} from './units/date-unit.js';
import {type DurationUnit, orderedDurationUnits} from './units/duration-unit.js';

/**
 * Options for {@link formatDuration}.
 *
 * @category Internal
 */
export type FormatDurationOptions = {
    /**
     * The separator between each unit string.
     *
     * @default ' '
     */
    sep?: string | undefined;
    /**
     * If `true`, only the largest unit with a defined value is included in the output.
     *
     * @default false
     */
    onlyLargestUnit?: boolean | undefined;
    /**
     * If `true`, unit names are abbreviated.
     *
     * @default false
     */
    abbreviate?: boolean | undefined;
} & LocaleOptions &
    RoundOptions;

/**
 * Formats a duration into a human-readable string by converting each defined unit via
 * {@link getDateUnitString}. Units are ordered from largest to smallest.
 *
 * @category Language
 * @example
 *
 * ```ts
 * import {formatDuration} from '@date-vir/duration';
 *
 * formatDuration({hours: 3, minutes: 30}); // '3 hours, 30 minutes'
 * formatDuration({seconds: 4}); // '4 seconds'
 * formatDuration({days: 1, hours: 2}, {sep: ' and '}); // '1 day and 2 hours'
 * ```
 */
export function formatDuration(
    duration: Readonly<AnyDuration>,
    options?: Readonly<FormatDurationOptions>,
): string {
    const unitStrings: string[] = [];

    orderedDurationUnits.toReversed().forEach((unit: DurationUnit) => {
        if (options?.onlyLargestUnit && unitStrings.length) {
            return;
        }

        const count = duration[unit];
        if (count) {
            if (options?.onlyLargestUnit) {
                const decimalMultiplier = 10 ** (options.decimalCount || 0);
                const roundedCount = Math.round(count * decimalMultiplier) / decimalMultiplier;
                if (!roundedCount) {
                    return;
                }
            }
            unitStrings.push(
                getDateUnitString({
                    count,
                    unit,
                    locale: options?.locale,
                    abbreviate: options?.abbreviate,
                    decimalCount: options?.decimalCount,
                }),
            );
        }
    });

    return unitStrings.join(options?.sep ?? ' ');
}
