import {validation} from "../../util/safety/validation/main.js";
export function classSwitching(
    flag:boolean,
    element:HTMLElement | unknown,
    className:string
):boolean{

    validation(element,"HTMLElement");

    const classList = element.classList;

    if(flag){
        classList.add(className);
    }else{
        classList.remove(className);
    }

    return true;
}