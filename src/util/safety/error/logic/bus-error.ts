import {AppError} from "./app-error.js";
import {ErrorOption} from "./app-error.js";

export class BusError extends AppError{
    constructor(message:string,option:ErrorOption = {}){
        super(message,option);
    }
}