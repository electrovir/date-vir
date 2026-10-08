import {applyBrand, type Branded} from '@augment-vir/common';
import {DateUnit, type RoundOptions} from '@date-vir/duration';
import {createCustomShape} from 'object-shape-tester';
import {getStartDate} from '../date-operations/date-position.js';
import {diffDates} from '../date-operations/diff-dates.js';
import {getNowFullDate} from '../extra-utils/now.js';
import {clearTime} from '../extra-utils/zero.js';
import {createUtcFullDate} from '../full-date/create-full-date.js';
import {type FullDate} from '../full-date/full-date-shape.js';
import {type Timezone, utcTimezone} from '../timezone/timezones.js';
import {isValidIsoString, type UtcIsoString} from './string-format-types.js';
import {toUtcIsoString} from './timestamp.js';

/**
 * A calendar day with no time of day and no timezone, stored as a {@link UtcIsoString} at midnight
 * UTC of that day. This matches how database `DATE` columns (such as Prisma's `@db.Date`) are read,
 * so the value passes between a database and an API unchanged.
 *
 * @category ISO
 */
export type DateOnlyUtcIsoString = Branded<UtcIsoString, 'date-only-utc-iso-string'>;

/**
 * Checks if the input is a valid {@link DateOnlyUtcIsoString}: a {@link UtcIsoString} whose time is
 * exactly midnight UTC.
 *
 * @category ISO
 * @category Assertion
 * @example
 *
 * ```ts
 * import {isValidDateOnlyUtcIsoString} from 'date-vir';
 *
 * isValidDateOnlyUtcIsoString('2024-05-01T00:00:00.000Z'); // `true`
 * isValidDateOnlyUtcIsoString('2024-05-01T20:18:17.123Z'); // `false`
 * ```
 */
export function isValidDateOnlyUtcIsoString(input: unknown): input is DateOnlyUtcIsoString {
    return isValidIsoString(input) && toDateOnlyUtcIsoString(createUtcFullDate(input)) === input;
}

/**
 * A shape definition for {@link DateOnlyUtcIsoString}.
 *
 * @category ISO
 */
export const dateOnlyUtcIsoStringShape = createCustomShape<DateOnlyUtcIsoString>({
    default: applyBrand<DateOnlyUtcIsoString>('2000-01-01T00:00:00.000Z'),
    name: 'DateOnlyUtcIsoString',
    checkValue(value) {
        return isValidDateOnlyUtcIsoString(value);
    },
});

/**
 * Converts a {@link FullDate} into the {@link DateOnlyUtcIsoString} of the calendar day it falls on
 * in its own timezone. To get the day in a different timezone, convert the date first with
 * `toNewTimezone`.
 *
 * @category ISO
 * @category Conversion
 * @example
 *
 * ```ts
 * import {TimezoneName, toDateOnlyUtcIsoString} from 'date-vir';
 *
 * toDateOnlyUtcIsoString({
 *     year: 2026,
 *     month: 10,
 *     day: 2,
 *
 *     hour: 23,
 *     minute: 30,
 *     second: 0,
 *     millisecond: 0,
 *
 *     timezone: TimezoneName['America/Denver'],
 * }); // outputs `'2026-10-02T00:00:00.000Z'` (even though this is October 3rd in UTC)
 * ```
 */
export function toDateOnlyUtcIsoString(date: Readonly<FullDate>): DateOnlyUtcIsoString {
    return applyBrand<DateOnlyUtcIsoString>(
        toUtcIsoString({
            ...clearTime(date),
            timezone: utcTimezone,
        }),
    );
}

/**
 * Converts a {@link DateOnlyUtcIsoString} into a {@link FullDate} at the start of that same calendar
 * day in the given timezone. The calendar day never shifts. The start of a day is usually midnight
 * but can be later in timezones that have had a DST transition at midnight.
 *
 * @category ISO
 * @category Conversion
 * @example
 *
 * ```ts
 * import {
 *     createUtcFullDate,
 *     dateOnlyUtcIsoStringToFullDate,
 *     TimezoneName,
 *     toDateOnlyUtcIsoString,
 * } from 'date-vir';
 *
 * const day = toDateOnlyUtcIsoString(createUtcFullDate('2026-10-02T00:00:00.000Z'));
 *
 * dateOnlyUtcIsoStringToFullDate(day, TimezoneName['America/Denver']);
 * // outputs `{year: 2026, month: 10, day: 2, hour: 0, minute: 0, second: 0, millisecond: 0, timezone: 'America/Denver'}`
 * ```
 */
export function dateOnlyUtcIsoStringToFullDate<const SpecificTimezone extends Timezone>(
    dateOnly: DateOnlyUtcIsoString,
    timezone: SpecificTimezone,
): FullDate<SpecificTimezone> {
    return getStartDate(
        {
            ...createUtcFullDate(dateOnly),
            timezone,
        },
        DateUnit.Day,
    );
}

/**
 * Gets today's calendar day in the given timezone as a {@link DateOnlyUtcIsoString}.
 *
 * @category Now
 * @example
 *
 * ```ts
 * import {getTodayDateOnlyUtcIsoString, TimezoneName} from 'date-vir';
 *
 * getTodayDateOnlyUtcIsoString(TimezoneName['America/Denver']);
 * ```
 */
export function getTodayDateOnlyUtcIsoString(timezone: Timezone): DateOnlyUtcIsoString {
    return toDateOnlyUtcIsoString(getNowFullDate(timezone));
}

/**
 * Counts the whole calendar days from `start` to `end`. Negative when `end` is before `start`. Add
 * `1` for an inclusive count of the days in the range.
 *
 * @category Calculation
 * @example
 *
 * ```ts
 * import {createUtcFullDate, diffDateOnlyDays, toDateOnlyUtcIsoString} from 'date-vir';
 *
 * diffDateOnlyDays({
 *     start: toDateOnlyUtcIsoString(createUtcFullDate('2026-10-02T00:00:00.000Z')),
 *     end: toDateOnlyUtcIsoString(createUtcFullDate('2026-10-05T00:00:00.000Z')),
 * }); // outputs `3`
 * ```
 */
export function diffDateOnlyDays(
    {
        start,
        end,
    }: Readonly<{
        start: DateOnlyUtcIsoString;
        end: DateOnlyUtcIsoString;
    }>,
    options: Readonly<RoundOptions> = {},
): number {
    return diffDates(
        {
            start: createUtcFullDate(start),
            end: createUtcFullDate(end),
        },
        {
            days: true,
        },
        options,
    ).days;
}
