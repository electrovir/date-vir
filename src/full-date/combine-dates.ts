import {DatePart, FullDate, FullDatePartEnum, TimePart} from './full-date-shape';

/**
 * Combine two parts of a FullDate objects into a filled-in FullDate. Note that the timezone is
 * taken from the time part. If two complete FullDate objects are passed in, only the respective
 * parts of each is used.
 */
export function combineDateParts(partialDates: {
    [FullDatePartEnum.Date]: DatePart;
    [FullDatePartEnum.Time]: TimePart;
}): FullDate {
    return {
        hour: partialDates[FullDatePartEnum.Time].hour,
        minute: partialDates[FullDatePartEnum.Time].minute,
        second: partialDates[FullDatePartEnum.Time].second,
        millisecond: partialDates[FullDatePartEnum.Time].millisecond,
        timezone: partialDates[FullDatePartEnum.Time].timezone,

        year: partialDates[FullDatePartEnum.Date].year,
        month: partialDates[FullDatePartEnum.Date].month,
        day: partialDates[FullDatePartEnum.Date].day,
    };
}
