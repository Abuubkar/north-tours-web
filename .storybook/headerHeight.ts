/** The site header's height, from the `--header-h` token every sticky offset reads (it changes at 1200px). */
export const headerHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
