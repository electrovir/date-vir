import {isRuntimeTypeOf} from '@augment-vir/common';
import {DateTime} from 'luxon';
import {Timezone} from '../timezone/timezone-names';
import {createFullDate} from './create-full-date';
import {FullDate} from './full-date-shape';
import {parseLuxonDateTime} from './luxon-date-time-conversion';

/**
 * Parses any strangely formatted dateString using the given formatString and timezone.
 *
 * This is much more flexible than createFullDate but createFullDate should be preferred in
 * situations where it works.
 *
 * The formatString input is passed to Luxon. All format options are listed here:
 * https://moment.github.io/luxon/#/parsing?id=table-of-tokens
 */
export function parseStrangeString({
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
    timezone: Timezone;
}): FullDate {
    try {
        const dateTime = DateTime.fromFormat(dateString, formatString, {
            zone: timezone,
            setZone: true,
        });

        return parseLuxonDateTime(dateTime);
    } catch (error) {
        throw new Error(`Failed to parse string '${dateString}' with format '${formatString}'`);
    }
}

/**
 * Read either an HTMLInputElement's value directly, or the value string retrieved from an
 * HTMLInputElement. Handles both type="date" and type="time" <input> elements.
 */
export function parseInputElementValue(
    elementOrValue: HTMLInputElement | string | null | undefined,
    timezone: Timezone,
): FullDate | undefined {
    if (!elementOrValue) {
        return undefined;
    }

    const value: string = isRuntimeTypeOf(elementOrValue, 'string')
        ? elementOrValue
        : elementOrValue.value;

    try {
        return createFullDate(value, timezone);
    } catch (error) {
        return undefined;
    }
}
