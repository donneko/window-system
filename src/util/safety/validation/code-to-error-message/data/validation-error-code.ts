import * as errorCode from"./validation-error-code-index.js";

export const VALIDATION_ERROR_CODE = [
    ...errorCode.VALIDATION_ERROR_CODE_9XX,
    ...errorCode.VALIDATION_ERROR_CODE_1XX,
    ...errorCode.VALIDATION_ERROR_CODE_2XX,
    ...errorCode.VALIDATION_ERROR_CODE_3XX,
    ...errorCode.VALIDATION_ERROR_CODE_4XX,
    ...errorCode.VALIDATION_ERROR_CODE_5XX,
    ...errorCode.VALIDATION_ERROR_CODE_6XX,
] as const;

export type ValidationErrorCode = typeof VALIDATION_ERROR_CODE[number]["code"];
