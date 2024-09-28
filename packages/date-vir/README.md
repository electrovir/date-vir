# date-vir

Easy dates and times with explicit timezones (and typed timezones).

Full docs: http://electrovir.github.io/date-vir

`date-vir` revolves around its `FullDate` type. `FullDate` includes all the information you need to correctly pinpoint _and_ format a given point in time. Most notably, `FullDate` always includes a `timezone` property, so you _always_ know what timezone the date was originally defined in, or what timezone the date is intended to be used in:

<!-- example-link: src/readme-examples/full-date.example.ts -->

```TypeScript
import {FullDate, utcTimezone} from 'date-vir';

const myDate: FullDate = {
    year: 2023,
    month: 6,
    day: 5,

    hour: 5,
    minute: 23,
    second: 27,
    millisecond: 652,

    timezone: utcTimezone,
};
```

## Creating a FullDate

Several functions are available for creating `FullDate` objects:

<!-- example-link: src/readme-examples/full-date-creation.example.ts -->

```TypeScript
import {
    createFullDate,
    getNowFullDate,
    parseInputElementValue,
    parseStrangeString,
    Timezone,
} from 'date-vir';

/**
 * Creates a FullDate from a wide range of possible inputs. See TypeScript types for full details on
 * available inputs.
 */
createFullDate('2023-06-05', Timezone['Europe/Rome']);

/** Get the current date and time right now in the given timezone. */
getNowFullDate(Timezone['America/Argentina/Buenos_Aires']);

/**
 * Parsed the value of an <input> element directly from the element itself. This is intended to be
 * used for type="date" or type="time" <input> elements, but any input element with a valid date or
 * time string will work.
 */
parseInputElementValue(document.querySelector('input'), Timezone['Asia/Tokyo']);

/**
 * If you have a really oddly formatted date/time string and createFullDate does not suffice, you
 * can have full parsing control using this function. Luxon is used under the hood for this parsing,
 * so you can see all the formatString options in its docs:
 * https://moment.github.io/luxon/#/parsing?id=table-of-tokens
 */
parseStrangeString({
    dateString: '870-0-14-19 5 2023 6',
    formatString: 'S-s-h-m d yyyy M',
    timezone: Timezone['America/Cancun'],
});
```

## Outputs

`FullDate` objects are easily converted into other formats (usually strings) with the included functions:

<!-- example-link: src/readme-examples/full-date-conversions.example.ts -->

```TypeScript
import {
    createFullDate,
    formatPresets,
    FullDatePart,
    Timezone,
    toHtmlInputString,
    toLocaleString,
    toTimestamp,
    toUtcIsoString,
} from 'date-vir';

const myFullDate = createFullDate('2023-06-05T14:19:00.870Z', Timezone['America/Chicago']);

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
toUtcIsoString(myFullDate); // returns '2023-06-05T14:19:00.870Z'

/**
 * Converts the given FullDate to a locale-based formatted string. The second argument, the options
 * argument, is optional and contains many options therein.
 */
toLocaleString(myFullDate, formatPresets.DatetimeFull); // returns 'June 5, 2023 at 9:19 AM CDT' in the en-us locale

/**
 * Formats the given FullDate to a string so that it is ready to be assigned to the value attribute
 * of an <input type="date" /> element.
 */
toHtmlInputString(myFullDate, FullDatePart.Date); // returns '2023-06-05'
```

## Timezone

`date-vir` exposes a type-safe list of timezone names, including shortcuts for the user's timezone and the UTC timezone:

<!-- example-link: src/readme-examples/timezones.example.ts -->

```TypeScript
import {Timezone, userTimezone, utcTimezone} from 'date-vir';

Timezone['Africa/Abidjan'];
Timezone['America/Los_Angeles'];
Timezone['Etc/GMT+1'];

utcTimezone;
userTimezone;
```

Note that the current list of timezone names included in this package was generated from Firefox 106.0.2.

## Luxon

The parsing and timezone conversions in `date-vir` utilize the [`luxon`](https://www.npmjs.com/luxon) package under the hood. If you wish to gain full `luxon` control over a `FullDate` object, `date-vir` provides an easy conversion function:

<!-- example-link: src/readme-examples/luxon-conversion.example.ts -->

```TypeScript
import {createFullDate, Timezone, toLuxonDateTime} from 'date-vir';

const myFullDate = createFullDate('2023-06-05T14:19:00.870Z', Timezone['America/Chicago']);

toLuxonDateTime(myFullDate);
```
