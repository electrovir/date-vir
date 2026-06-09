import {check} from '@augment-vir/assert';
import {createCustomShape} from 'object-shape-tester';
import {isValidTimezone} from './timezone-checks.js';
import {type Timezone, utcTimezone} from './timezones.js';

/**
 * A shape for a {@link Timezone} value.
 *
 * Unlike a strict enum check against the typed {@link Timezone} list, this validates at runtime via
 * {@link isValidTimezone} (i.e. any valid IANA zone name). It therefore accepts valid IANA names
 * that aren't in the typed list, such as legacy aliases like `'America/Indianapolis'` that some
 * environments (notably Safari) still report from `Intl`. The static type remains {@link Timezone}.
 *
 * @category Shape
 */
export const timezoneShape = createCustomShape<Timezone>({
    default: utcTimezone,
    name: 'Timezone',
    checkValue(value): value is Timezone {
        return check.isString(value) && isValidTimezone(value);
    },
});
