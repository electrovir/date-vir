import type {RequireAtLeastOne, UnionToIntersection} from 'type-fest';
import {DurationUnit} from './duration-unit.js';

/** Copied from `@augment-vir/common` so this package doesn't depend on augment-vir. */
type RequiredAndNotNull<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
};

/**
 * A looser type with all possible options, based on the stricter {@link Duration} type. Matches the
 * DurationObjectUnits type from the luxon package.
 *
 * @category Duration : Util
 */
export type AnyDuration = Partial<Record<DurationUnit, number | undefined>>;

/**
 * Requires at least one duration unit to be set.
 *
 * @category Duration : Util
 */
export type AtLeastOneDuration = RequireAtLeastOne<RequiredAndNotNull<AnyDuration>>;

/**
 * All possible duration units at once. Whether these duration units should be added together to
 * form the whole picture or whether each duration is the same value but calculated in different
 * units depends on the context of this type's usage.
 *
 * @category Duration : Util
 */
export type AllDurations = RequiredAndNotNull<AnyDuration>;

/**
 * Not a single date instance, but a description of a date duration. Used to calculate diffs between
 * dates, add offsets to an existing date, or describe a single time duration. Usually only one
 * property is set on this at any given time.
 *
 * Settings a type parameter of `true` allows any {@link DurationUnit}.
 *
 * @category Duration
 */
export type Duration<DurationKeys extends DurationUnit | true> = UnionToIntersection<
    DurationKeys extends true
        ? AnyDuration
        : DurationKeys extends DurationUnit
          ? Pick<AllDurations, DurationKeys>
          : never
>;

/**
 * An object with all {@link DurationUnit} keys set to `0`.
 *
 * @category Zero
 */
export const emptyDuration = {
    years: 0,
    quarters: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
} as const satisfies Readonly<AllDurations>;

/**
 * An object with all {@link DurationUnit} keys set to `0`.
 *
 * @category Zero
 */
export const zeroDuration = emptyDuration;
