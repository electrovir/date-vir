import {check} from '@augment-vir/assert';
import {DateTime} from 'luxon';
import {Timezone} from '../timezone/timezones.js';
import {createFullDate} from './create-full-date.js';
import {FullDate} from './full-date-shape.js';
import {parseLuxonDateTime} from './luxon-date-time-conversion.js';

/**
 * Parses any date string into a {@link FullDate} using the specified pattern and timezone. Prefer
 * using {@link createFullDate} if possible.
 *
 * Since this supports any arbitrary date string pattern, it is more flexible than
 * {@link createFullDate} but you must know the date pattern ahead of time.
 *
 * The `formatString` input is passed to Luxon. All format pattern options are listed here:
 * https://moment.github.io/luxon/#/parsing?id=table-of-tokens
 *
 * @category FullDate
 */
export function parseDateStringWithPattern<const SpecificTimezone extends Timezone>({
    dateString,
    formatString,
    timezone,
}: {
    /** The date string to be parsed. */
    dateString: string;
    /**
     * The format string that should match Luxon's expectations here:
     * https://moment.github.io/luxon/#/parsing?id=table-of-tokens
     */
    formatString: string;
    /** The timezone that this date/time is meant for / originated from. */
    timezone: SpecificTimezone;
}): FullDate<SpecificTimezone> {
    try {
        const dateTime = DateTime.fromFormat(dateString, formatString, {
            zone: timezone,
            setZone: true,
        });

        return parseLuxonDateTime(dateTime);
    } catch {
        throw new Error(`Failed to parse string '${dateString}' with format '${formatString}'`);
    }
}

/**
 * Read either an `HTMLInputElement`'s value directly, or the value string retrieved from an
 * `HTMLInputElement`. Handles both `type="date"` and `type="time"` <input> elements.
 *
 * @category FullDate
 * @category HTML
 */
export function parseInputElementValue<const SpecificTimezone extends Timezone>(
    elementOrValue: Readonly<Pick<HTMLInputElement, 'value'>> | string | null | undefined,
    timezone: SpecificTimezone,
): FullDate<SpecificTimezone> | undefined {
    if (!elementOrValue) {
        return undefined;
    }

    const value: string = check.isString(elementOrValue) ? elementOrValue : elementOrValue.value;

    try {
        return createFullDate(value, timezone);
    } catch {
        return undefined;
    }
}
