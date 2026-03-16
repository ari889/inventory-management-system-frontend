import _ from "lodash";

/**
 * Slug generator
 * @param str
 * @returns string
 */
export const stringToSlug = (str: string) => _.kebabCase(str);
