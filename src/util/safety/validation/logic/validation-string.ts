import {ValidationCodeToError} from "../private/validation-code-to-error.js";
import type { BaseErrorOption } from "../types.js";

export function validationString(value:unknown,validationOption?:BaseErrorOption):asserts value is string{
    const errorOption = {meta:value,...validationOption};

    if(typeof value !== "string"){
        ValidationCodeToError(201,errorOption);
    }
}