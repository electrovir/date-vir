import {DateTime} from 'luxon';

/**
 * A string that represents only date parts of a date. It's intended to be used like this:
 * year-month-day.
 *
 * @category Internal
 */
export type JustDateString = `${number}-${number}-${number}`;
/**
 * A string that represents only time parts of a date, with seconds. It's intended to be used like
 * this: hour:minute:seconds.
 *
 * @category Internal
 */
export type JustTimeWithSecondsString = `${number}:${number}:${number}`;
/**
 * A string that represents only time parts of a date, without seconds. It's intended to be used
 * like this: hour:minute.
 *
 * @category Internal
 */
export type JustTimeString = `${number}:${number}`;

// cspell:ignore dayThour

/**
 * A string that represents date and time parts of a date, with seconds. It's intended to be used
 * like this: year-month-dayThour:minute:seconds.
 *
 * @category Internal
 */
export type DateTimeWithSeconds = `${JustDateString}T${JustTimeWithSecondsString}`;
/**
 * A string that represents date and time parts of a date, without seconds. It's intended to be used
 * like this: year-month-dayThour:minute.
 *
 * @category Internal
 */
export type DateTimeString = `${JustDateString}T${JustTimeString}`;
// cspell:ignore DDTHH
/**
 * A full UTC ISO date time string: YYYY-MM-DDTHH:mm:ss.sssZ.
 *
 * @category ISO
 * @see
 * - https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date-time-string-format
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format
 */
export type UtcIsoString = `${JustDateString}T${JustTimeWithSecondsString}.${number}Z`;

/**
 * Checks if the input is a valid UTC ISO string and type guards the input.
 *
 * @category ISO
 * @category Assertion
 * @example
 *
 * ```ts
 * import {isValidIsoString} from 'date-vir';
 *
 * isValidIsoString('no'); // `false`
 * isValidIsoString('2024-05-01T20:18:17.123Z'); // `true`
 * ```
 */
export function isValidIsoString(input: unknown): input is UtcIsoString {
    const datetime = DateTime.fromISO(input as any);
    return datetime.toUTC().toISO() === input;
}
