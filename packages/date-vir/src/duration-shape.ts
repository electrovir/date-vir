import {DurationUnit} from '@date-vir/duration';
import {enumShape, recordShape} from 'object-shape-tester';

/**
 * A shape definition for `AnyDuration`.
 *
 * @category Duration
 */
export const anyDurationShape = recordShape({
    keys: enumShape(DurationUnit),
    values: -1,
    partial: true,
});
