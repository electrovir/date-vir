import {type AnyDuration} from './duration.js';

/**
 * Negates all properties in a duration.
 *
 * @category Duration
 * @example
 *
 * ```ts
 * import {negateDuration} from 'date-vir';
 *
 * negateDuration({hours: -1, minutes: 5, seconds: 35});
 * // `{hours: 1, minutes: -5, seconds: -35}`
 * ```
 */
export function negateDuration<const Duration extends Readonly<AnyDuration>>(
    duration: Duration,
): Duration {
    return Object.fromEntries(
        Object.entries(duration).map(
            ([
                key,
                value,
            ]) => [
                key,
                value == undefined ? undefined : value * -1,
            ],
        ),
    ) as Duration;
}
