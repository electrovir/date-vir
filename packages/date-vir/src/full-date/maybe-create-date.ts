import {type Timezone} from '../timezone/timezones.js';
import {createFullDate} from './create-full-date.js';
import {type DateLike} from './date-like.js';
import {type FullDate} from './full-date-shape.js';

/**
 * Parses the given {@link DateLike} and converts it into a {@link FullDate} instance with the given
 * timezone. If the conversion fails or the input {@link DateLike} is empty, `undefined` is
 * returned.
 */
export function maybeCreateFullDate<const SpecificTimezone extends Timezone>(
    /** The original date representation to be converted into a FullDate. */
    dateLike: Readonly<DateLike> | undefined | null,
    /** The timezone that this date/time is meant for / originated from. */
    timezone: SpecificTimezone,
): FullDate<SpecificTimezone> | undefined {
    if (!dateLike) {
        return undefined;
    }
    try {
        return createFullDate(dateLike, timezone);
    } catch {
        return undefined;
    }
}
