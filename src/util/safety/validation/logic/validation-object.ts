import { ValidationCodeToError } from "../private/validation-code-to-error.js";
import type { BaseErrorOption } from "../types.js";

export function validationObject(value:unknown,validationOption?:BaseErrorOption): asserts value is object {
    const errorOption = {meta:value,...validationOption};

    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        ValidationCodeToError(203,errorOption);
    }
}