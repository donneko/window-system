import {ValidationCodeToError} from "../private/validation-code-to-error.js";
import type { BaseErrorOption } from "../types.js";

export function validationHTMLElement(value:unknown,validationOption?:BaseErrorOption):asserts value is HTMLElement{
    const errorOption = {meta:value,...validationOption};

    if(!(value instanceof HTMLElement)){
        ValidationCodeToError(206,errorOption);
    };
}