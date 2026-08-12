import {assert} from '@augment-vir/assert';
import {applyBrand} from '@augment-vir/common';
import {describe, it, itCases} from '@augment-vir/test';
import {DateTime} from 'luxon';
import {type TimezoneString} from '../timezone/timezones.js';
import {fullDateShape} from './full-date-shape.js';
import {parseLuxonDateTime, toLuxonDateTime} from './luxon-date-time-conversion.js';

const dateTimeWithoutZoneName = new Proxy(DateTime.fromMillis(0), {
    get(target, property) {
        return property === 'zoneName' ? undefined : Reflect.get(target, property, target);
    },
});

describe(toLuxonDateTime.name, () => {
    itCases(toLuxonDateTime, [
        {
            it: 'fails on invalid timezone',
            input: {
                ...fullDateShape.default,
                timezone: applyBrand<TimezoneString>('not a real time zone'),
            },
            throws: {
                matchConstructor: Error,
            },
        },
        {
            it: 'fails on invalid dates',
            input: {
                ...fullDateShape.default,
                // @ts-expect-error: intentionally incorrect day
                day: 321,
            },
            throws: {
                matchConstructor: Error,
            },
        },
    ]);
});

describe(parseLuxonDateTime.name, () => {
    it('fails when a valid date has no timezone name', () => {
        assert.throws(() => parseLuxonDateTime(dateTimeWithoutZoneName), {
            matchMessage: 'must have a timezone',
        });
    });
});
