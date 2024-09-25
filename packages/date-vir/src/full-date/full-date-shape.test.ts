import {describe, it} from '@augment-vir/test';
import {assertValidShape, defineShape, exact} from 'object-shape-tester';
import {ReadonlyDeep} from 'type-fest';
import {userTimezone, utcTimezone} from '../timezone/timezones.js';
import {
    DatePart,
    FullDate,
    TimePart,
    datePartShape,
    fullDateShape,
    timePartShape,
} from './full-date-shape.js';

describe('TimeOnly', () => {
    it('accepts valid time units', () => {
        const exampleTime: TimePart = {
            hour: 1,
            minute: 42,
            second: 31,
            millisecond: 100,
            timezone: utcTimezone,
        };

        assertValidShape(exampleTime, timePartShape);
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

        assertValidShape(exampleDate, datePartShape);
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
            timezone: userTimezone,
        };

        assertValidShape(exampleDate, fullDateShape);
    });

    it('is assignable to readonly versions of itself', () => {
        const myShape = defineShape({
            deployLocation: exact('github'),
            gitBranch: {
                branchName: '',
                branchUrl: '',
                commitDate: fullDateShape,
                headCommitMessageLines: [''],
                headSha: '',
                commitUrl: '',
            },
        });

        function acceptDate(date: ReadonlyDeep<FullDate>) {}

        acceptDate(myShape.defaultValue.gitBranch.commitDate);
    });

    it('is composable', () => {
        const myShape = defineShape({
            a: '',
            b: fullDateShape,
        });

        const exampleMyInstance: typeof myShape.runtimeType = {
            a: 'hi',
            b: {
                year: 1,
                month: 1,
                day: 1,
                hour: 1,
                minute: 1,
                second: 1,
                millisecond: 1,
                timezone: userTimezone,
            },
        };

        assertValidShape(exampleMyInstance, myShape);
    });
});
