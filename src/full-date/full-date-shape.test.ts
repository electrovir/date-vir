import {assertValidShape} from 'object-shape-tester';
import {utcTimezone} from '../timezone/timezones';
import {
    DatePart,
    FullDate,
    TimePart,
    dateOnlyShape,
    fullDateShape,
    timeOnlyShape,
} from './full-date-shape';

describe('TimeOnly', () => {
    it('accepts valid time units', () => {
        const exampleTime: TimePart = {
            hour: 1,
            minute: 42,
            second: 31,
            millisecond: 100,
            timezone: utcTimezone,
        };

        assertValidShape(exampleTime, timeOnlyShape);
    });
});

describe('TimeOnly', () => {
    it('accepts valid date units', () => {
        const exampleDate: DatePart = {
            year: 1,
            month: 1,
            day: 1,
            timezone: utcTimezone,
        };

        assertValidShape(exampleDate, dateOnlyShape);
    });
});

describe('FullDate', () => {
    it('accepts valid full dates', () => {
        const exampleDate: FullDate = {
            year: 1,
            month: 1,
            day: 1,
            hour: 1,
            minute: 1,
            second: 1,
            millisecond: 1,
            timezone: utcTimezone,
        };

        assertValidShape(exampleDate, fullDateShape);
    });
});
