export type ValidationMap = {
    boolean: boolean;
    number: number;
    string: string;
    HTMLElement: HTMLElement;
    function: (...args: unknown[]) => unknown;
    object: object;
    array: unknown[];
    HTMLImageElement: HTMLImageElement;
};
export type BaseErrorOption = {
    meta?: unknown;
    cause?: Error;
    label?: string;
    message?: string;
};
export type ValidationOption = BaseErrorOption & {
    checkNil?: boolean;
};
export type ValidationType = keyof ValidationMap;