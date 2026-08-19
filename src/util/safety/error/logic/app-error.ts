import {windowSystemError} from "../window-system-error.js";

export type ErrorOption = {
    code? :number,
    meta? :unknown,
    cause?:unknown
}
export type ErrorCauseJSON = {
    name?: string;
    message?: string;
    stack?: string | undefined;
};

export type AppErrorObj = {
    message?: string;
    name?: string;
    code?: number | undefined;
    meta?: unknown;
    stack?: string | undefined;
    cause?: ErrorCauseJSON | undefined;
};

export class AppError extends Error{
    meta? :unknown;
    code :number | undefined;
    cause:Error | undefined;

    constructor(message:string,option:ErrorOption = {}){
        super(message);
        this.name = this.constructor.name;
        this.meta = option.meta;
        this.code = option.code;

        if (option.cause instanceof Error) {
            this.cause = option.cause;
        }

        this.addWindowSystemError();
    }
    toJSON():AppErrorObj{
        return{
            name   :this.name,
            message:this.message,
            code   :this.code,
            stack  : this.stack,
            cause  :this.cause instanceof Error?
                {
                    name: this.cause.name,
                    message: this.cause.message,
                    stack: this.cause.stack,
                }:undefined,
            meta   :this.meta,
        }
    }
    addWindowSystemError(){
        windowSystemError.add(this.toJSON());
    }
}
