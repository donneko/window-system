import{validationNonNil}from"./logic/validation-non-nil.js";
import{VALIDATION_ARROW}from"./data/validation-arrow-data.js";
import type { ValidationMap, ValidationOption } from "./types.js";


export function validation<T extends keyof ValidationMap>(
    value: unknown,
    type: T,
    option?: ValidationOption
): asserts value is ValidationMap[T];

export function validation(
    value: unknown,
    type: keyof ValidationMap,
    option?:ValidationOption
): void {
    const validationOption: ValidationOption = {
        checkNil: option?.checkNil ?? true,
        label: option?.label,
        message: option?.message,
    };

    if (validationOption.checkNil) {
        validationNonNil(value,validationOption);
    }

    const fn: (value: unknown,validationOption:ValidationOption) => void = VALIDATION_ARROW[type];
    fn(value,validationOption);

}

export function isValidation<T extends keyof ValidationMap>(
    value: unknown,
    type: T,
    option?: ValidationOption
):value is ValidationMap[T]{
    try {
        validation(value,type,option);
    } catch {
        return false;
    }
    return true;
}

export function ensureValidation<T extends keyof ValidationMap>(
    value: unknown,
    type: T,
    option?: ValidationOption
):ValidationMap[T]{

    validation(value,type,option);
    return value;
}