import {isValidShape} from 'object-shape-tester';
import type {FullDatePart} from '../full-date/full-date-parts.js';
import {
    DatePart,
    FullDate,
    TimePart,
    datePartShape,
    timePartShape,
} from '../full-date/full-date-shape.js';
import type {Timezone} from '../timezone/timezones.js';

/**
 * An object containing date and/or time parts or neither. Used for {@link combineDateParts}
 *
 * @category Internal
 */
export type MaybeDateParts<SpecificTimezone extends Timezone> = Partial<{
    [FullDatePart.Date]:
        | DatePart<SpecificTimezone>
        | undefined
        | Partial<FullDate<SpecificTimezone>>;
    [FullDatePart.Time]:
        | TimePart<SpecificTimezone>
        | undefined
        | Partial<FullDate<SpecificTimezone>>;
}>;

/**
 * A full date, time or date parts of a date, or undefined. Used for {@link combineDateParts}.
 *
 * @category Internal
 */
export type MaybeDatePart<SpecificTimezone extends Timezone> =
    | FullDate<SpecificTimezone>
    | Partial<FullDate<SpecificTimezone>>
    | DatePart<SpecificTimezone>
    | TimePart<SpecificTimezone>
    | undefined;

export function combineDateParts<const SpecificTimezone extends Timezone>(maybeDateParts: {
    [FullDatePart.Date]: DatePart<SpecificTimezone>;
    [FullDatePart.Time]: TimePart<SpecificTimezone>;
}): FullDate<SpecificTimezone>;
export function combineDateParts(maybeDateParts: {
    [FullDatePart.Date]?: undefined;
    [FullDatePart.Time]?: undefined;
}): undefined;
export function combineDateParts<const SpecificTimezone extends Timezone>(maybeDateParts: {
    [FullDatePart.Date]: DatePart<SpecificTimezone>;
    [FullDatePart.Time]?: undefined;
}): DatePart<SpecificTimezone>;
export function combineDateParts<const SpecificTimezone extends Timezone>(maybeDateParts: {
    [FullDatePart.Date]: DatePart<SpecificTimezone>;
    [FullDatePart.Time]?:
        | TimePart<SpecificTimezone>
        | undefined
        | Partial<FullDate<SpecificTimezone>>;
}): FullDate<SpecificTimezone> | DatePart<SpecificTimezone>;
export function combineDateParts<const SpecificTimezone extends Timezone>(maybeDateParts: {
    [FullDatePart.Date]?: undefined;
    [FullDatePart.Time]: TimePart<SpecificTimezone>;
}): TimePart<SpecificTimezone>;
export function combineDateParts<const SpecificTimezone extends Timezone>(maybeDateParts: {
    [FullDatePart.Date]?:
        | DatePart<SpecificTimezone>
        | undefined
        | Partial<FullDate<SpecificTimezone>>;
    [FullDatePart.Time]: TimePart<SpecificTimezone>;
}): FullDate<SpecificTimezone> | TimePart<SpecificTimezone>;
export function combineDateParts<const SpecificTimezone extends Timezone>(
    maybeDateParts: MaybeDateParts<SpecificTimezone>,
): MaybeDatePart<SpecificTimezone>;
/**
 * Combine two parts of a {@link FullDate} objects into a filled-in {@link FullDate}. Note that the
 * timezones must match for both inputs. If two complete {@link FullDate} objects are passed in, only
 * the respective parts of each is used.
 *
 * @category Util
 */
export function combineDateParts<const SpecificTimezone extends Timezone>(
    maybeDateParts: MaybeDateParts<SpecificTimezone>,
): MaybeDatePart<SpecificTimezone> {
    const timePart: TimePart<SpecificTimezone> | undefined = isValidShape(
        maybeDateParts.time,
        timePartShape,
        {
            allowExtraKeys: true,
        },
    )
        ? {
              hour: maybeDateParts.time.hour,
              minute: maybeDateParts.time.minute,
              second: maybeDateParts.time.second,
              millisecond: maybeDateParts.time.millisecond,
              timezone: maybeDateParts.time.timezone,
          }
        : undefined;

    const datePart: DatePart<SpecificTimezone> | undefined = isValidShape(
        maybeDateParts.date,
        datePartShape,
        {
            allowExtraKeys: true,
        },
    )
        ? {
              year: maybeDateParts.date.year,
              month: maybeDateParts.date.month,
              day: maybeDateParts.date.day,
              timezone: maybeDateParts.date.timezone,
          }
        : undefined;

    if (timePart && datePart) {
        if (timePart.timezone !== datePart.timezone) {
            throw new Error(
                `Time and date parts have mismatching timezones. Got '${timePart.timezone}' and '${datePart.timezone}'.`,
            );
        }

        return {
            ...timePart,
            ...datePart,
        };
    }

    if (timePart) {
        return timePart;
    }
    if (datePart) {
        return datePart;
    }

    return undefined;
}
