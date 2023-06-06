import {
    HtmlInputElementTypeEnum,
    createFullDate,
    formatPresets,
    timezones,
    toHtmlInputString,
    toIsoString,
    toLocaleString,
    toTimestamp,
} from '..';

const myFullDate = createFullDate('2023-06-05T14:19:00.870Z', timezones['America/Chicago']);

/**
 * Converts the given FullDate into a UTC unix timestamp with milliseconds. Since the output is a
 * UTC timestamp, the number will be the same even if you convert your FullDate to a different time
 * zone.
 */
toTimestamp(myFullDate); // returns 1685974740870

/**
 * Converts the given FullDate into a UTC ISO string. Since the output is in UTC, even if your
 * FullDate object is shifted to a different timezone, the output of this function will be the
 * same.
 */
toIsoString(myFullDate); // returns '2023-06-05T14:19:00.870Z'

/**
 * Converts the given FullDate to a locale-based formatted string. The second argument, the options
 * argument, is optional and contains many options therein.
 */
toLocaleString(myFullDate, formatPresets.DatetimeFull); // returns 'June 5, 2023 at 9:19 AM CDT' in the en-us locale

/**
 * Formats the given FullDate to a string so that it is ready to be assigned to the value attribute
 * of an <input type="date" /> element.
 */
toHtmlInputString(myFullDate, HtmlInputElementTypeEnum.Date); // returns '2023-06-05'
