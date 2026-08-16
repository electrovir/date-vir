import {check} from '@augment-vir/assert';
import {type AtLeastOneDuration, DurationUnit} from '@date-vir/duration';
import {checkValidShape, createCustomShape, enumShape, recordShape} from 'object-shape-tester';

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

/**
 * A shape definition for {@link AtLeastOneDuration}.
 *
 * @category Duration
 */
export const atLeastOneDurationShape = createCustomShape<AtLeastOneDuration>({
    default: {
        milliseconds: 0,
    },
    name: 'AtLeastOneDuration',
    checkValue(value): value is AtLeastOneDuration {
        return (
            checkValidShape(value, anyDurationShape, {
                preventExtraKeys: true,
            }) && !check.isEmpty(value)
        );
    },
});
