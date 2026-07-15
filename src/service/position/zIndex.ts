import { validation } from "../../util/safety/validation/main";

type Position = {
    z:number,
}

export function zIndex(element:HTMLElement,z:Position){
    validation(element,"HTMLElement");

    const EL_STYLE = element.style;

    validation(z,"number");

    EL_STYLE.position = "absolute"
    EL_STYLE.zIndex   = `${z}`;
}
