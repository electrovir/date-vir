import {DurationUnit} from '@date-vir/duration';
import {enumShape, indexedKeys} from 'object-shape-tester';

/**
 * A shape definition for `AnyDuration`.
 *
 * @category Duration
 */
export const anyDurationShape = indexedKeys({
    keys: enumShape(DurationUnit),
    values: -1,
    required: false,
});
