import {isValidShape} from 'object-shape-tester';
import {
    DatePart,
    FullDate,
    FullDatePartEnum,
    TimePart,
    datePartShape,
    timePartShape,
} from '../full-date/full-date-shape';

type MaybeDateParts = Partial<{
    [FullDatePartEnum.Date]: DatePart | undefined | Partial<FullDate>;
    [FullDatePartEnum.Time]: TimePart | undefined | Partial<FullDate>;
}>;

export type MaybeDatePart = FullDate | Partial<FullDate> | DatePart | TimePart | undefined;

/**
 * Combine two parts of a FullDate objects into a filled-in FullDate. Note that the timezones must
 * match for both inputs. If two complete FullDate objects are passed in, only the respective parts
 * of each is used.
 */
export function combineDateParts(maybeDateParts: {
    [FullDatePartEnum.Date]: DatePart;
    [FullDatePartEnum.Time]: TimePart;
}): FullDate;
export function combineDateParts(maybeDateParts: {
    [FullDatePartEnum.Date]?: undefined;
    [FullDatePartEnum.Time]?: undefined;
}): undefined;
export function combineDateParts(maybeDateParts: {
    [FullDatePartEnum.Date]: DatePart;
    [FullDatePartEnum.Time]?: undefined;
}): DatePart;
export function combineDateParts(maybeDateParts: {
    [FullDatePartEnum.Date]: DatePart;
    [FullDatePartEnum.Time]?: TimePart | undefined | Partial<FullDate>;
}): FullDate | DatePart;
export function combineDateParts(maybeDateParts: {
    [FullDatePartEnum.Date]?: undefined;
    [FullDatePartEnum.Time]: TimePart;
}): TimePart;
export function combineDateParts(maybeDateParts: {
    [FullDatePartEnum.Date]?: DatePart | undefined | Partial<FullDate>;
    [FullDatePartEnum.Time]: TimePart;
}): FullDate | TimePart;
export function combineDateParts(maybeDateParts: MaybeDateParts): MaybeDatePart;
export function combineDateParts(maybeDateParts: MaybeDateParts): MaybeDatePart {
    const timePart: TimePart | undefined = isValidShape(maybeDateParts.time, timePartShape, {
        allowExtraKeys: true,
    })
        ? {
              hour: maybeDateParts.time.hour,
              minute: maybeDateParts.time.minute,
              second: maybeDateParts.time.second,
              millisecond: maybeDateParts.time.millisecond,
              timezone: maybeDateParts.time.timezone,
          }
        : undefined;

    const datePart: DatePart | undefined = isValidShape(maybeDateParts.date, datePartShape, {
        allowExtraKeys: true,
    })
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
