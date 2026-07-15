import {validation} from "../../util/safety/validation/main.js";
import {UiWindowAPI} from "../../app/window-system.js";

export class UiWindowContentController{

    #eventBus;

    #EL_WINDOW_BODY;
    #EL_WINDOW_CONTENT_BODY;
    #EL_WINDOW_CONTENT_BOX;
    #EL_WINDOW_CONTENT_FRAME;

    constructor(uiWindowAPI:UiWindowAPI){
        this.#eventBus = uiWindowAPI.eventBus;

        this.#EL_WINDOW_BODY          = uiWindowAPI.elementState.getSelect("windowBody");
        this.#EL_WINDOW_CONTENT_BODY  = uiWindowAPI.elementState.getSelect("windowContentBody");
        this.#EL_WINDOW_CONTENT_BOX   = uiWindowAPI.elementState.getSelect("windowContentBox");
        this.#EL_WINDOW_CONTENT_FRAME = uiWindowAPI.elementState.getSelect("windowContentFrame");

        this.#init();
    }
    #init():void{
        this.#initEventBus();
        this.#initEvent();
    }
    #initEventBus():void{
    }
    #initEvent():void{

    }


}