import {ValidationCodeToError} from "../private/validation-code-to-error.js";
import type { BaseErrorOption } from "../types.js";

export function validationNumber(value:unknown,validationOption?:BaseErrorOption):asserts value is number{
    const errorOption = {meta:value,...validationOption};

    if(typeof value !== "number"){
        ValidationCodeToError(200,errorOption);
    }
    if(Number.isNaN(value)){
        ValidationCodeToError(305,errorOption);
    }
}