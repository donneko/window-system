import { validation } from "../../util/safety/validation/main";

type Position = {
    x:number,
    y:number,
}

export function move(element:HTMLElement,{x,y}:Position){
    validation(element,"HTMLElement");

    const EL_STYLE = element.style;

    validation(x,"number");
    validation(y,"number");

    EL_STYLE.position = "absolute"
    EL_STYLE.left     = `${x}px`;
    EL_STYLE.top      = `${y}px`;
}
