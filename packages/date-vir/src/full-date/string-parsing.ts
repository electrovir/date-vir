import {DateTime} from 'luxon';
import {Timezone} from '../timezone/timezones.js';

/**
 * These formats are for luxon, documented here:
 * https://moment.github.io/luxon/#/parsing?id=table-of-tokens
 */
const knownStringFormats: ReadonlyArray<string> = [
    // 1-2024
    'L-y',
    // jan-2021
    'LLL-y',
    // january-2021
    'LLLL-y',
];

/**
 * Tries extra known formats for parsing date strings, even those that browsers do not natively
 * support.
 *
 * @category Internal
 */
export function parseDateString(dateString: string, timezone: Timezone): DateTime | undefined {
    const isoAttempt = DateTime.fromISO(dateString, {zone: timezone});

    if (isoAttempt.isValid) {
        return isoAttempt;
    }

    let finalizedDateTime: DateTime | undefined;

    knownStringFormats.some((format) => {
        const dateTimeAttempt = DateTime.fromFormat(dateString, format, {zone: timezone});

        if (!dateTimeAttempt.isValid) {
            return false;
        }

        finalizedDateTime = dateTimeAttempt;

        return true;
    });

    return finalizedDateTime;
}
