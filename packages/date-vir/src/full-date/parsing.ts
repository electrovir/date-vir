import {check} from '@augment-vir/assert';
import {DateTime} from 'luxon';
import {Timezone} from '../timezone/timezones.js';
import {createFullDate} from './create-full-date.js';
import {FullDate} from './full-date-shape.js';
import {parseLuxonDateTime} from './luxon-date-time-conversion.js';

/**
 * Parses any strangely formatted dateString using the given formatString and timezone.
 *
 * This is much more flexible than `createFullDate but `createFullDate` should be preferred in
 * situations where it works.
 *
 * The `formatString` input is passed to Luxon. All format options are listed here:
 * https://moment.github.io/luxon/#/parsing?id=table-of-tokens
 *
 * @category Util
 */
export function parseStrangeString<const SpecificTimezone extends Timezone>({
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
