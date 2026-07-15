import {ValidationCodeToError} from "../private/validation-code-to-error.js";
import type { BaseErrorOption } from "../types.js";

export function validationNonNil<T>(value:T,validationOption?:BaseErrorOption):asserts value is NonNullable<T> {
    const errorOption = {meta:value,...validationOption};

    if (value === undefined || value === null) {
        ValidationCodeToError(102,errorOption);
    }
}