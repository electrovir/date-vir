import {assert} from '@augment-vir/assert';
import {describe, it, itCases} from '@augment-vir/test';
import {userLocale} from '../locale.js';
import {DayOfWeekName, getDayOfTheWeekNames} from './day-of-week.js';

describe(getDayOfTheWeekNames.name, () => {
    it("uses the user's locale", () => {
        assert.deepEquals(
            getDayOfTheWeekNames(),
            getDayOfTheWeekNames({
                locale: userLocale,
            }),
        );
    });

    itCases(getDayOfTheWeekNames, [
        {
            it: 'gets English day of week names',
            input: {
                locale: 'en',
            },
            expect: {
                short: {
                    keyed: {
                        [DayOfWeekName.Sunday]: 'Sun',
                        [DayOfWeekName.Monday]: 'Mon',
                        [DayOfWeekName.Tuesday]: 'Tue',
                        [DayOfWeekName.Wednesday]: 'Wed',
                        [DayOfWeekName.Thursday]: 'Thu',
                        [DayOfWeekName.Friday]: 'Fri',
                        [DayOfWeekName.Saturday]: 'Sat',
                    },
                    indexed: {
                        '0': 'Sun',
                        '1': 'Mon',
                        '2': 'Tue',
                        '3': 'Wed',
                        '4': 'Thu',
                        '5': 'Fri',
                        '6': 'Sat',
                    },
                    numbered: {
                        '1': 'Sun',
                        '2': 'Mon',
                        '3': 'Tue',
                        '4': 'Wed',
                        '5': 'Thu',
                        '6': 'Fri',
                        '7': 'Sat',
                    },
                },
                narrow: {
                    keyed: {
                        [DayOfWeekName.Sunday]: 'S',
                        [DayOfWeekName.Monday]: 'M',
                        [DayOfWeekName.Tuesday]: 'T',
                        [DayOfWeekName.Wednesday]: 'W',
                        [DayOfWeekName.Thursday]: 'T',
                        [DayOfWeekName.Friday]: 'F',
                        [DayOfWeekName.Saturday]: 'S',
                    },
                    indexed: {
                        '0': 'S',
                        '1': 'M',
                        '2': 'T',
                        '3': 'W',
                        '4': 'T',
                        '5': 'F',
                        '6': 'S',
                    },
                    numbered: {
                        '1': 'S',
                        '2': 'M',
                        '3': 'T',
                        '4': 'W',
                        '5': 'T',
                        '6': 'F',
                        '7': 'S',
                    },
                },
                long: {
                    keyed: {
                        [DayOfWeekName.Sunday]: 'Sunday',
                        [DayOfWeekName.Monday]: 'Monday',
                        [DayOfWeekName.Tuesday]: 'Tuesday',
                        [DayOfWeekName.Wednesday]: 'Wednesday',
                        [DayOfWeekName.Thursday]: 'Thursday',
                        [DayOfWeekName.Friday]: 'Friday',
                        [DayOfWeekName.Saturday]: 'Saturday',
                    },
                    indexed: {
                        '0': 'Sunday',
                        '1': 'Monday',
                        '2': 'Tuesday',
                        '3': 'Wednesday',
                        '4': 'Thursday',
                        '5': 'Friday',
                        '6': 'Saturday',
                    },
                    numbered: {
                        '1': 'Sunday',
                        '2': 'Monday',
                        '3': 'Tuesday',
                        '4': 'Wednesday',
                        '5': 'Thursday',
                        '6': 'Friday',
                        '7': 'Saturday',
                    },
                },
            },
        },
        {
            it: 'gets German day of week names',
            input: {
                locale: 'de',
            },
            expect: {
                // cspell:disable
                short: {
                    keyed: {
                        [DayOfWeekName.Sunday]: 'So',
                        [DayOfWeekName.Monday]: 'Mo',
                        [DayOfWeekName.Tuesday]: 'Di',
                        [DayOfWeekName.Wednesday]: 'Mi',
                        [DayOfWeekName.Thursday]: 'Do',
                        [DayOfWeekName.Friday]: 'Fr',
                        [DayOfWeekName.Saturday]: 'Sa',
                    },
                    indexed: {
                        '0': 'So',
                        '1': 'Mo',
                        '2': 'Di',
                        '3': 'Mi',
                        '4': 'Do',
                        '5': 'Fr',
                        '6': 'Sa',
                    },
                    numbered: {
                        '1': 'So',
                        '2': 'Mo',
                        '3': 'Di',
                        '4': 'Mi',
                        '5': 'Do',
                        '6': 'Fr',
                        '7': 'Sa',
                    },
                },
                narrow: {
                    keyed: {
                        [DayOfWeekName.Sunday]: 'S',
                        [DayOfWeekName.Monday]: 'M',
                        [DayOfWeekName.Tuesday]: 'D',
                        [DayOfWeekName.Wednesday]: 'M',
                        [DayOfWeekName.Thursday]: 'D',
                        [DayOfWeekName.Friday]: 'F',
                        [DayOfWeekName.Saturday]: 'S',
                    },
                    indexed: {
                        '0': 'S',
                        '1': 'M',
                        '2': 'D',
                        '3': 'M',
                        '4': 'D',
                        '5': 'F',
                        '6': 'S',
                    },
                    numbered: {
                        '1': 'S',
                        '2': 'M',
                        '3': 'D',
                        '4': 'M',
                        '5': 'D',
                        '6': 'F',
                        '7': 'S',
                    },
                },
                long: {
                    keyed: {
                        [DayOfWeekName.Sunday]: 'Sonntag',
                        [DayOfWeekName.Monday]: 'Montag',
                        [DayOfWeekName.Tuesday]: 'Dienstag',
                        [DayOfWeekName.Wednesday]: 'Mittwoch',
                        [DayOfWeekName.Thursday]: 'Donnerstag',
                        [DayOfWeekName.Friday]: 'Freitag',
                        [DayOfWeekName.Saturday]: 'Samstag',
                    },
                    indexed: {
                        '0': 'Sonntag',
                        '1': 'Montag',
                        '2': 'Dienstag',
                        '3': 'Mittwoch',
                        '4': 'Donnerstag',
                        '5': 'Freitag',
                        '6': 'Samstag',
                    },
                    numbered: {
                        '1': 'Sonntag',
                        '2': 'Montag',
                        '3': 'Dienstag',
                        '4': 'Mittwoch',
                        '5': 'Donnerstag',
                        '6': 'Freitag',
                        '7': 'Samstag',
                    },
                },
            },
        },
    ]);
});
