/**
 * The current user's default locale, useful for formatting purposes.
 *
 * @category Util
 */
export const userLocale = Intl.DateTimeFormat().resolvedOptions().locale;

/**
 * Options for setting locale for string formatting purposes.
 *
 * @category Internal
 */
export type LocaleOptions = {
    /**
     * Set the locale string.
     *
     * @example
     *
     * - 'en-US' -'en'
     * - 'de'
     *
     *
     * @default the user's locale
     */
    locale?: string | undefined;
};
