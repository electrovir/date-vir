import {getEnumTypedValues} from '@augment-vir/common';
import {assertHasDateProps} from '../extra-utils/has-date-props';
import {
    FullDate,
    FullDatePartEnum,
    OnlyDatePart,
    OnlyHourMinutePart,
    OnlyHourMinuteSecondPart,
} from '../full-date/full-date-shape';
import {toSimpleDatePartString, toSimpleTimePartString} from './simple-strings';
import {
    DateTimeString,
    DateTimeWithSeconds,
    JustDateString,
    JustTimeString,
    JustTimeWithSecondsString,
} from './string-format-types';

/**
 * Converts a FullDate object into a string that is understood by type="date" or type="time"
 * HTMLInputElement instances. Can optionally include seconds as well for type="time".
 *
 * This function ignores the timezone, the literal stored date and time numbers are simply
 * concatenated into a string. If you wish to convert time zones, first call toNewTimezone on your
 * FullDate object.
 */
export function toHtmlInputString(
    fullDate: Omit<FullDate, 'timezone'>,
    inputType: FullDatePartEnum.DateTime,
    includeSeconds: true,
): DateTimeWithSeconds;
export function toHtmlInputString(
    fullDate: Omit<FullDate, 'timezone'>,
    inputType: FullDatePartEnum.DateTime,
    includeSeconds?: false | undefined,
): DateTimeString;
export function toHtmlInputString(
    fullDate: OnlyDatePart,
    inputType: FullDatePartEnum.Date,
): JustDateString;
export function toHtmlInputString(
    fullDate: OnlyHourMinutePart,
    inputType: FullDatePartEnum.Time,
    includeSeconds?: false | undefined,
): JustTimeString;
export function toHtmlInputString(
    fullDate: OnlyHourMinuteSecondPart,
    inputType: FullDatePartEnum.Time,
    includeSeconds: true,
): JustTimeWithSecondsString;
export function toHtmlInputString(
    fullDate: OnlyHourMinutePart | OnlyHourMinuteSecondPart,
    inputType: FullDatePartEnum.Time,
    includeSeconds?: boolean | undefined,
): JustTimeWithSecondsString | JustTimeString;
export function toHtmlInputString(
    fullDate: OnlyHourMinuteSecondPart | OnlyDatePart,
    inputType: FullDatePartEnum,
    includeSeconds: true,
): JustDateString | JustTimeWithSecondsString;
export function toHtmlInputString(
    fullDate: OnlyHourMinutePart | OnlyDatePart,
    inputType: FullDatePartEnum,
    includeSeconds?: false | undefined,
): JustDateString | JustTimeString;
export function toHtmlInputString(
    fullDate:
        | Omit<FullDate, 'timezone'>
        | OnlyHourMinutePart
        | OnlyHourMinuteSecondPart
        | OnlyDatePart,
    inputType: FullDatePartEnum,
    includeSeconds?: boolean | undefined,
):
    | JustDateString
    | JustTimeWithSecondsString
    | JustTimeString
    | DateTimeWithSeconds
    | DateTimeString;
export function toHtmlInputString(
    fullDate:
        | Omit<FullDate, 'timezone'>
        | OnlyHourMinutePart
        | OnlyHourMinuteSecondPart
        | OnlyDatePart,
    inputType: FullDatePartEnum,
    includeSeconds?: boolean | undefined,
):
    | JustDateString
    | JustTimeWithSecondsString
    | JustTimeString
    | DateTimeWithSeconds
    | DateTimeString {
    const internalFullDate = fullDate as Omit<Partial<FullDate>, 'timezone'>;

    if (inputType === FullDatePartEnum.Date) {
        assertHasDateProps(internalFullDate, [
            'year',
            'month',
            'day',
        ]);

        return toSimpleDatePartString(internalFullDate);
    } else if (inputType === FullDatePartEnum.Time) {
        if (includeSeconds && internalFullDate.second == undefined) {
            throw new Error(
                'Tried to include seconds in the time string but no seconds were provided.',
            );
        }

        assertHasDateProps(internalFullDate, [
            'hour',
            'minute',
        ]);

        return toSimpleTimePartString(internalFullDate, !!includeSeconds);
    } else if (inputType === FullDatePartEnum.DateTime) {
        const datePart = toHtmlInputString(fullDate, FullDatePartEnum.Date);
        const timePart = toHtmlInputString(fullDate, FullDatePartEnum.Time, includeSeconds);

        return `${datePart}T${timePart}` as DateTimeWithSeconds | DateTimeString;
    } else {
        throw new Error(
            `Unexpected inputTyped: '${inputType}'. Expected usage of FullDatePartEnum or one of ${getEnumTypedValues(
                FullDatePartEnum,
            ).join(', ')}.`,
        );
    }
}
