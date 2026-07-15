import {AppErrorObj} from "./logic/app-error.js";

class WindowSystemError{
    #errorList:Array<AppErrorObj> = [];
    add(appErrorObj:AppErrorObj){
        this.#errorList.push(appErrorObj);
    }
    clear(){
        this.#errorList = [];
    }
    getList(){
        return [...this.#errorList];
    }
}

export const windowSystemError = new WindowSystemError();