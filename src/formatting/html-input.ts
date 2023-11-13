import {getEnumTypedValues} from '@augment-vir/common';
import {
    FullDate,
    FullDatePartEnum,
    OnlyDatePart,
    OnlyHourMinutePart,
    OnlyHourMinuteSecondPart,
} from '../full-date/full-date-shape';
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
        if (internalFullDate.year == undefined) {
            throw new Error(`Tried to create date string but no year was provided.`);
        }
        if (internalFullDate.month == undefined) {
            throw new Error(`Tried to create date string but no month was provided.`);
        }
        if (internalFullDate.day == undefined) {
            throw new Error(`Tried to create date string but no day was provided.`);
        }

        const dateParts = [
            String(Math.abs(internalFullDate.year)).padStart(4, '0'),
            String(Math.abs(internalFullDate.month)).padStart(2, '0'),
            String(Math.abs(internalFullDate.day)).padStart(2, '0'),
        ] as const;
        return dateParts.join('-') as JustDateString;
    } else if (inputType === FullDatePartEnum.Time) {
        const seconds = includeSeconds
            ? String(Math.abs(internalFullDate.second ?? 0)).padStart(2, '0')
            : undefined;
        if (includeSeconds && internalFullDate.second == undefined) {
            throw new Error(
                'Tried to include seconds in the time string but no seconds were provided.',
            );
        }
        if (internalFullDate.hour == undefined) {
            throw new Error(`Tried to create time string but no hour was provided.`);
        }
        if (internalFullDate.minute == undefined) {
            throw new Error(`Tried to create time string but no minutes were provided.`);
        }

        const timeParts = [
            String(Math.abs(internalFullDate.hour)).padStart(2, '0'),
            String(Math.abs(internalFullDate.minute)).padStart(2, '0'),
            seconds,
        ].filter((entry) => entry != undefined);

        return timeParts.join(':') as JustTimeWithSecondsString | JustTimeString;
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
