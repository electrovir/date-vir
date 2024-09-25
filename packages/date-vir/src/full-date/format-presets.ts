import {DateTime} from 'luxon';
import {toLocaleString} from '../formatting/formatted-string.js';

/**
 * Format presets to be used with {@link toLocaleString}. To see examples of all presets, go here:
 * https://moment.github.io/luxon/#/formatting?id=presets
 *
 * @category Formatting
 */
export const formatPresets = {
    DateShort: DateTime.DATE_SHORT,
    DateMed: DateTime.DATE_MED,
    DateMedWithWeekday: DateTime.DATE_MED_WITH_WEEKDAY,
    DateFull: DateTime.DATE_FULL,
    DateHuge: DateTime.DATE_HUGE,
    TimeSimple: DateTime.TIME_SIMPLE,
    TimeWithSeconds: DateTime.TIME_WITH_SECONDS,
    TimeWithShortOffset: DateTime.TIME_WITH_SHORT_OFFSET,
    TimeWithLongOffset: DateTime.TIME_WITH_LONG_OFFSET,
    Time24Simple: DateTime.TIME_24_SIMPLE,
    Time24WithSeconds: DateTime.TIME_24_WITH_SECONDS,
    Time24WithShortOffset: DateTime.TIME_24_WITH_SHORT_OFFSET,
    Time24WithLongOffset: DateTime.TIME_24_WITH_LONG_OFFSET,
    DatetimeShort: DateTime.DATETIME_SHORT,
    DatetimeShortWithSeconds: DateTime.DATETIME_SHORT_WITH_SECONDS,
    DatetimeMed: DateTime.DATETIME_MED,
    DatetimeMedWithSeconds: DateTime.DATETIME_MED_WITH_SECONDS,
    DatetimeMedWithWeekday: DateTime.DATETIME_MED_WITH_WEEKDAY,
    DatetimeFull: DateTime.DATETIME_FULL,
    DatetimeFullWithSeconds: DateTime.DATETIME_FULL_WITH_SECONDS,
    DatetimeHuge: DateTime.DATETIME_HUGE,
    DatetimeHugeWithSeconds: DateTime.DATETIME_HUGE_WITH_SECONDS,
} as const;
