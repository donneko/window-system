import {ValidationCodeToError} from "../private/validation-code-to-error.js";
import type { BaseErrorOption } from "../types.js";

export function validationFunction(
    value:unknown,validationOption?:BaseErrorOption
): asserts value is (...args: unknown[]) => unknown {
    const errorOption = {meta:value,...validationOption};

    if (typeof value !== "function") {
        ValidationCodeToError(205,errorOption);
    }
}