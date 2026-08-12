/**
 * Benchmark comparing FullDate shape validation using the old enum-based timezone check
 * (`enumShape(TimezoneName, utcTimezone)`) versus the new IANA-based check (`isValidTimezone` via
 * `createCustomShape`).
 *
 * Run with: npx tsx test-files/timezone-validation.benchmark.script.ts
 */

import {check} from '@augment-vir/assert';
import {
    dayOfMonthBounds,
    hourBounds,
    millisecondsBounds,
    minuteBounds,
    monthNumberBounds,
    secondBounds,
} from '@date-vir/duration';
import {Info} from 'luxon';
import {
    checkValidShape,
    createCustomShape,
    defineShape,
    enumShape,
    intersectShape,
    rangeShape,
} from 'object-shape-tester';
import {isValidTimezone} from '../src/timezone/timezone-checks.js';
import {TimezoneName, utcTimezone} from '../src/timezone/timezones.js';

/** Factory producing a fresh timezone shape part, mirroring how the real shapes consume it. */
type TimezonePartFactory = () => ReturnType<typeof enumShape>;

const oldTimezonePart: TimezonePartFactory = () => enumShape(TimezoneName, utcTimezone);

const newTimezonePart: TimezonePartFactory = () =>
    createCustomShape<string>({
        default: utcTimezone,
        name: 'Timezone',
        checkValue(value): value is string {
            return check.isString(value) && isValidTimezone(value);
        },
    })();

function makeFullDateShape(timezonePart: TimezonePartFactory) {
    const timePartShape = defineShape({
        hour: rangeShape({...hourBounds, default: hourBounds.min}),
        minute: rangeShape({...minuteBounds, default: minuteBounds.min}),
        second: rangeShape({...secondBounds, default: secondBounds.min}),
        millisecond: rangeShape({...millisecondsBounds, default: millisecondsBounds.min}),
        timezone: timezonePart(),
    });
    const datePartShape = defineShape({
        year: 2023,
        month: rangeShape({...monthNumberBounds, default: monthNumberBounds.min}),
        day: rangeShape({...dayOfMonthBounds, default: dayOfMonthBounds.min}),
        timezone: timezonePart(),
    });
    return defineShape(intersectShape(datePartShape, timePartShape));
}

const oldTimezoneShape = oldTimezonePart();
const newTimezoneShape = newTimezonePart();

const oldFullDateShape = makeFullDateShape(oldTimezonePart);
const newFullDateShape = makeFullDateShape(newTimezonePart);

const validFullDate = {
    year: 2024,
    month: 6,
    day: 2,
    hour: 13,
    minute: 32,
    second: 12,
    millisecond: 94,
    timezone: utcTimezone,
};

/** A spread of real timezones to defeat any single-zone caching in the engine. */
const allTimezones = Object.values(TimezoneName);
const variedFullDates = allTimezones.map((timezone) => {
    return {
        ...validFullDate,
        timezone,
    };
});

function formatNumber(value: number) {
    return value.toLocaleString('en-US', {maximumFractionDigits: 0});
}

function bench(name: string, iterations: number, run: (index: number) => void) {
    /** Warm up so JIT and Intl internals are primed before timing. */
    const warmup = Math.min(iterations, 5_000);
    for (let index = 0; index < warmup; index++) {
        run(index);
    }

    const start = performance.now();
    for (let index = 0; index < iterations; index++) {
        run(index);
    }
    const elapsedMs = performance.now() - start;

    const nsPerOp = (elapsedMs * 1_000_000) / iterations;
    const opsPerSec = iterations / (elapsedMs / 1_000);

    console.info(
        [
            name.padEnd(48),
            `${formatNumber(nsPerOp).padStart(10)} ns/op`,
            `${formatNumber(opsPerSec).padStart(14)} ops/sec`,
            `(${elapsedMs.toFixed(1)} ms total)`,
        ].join('  '),
    );
}

console.info('\n=== Raw timezone check (single fixed zone: "UTC") ===');
bench('old: enumShape membership', 500_000, () => checkValidShape(utcTimezone, oldTimezoneShape));
bench('new: isValidTimezone (Info.isValidIANAZone)', 500_000, () =>
    checkValidShape(utcTimezone, newTimezoneShape),
);

console.info('\n=== Raw timezone check (varied zones) ===');
bench('old: enumShape membership', 500_000, (index) =>
    checkValidShape(allTimezones[index % allTimezones.length], oldTimezoneShape),
);
bench('new: isValidTimezone (Info.isValidIANAZone)', 500_000, (index) =>
    checkValidShape(allTimezones[index % allTimezones.length], newTimezoneShape),
);

console.info('\n=== Full FullDate shape validation (single fixed zone) ===');
bench('old fullDateShape (enumShape tz)', 500_000, () =>
    checkValidShape(validFullDate, oldFullDateShape, {allowExtraKeys: true}),
);
bench('new fullDateShape (isValidTimezone tz)', 500_000, () =>
    checkValidShape(validFullDate, newFullDateShape, {allowExtraKeys: true}),
);

console.info('\n=== Full FullDate shape validation (varied zones) ===');
bench('old fullDateShape (enumShape tz)', 500_000, (index) =>
    checkValidShape(variedFullDates[index % variedFullDates.length], oldFullDateShape, {
        allowExtraKeys: true,
    }),
);
bench('new fullDateShape (isValidTimezone tz)', 500_000, (index) =>
    checkValidShape(variedFullDates[index % variedFullDates.length], newFullDateShape, {
        allowExtraKeys: true,
    }),
);

console.info('\n=== Bare primitives (lower bound of the two checks) ===');
const timezoneValueSet = new Set(allTimezones);
bench(
    'old: Set.has',
    1_000_000,
    (index) => void timezoneValueSet.has(allTimezones[index % allTimezones.length]),
);
bench(
    'uncached: Info.isValidIANAZone',
    1_000_000,
    (index) => void Info.isValidIANAZone(allTimezones[index % allTimezones.length]),
);

console.info('\n=== Fixed isValidTimezone (enum short-circuit + cache) ===');
bench(
    'isValidTimezone: canonical (Set hit)',
    1_000_000,
    (index) => void isValidTimezone(allTimezones[index % allTimezones.length]),
);
bench(
    'isValidTimezone: legacy alias (cache hit)',
    1_000_000,
    () => void isValidTimezone('America/Indianapolis'),
);
bench(
    'isValidTimezone: invalid string (cache hit)',
    1_000_000,
    () => void isValidTimezone('not a real timezone'),
);

console.info('');
