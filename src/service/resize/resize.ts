import { validation } from "../../util/safety/validation/main";

type size = {
    x:number,
    y:number,
}
export function resize(element:HTMLElement,{x,y}:size){
    if(!element) return ;
    const EL_STYLE = element.style;

    validation(x,"number");
    validation(y,"number");

    EL_STYLE.width     = `${x}px`;
    EL_STYLE.height    = `${y}px`;

}
