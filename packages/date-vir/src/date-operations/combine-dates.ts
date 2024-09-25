import {isValidShape} from 'object-shape-tester';
import {
    DatePart,
    FullDate,
    FullDatePartEnum,
    TimePart,
    datePartShape,
    timePartShape,
} from '../full-date/full-date-shape.js';
import {Timezone} from '../timezone/timezone-names.js';

/** An object containing date and/or time parts or neither. */
type MaybeDateParts<SpecificTimezone extends Timezone> = Partial<{
    [FullDatePartEnum.Date]:
        | DatePart<SpecificTimezone>
        | undefined
        | Partial<FullDate<SpecificTimezone>>;
    [FullDatePartEnum.Time]:
        | TimePart<SpecificTimezone>
        | undefined
        | Partial<FullDate<SpecificTimezone>>;
}>;

/** A full date, time or date parts of a date, or undefined. */
export type MaybeDatePart<SpecificTimezone extends Timezone> =
    | FullDate<SpecificTimezone>
    | Partial<FullDate<SpecificTimezone>>
    | DatePart<SpecificTimezone>
    | TimePart<SpecificTimezone>
    | undefined;

export function combineDateParts<const SpecificTimezone extends Timezone>(maybeDateParts: {
    [FullDatePartEnum.Date]: DatePart<SpecificTimezone>;
    [FullDatePartEnum.Time]: TimePart<SpecificTimezone>;
}): FullDate<SpecificTimezone>;
export function combineDateParts(maybeDateParts: {
    [FullDatePartEnum.Date]?: undefined;
    [FullDatePartEnum.Time]?: undefined;
}): undefined;
export function combineDateParts<const SpecificTimezone extends Timezone>(maybeDateParts: {
    [FullDatePartEnum.Date]: DatePart<SpecificTimezone>;
    [FullDatePartEnum.Time]?: undefined;
}): DatePart<SpecificTimezone>;
export function combineDateParts<const SpecificTimezone extends Timezone>(maybeDateParts: {
    [FullDatePartEnum.Date]: DatePart<SpecificTimezone>;
    [FullDatePartEnum.Time]?:
        | TimePart<SpecificTimezone>
        | undefined
        | Partial<FullDate<SpecificTimezone>>;
}): FullDate<SpecificTimezone> | DatePart<SpecificTimezone>;
export function combineDateParts<const SpecificTimezone extends Timezone>(maybeDateParts: {
    [FullDatePartEnum.Date]?: undefined;
    [FullDatePartEnum.Time]: TimePart<SpecificTimezone>;
}): TimePart<SpecificTimezone>;
export function combineDateParts<const SpecificTimezone extends Timezone>(maybeDateParts: {
    [FullDatePartEnum.Date]?:
        | DatePart<SpecificTimezone>
        | undefined
        | Partial<FullDate<SpecificTimezone>>;
    [FullDatePartEnum.Time]: TimePart<SpecificTimezone>;
}): FullDate<SpecificTimezone> | TimePart<SpecificTimezone>;
export function combineDateParts<const SpecificTimezone extends Timezone>(
    maybeDateParts: MaybeDateParts<SpecificTimezone>,
): MaybeDatePart<SpecificTimezone>;
/**
 * Combine two parts of a FullDate objects into a filled-in FullDate. Note that the timezones must
 * match for both inputs. If two complete FullDate objects are passed in, only the respective parts
 * of each is used.
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
