import {VALIDATION_ERROR_CODE} from "./data/validation-error-code.js";
import {ValidationErrorCode} from "./data/validation-error-code.js";
import type { BaseErrorOption } from "../types.js";

type ErrorDetail = BaseErrorOption & {
    code:ValidationErrorCode,
}

export function codeToErrorMessage(code:ValidationErrorCode,option?:BaseErrorOption):[string,ErrorDetail]|undefined{

    const record =
        VALIDATION_ERROR_CODE.find(item => item.code === code) ??
        VALIDATION_ERROR_CODE.find(item => item.code === 900);

    if(!record)return;

    const baseMessage = option?.message ?? record.message;
    const message = option?.label
        ? `[${option.label}] ${baseMessage}`
        : baseMessage;

    return [message,{...option,code:record.code}];
}