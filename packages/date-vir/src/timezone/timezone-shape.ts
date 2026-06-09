import {check} from '@augment-vir/assert';
import {createCustomShape} from 'object-shape-tester';
import {isValidTimezone} from './timezone-checks.js';
import {type Timezone, utcTimezone} from './timezones.js';

/**
 * A shape for a timezone value.
 *
 * Unlike a strict enum check against the typed {@link Timezone} list, this validates at runtime via
 * {@link isValidTimezone} (i.e. any valid IANA zone name). It therefore accepts valid IANA names
 * that aren't in the typed list, such as legacy aliases like `'America/Indianapolis'` that some
 * environments (notably Safari) still report from `Intl`. The static type is `string` so that
 * timezone inputs are not restricted to the {@link Timezone} enum.
 *
 * @category Shape
 */
export const timezoneShape = createCustomShape<string>({
    default: utcTimezone,
    name: 'Timezone',
    checkValue(value): value is string {
        return check.isString(value) && isValidTimezone(value);
    },
});
