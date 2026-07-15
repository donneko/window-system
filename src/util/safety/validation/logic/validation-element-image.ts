import {ValidationCodeToError} from "../private/validation-code-to-error.js";
import type { BaseErrorOption } from "../types.js";

export function validationHTMLImageElement(value:unknown,validationOption?:BaseErrorOption):asserts value is HTMLImageElement{
    const errorOption = {meta:value,...validationOption};

    if(!(value instanceof HTMLImageElement)){
        ValidationCodeToError(207,errorOption);
    };
}