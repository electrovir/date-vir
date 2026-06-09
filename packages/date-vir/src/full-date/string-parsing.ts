import {DateTime} from 'luxon';

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
    // no padding
    // Sat, 1 Jun 2025 6:23:21 +0000 (UTC)
    'ccc, d LLL y H:mm:ss ZZZ (z)',
    // all padding
    // Sat, 01 Jun 2025 06:23:21 +0000 (UTC)
    'ccc, dd LLL y HH:mm:ss ZZZ (z)',
    // padded day
    // Sat, 01 Jun 2025 6:23:21 +0000 (UTC)
    'ccc, dd LLL y H:mm:ss ZZZ (z)',
    // padded hour
    // Sat, 01 Jun 2025 6:23:21 +0000 (UTC)
    'ccc, d LLL y HH:mm:ss ZZZ (z)',
    // no padding
    // Sat, 1 Jun 2025 6:23:21 +0000
    'ccc, d LLL y H:mm:ss ZZZ',
    // all padding
    // Sat, 01 Jun 2025 06:23:21 +0000
    'ccc, dd LLL y HH:mm:ss ZZZ',
    // padded day
    // Sat, 01 Jun 2025 6:23:21 +0000
    'ccc, dd LLL y H:mm:ss ZZZ',
    // padded hour
    // Sat, 01 Jun 2025 6:23:21 +0000
    'ccc, d LLL y HH:mm:ss ZZZ',
    // 3/11 | 3:01pm
    "L/d '|' h:mma",
    // 03/11 | 03:01pm
    "LL/dd '|' hh:mma",
];

/**
 * Tries extra known formats for parsing date strings, even those that browsers do not natively
 * support.
 *
 * @category Internal
 */
export function parseDateString(dateString: string, timezone: string): DateTime | undefined {
    const isoAttempt = DateTime.fromISO(dateString, {
        zone: timezone,
    });

    if (isoAttempt.isValid) {
        return isoAttempt;
    }

    let finalizedDateTime: DateTime | undefined;

    knownStringFormats.some((format) => {
        const dateTimeAttempt = DateTime.fromFormat(dateString.trim(), format, {
            zone: timezone,
        });

        if (!dateTimeAttempt.isValid) {
            return false;
        }

        finalizedDateTime = dateTimeAttempt;

        return true;
    });

    return finalizedDateTime;
}
