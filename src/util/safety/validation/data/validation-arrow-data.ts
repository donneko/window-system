import * as logics from "./validation-logic-index.js";
import type { ValidationMap,BaseErrorOption} from "../types.js";


type ValidationArrowMap = {
    [K in keyof ValidationMap]: (value: unknown,validationOption?:BaseErrorOption) => asserts value is ValidationMap[K];
};

export const VALIDATION_ARROW: ValidationArrowMap = {
    boolean: logics.validationBoolean,
    number: logics.validationNumber,
    string: logics.validationString,
    HTMLElement: logics.validationHTMLElement,
    function: logics.validationFunction,
    object: logics.validationObject,
    array: logics.validationArray,
    HTMLImageElement: logics.validationHTMLImageElement,
};