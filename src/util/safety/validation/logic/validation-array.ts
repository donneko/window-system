import {ValidationCodeToError} from "../private/validation-code-to-error.js";
import type { BaseErrorOption } from "../types.js";


export function validationArray(value:unknown,validationOption?:BaseErrorOption):asserts value is Array<unknown>{
    const errorOption = {meta:value,...validationOption};

    if(!(Array.isArray(value))){
        ValidationCodeToError(204,errorOption);
    }
}