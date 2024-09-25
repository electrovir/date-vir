import type {RequireAtLeastOne, UnionToIntersection} from 'type-fest';
import {type DurationUnit} from './duration-unit.js';

/** Copied from `@augment-vir/common` so this package doesn't depend on augment-vir. */
type RequiredAndNotNull<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
};

/**
 * All possible options for the more strict Duration type. Matches the DurationObjectUnits type from
 * the luxon package.
 *
 * @category Duration
 */
export type AnyDuration = {
    years?: number | undefined;
    quarters?: number | undefined;
    months?: number | undefined;
    weeks?: number | undefined;
    days?: number | undefined;
    hours?: number | undefined;
    minutes?: number | undefined;
    seconds?: number | undefined;
    milliseconds?: number | undefined;
};

/**
 * Requires at least one duration unit to be set.
 *
 * @category Duration
 */
export type AtLeastOneDuration = RequireAtLeastOne<RequiredAndNotNull<AnyDuration>>;

/**
 * All possible duration units at once. Whether these duration units should be added together to
 * form the whole picture or whether each duration is the same value but calculated in different
 * units depends on the context of this type's usage.
 *
 * @category Duration
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
          ? Pick<AllDurations, `${DurationKeys}`>
          : never
>;
