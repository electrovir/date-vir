/**
 * Common options for rounding.
 *
 * @category Internal
 */
export type RoundOptions = {
    /**
     * The number of decimals to allow for each duration unit's value. Rounding is used to reach
     * this number. If omitted or set to `undefined`, no rounding takes place.
     */
    decimalCount?: number | undefined;
};
