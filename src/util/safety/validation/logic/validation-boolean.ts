import {ValidationCodeToError} from "../private/validation-code-to-error.js";
import type { BaseErrorOption } from "../types.js";

export function validationBoolean(value:unknown,validationOption?:BaseErrorOption):asserts value is boolean {
    const errorOption = {meta:value,...validationOption};

    if(typeof value !== "boolean"){
        ValidationCodeToError(202,errorOption);
    }
}