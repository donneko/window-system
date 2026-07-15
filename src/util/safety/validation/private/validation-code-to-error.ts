import{ValidationError}from"../../error/logic/validation-error.js";
import{codeToErrorMessage}from"../code-to-error-message/code-to-error-message.js";
import{ValidationErrorCode} from "../code-to-error-message/data/validation-error-code.js";
import type {BaseErrorOption}from"../types.js";

export function ValidationCodeToError(code:ValidationErrorCode,option?:BaseErrorOption):ValidationError{

    const errorObj = codeToErrorMessage(code,option);

    if(!errorObj) throw new ValidationError("ErrorMessage の取得に失敗しました",{...option,code:code});
    throw new ValidationError(...errorObj);
}