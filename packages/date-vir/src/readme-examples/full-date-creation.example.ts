import {
    createFullDate,
    getNowFullDate,
    parseInputElementValue,
    parseStrangeString,
    timezones,
} from '../index.js';

/**
 * Creates a FullDate from a wide range of possible inputs. See TypeScript types for full details on
 * available inputs.
 */
createFullDate('2023-06-05', timezones['Europe/Rome']);

/** Get the current date and time right now in the given timezone. */
getNowFullDate(timezones['America/Argentina/Buenos_Aires']);

/**
 * Parsed the value of an <input> element directly from the element itself. This is intended to be
 * used for type="date" or type="time" <input> elements, but any input element with a valid date or
 * time string will work.
 */
parseInputElementValue(document.querySelector('input'), timezones['Asia/Tokyo']);

/**
 * If you have a really oddly formatted date/time string and createFullDate does not suffice, you
 * can have full parsing control using this function. Luxon is used under the hood for this parsing,
 * so you can see all the formatString options in its docs:
 * https://moment.github.io/luxon/#/parsing?id=table-of-tokens
 */
parseStrangeString({
    dateString: '870-0-14-19 5 2023 6',
    formatString: 'S-s-h-m d yyyy M',
    timezone: timezones['America/Cancun'],
});
