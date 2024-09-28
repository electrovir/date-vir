import {getEnumValues} from '@augment-vir/common';
import {assertHasFullDateKeys} from '../extra-utils/has-date-props.js';
import {type toNewTimezone} from '../full-date/create-full-date.js';
import {FullDatePart} from '../full-date/full-date-parts.js';
import {DatePart, FullDate} from '../full-date/full-date-shape.js';
import {toSimpleDatePartString, toSimpleTimePartString} from './simple-strings.js';
import {
    DateTimeString,
    DateTimeWithSeconds,
    JustDateString,
    JustTimeString,
    JustTimeWithSecondsString,
} from './string-format-types.js';

/**
 * Only the date part of a {@link FullDate}, without timezone.
 *
 * @category Internals
 */
export type OnlyDatePart = Omit<DatePart, 'timezone'>;

/**
 * Only the hour and minute part of a {@link FullDate}, made optional.
 *
 * @category Internals
 */
export type OnlyHourMinutePart = Pick<Partial<FullDate>, 'hour' | 'minute'>;

/**
 * Only the hour, minute, and second part of a {@link FullDate}, made optional.
 *
 * @category Internals
 */
export type OnlyHourMinuteSecondPart = Pick<Partial<FullDate>, 'hour' | 'minute' | 'second'>;

export function toHtmlInputString(
    fullDate: Omit<FullDate, 'timezone'>,
    inputType: FullDatePart.DateTime,
    includeSeconds: true,
): DateTimeWithSeconds;
export function toHtmlInputString(
    fullDate: Omit<FullDate, 'timezone'>,
    inputType: FullDatePart.DateTime,
    includeSeconds?: false | undefined,
): DateTimeString;
export function toHtmlInputString(
    fullDate: OnlyDatePart,
    inputType: FullDatePart.Date,
): JustDateString;
export function toHtmlInputString(
    fullDate: OnlyHourMinutePart,
    inputType: FullDatePart.Time,
    includeSeconds?: false | undefined,
): JustTimeString;
export function toHtmlInputString(
    fullDate: OnlyHourMinuteSecondPart,
    inputType: FullDatePart.Time,
    includeSeconds: true,
): JustTimeWithSecondsString;
export function toHtmlInputString(
    fullDate: OnlyHourMinutePart | OnlyHourMinuteSecondPart,
    inputType: FullDatePart.Time,
    includeSeconds?: boolean | undefined,
): JustTimeWithSecondsString | JustTimeString;
export function toHtmlInputString(
    fullDate: OnlyHourMinuteSecondPart | OnlyDatePart,
    inputType: FullDatePart,
    includeSeconds: true,
): JustDateString | JustTimeWithSecondsString;
export function toHtmlInputString(
    fullDate: OnlyHourMinutePart | OnlyDatePart,
    inputType: FullDatePart,
    includeSeconds?: false | undefined,
): JustDateString | JustTimeString;
export function toHtmlInputString(
    fullDate:
        | Omit<FullDate, 'timezone'>
        | OnlyHourMinutePart
        | OnlyHourMinuteSecondPart
        | OnlyDatePart,
    inputType: FullDatePart,
    includeSeconds?: boolean | undefined,
):
    | JustDateString
    | JustTimeWithSecondsString
    | JustTimeString
    | DateTimeWithSeconds
    | DateTimeString;
/**
 * Converts a {@link FullDate} instance into a string that is understood by
 * [`type="date"`](https://developer.mozilla.org/docs/Web/HTML/Element/input/date) or
 * [`type="time"`](https://developer.mozilla.org/docs/Web/HTML/Element/input/time) instances of
 * [`HTMLInputElement`](https://developer.mozilla.org/docs/Web/HTML/Element/input). This can
 * optionally include seconds as well for `type="time"`.
 *
 * This function ignores timezone, the literal stored date and time numbers are simply concatenated
 * into a string. If you wish to convert time zones, first call {@link toNewTimezone} on your
 * {@link FullDate} instance.
 *
 * @category HTML
 * @category Formatting
 */
export function toHtmlInputString(
    fullDate:
        | Omit<FullDate, 'timezone'>
        | OnlyHourMinutePart
        | OnlyHourMinuteSecondPart
        | OnlyDatePart,
    inputType: FullDatePart,
    includeSeconds?: boolean | undefined,
):
    | JustDateString
    | JustTimeWithSecondsString
    | JustTimeString
    | DateTimeWithSeconds
    | DateTimeString {
    const internalFullDate = fullDate as Omit<Partial<FullDate>, 'timezone'>;

    if (inputType === FullDatePart.Date) {
        assertHasFullDateKeys(internalFullDate, [
            'year',
            'month',
            'day',
        ]);

        return toSimpleDatePartString(internalFullDate);
    } else if (inputType === FullDatePart.Time) {
        if (includeSeconds && internalFullDate.second == undefined) {
            throw new Error(
                'Tried to include seconds in the time string but no seconds were provided.',
            );
        }

        assertHasFullDateKeys(internalFullDate, [
            'hour',
            'minute',
        ]);

        return toSimpleTimePartString(internalFullDate, !!includeSeconds);
    } else if ((inputType as FullDatePart) === FullDatePart.DateTime) {
        const datePart = toHtmlInputString(fullDate, FullDatePart.Date);
        const timePart = toHtmlInputString(fullDate, FullDatePart.Time, includeSeconds);

        return `${datePart}T${timePart}` as DateTimeWithSeconds | DateTimeString;
    } else {
        throw new Error(
            `Unexpected inputTyped: '${String(inputType)}'. Expected usage of FullDatePart, one of ${getEnumValues(
                FullDatePart,
            ).join(', ')}.`,
        );
    }
}
