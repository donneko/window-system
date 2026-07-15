import {classSwitching} from "../../helper/class-switching/class-switching.js";
import {validation} from "../../util/safety/validation/main.js";
import {isDisplayFitCompute} from "./private/title-display-type.js";
import {UiWindowAPI} from "../../app/window-system.js";

export type TitleDisplayType = "auto" | "scroll" | "stint";

export class UiWindowHeaderController{

    #eventBus;

    #EL_HEADER_DELETE_BUTTON;
    #EL_HEADER_ICON;
    #EL_HEADER_TITLE_TEXT;
    #EL_HEADER_TITLE_BOX;

    constructor(uiWindowAPI:UiWindowAPI){
        this.#eventBus = uiWindowAPI.eventBus;

        this.#EL_HEADER_DELETE_BUTTON = uiWindowAPI.elementState.getSelect("headerDeleteButton");
        this.#EL_HEADER_ICON          = uiWindowAPI.elementState.getSelect("headerIcon");
        this.#EL_HEADER_TITLE_TEXT    = uiWindowAPI.elementState.getSelect("headerTitleText");
        this.#EL_HEADER_TITLE_BOX     = uiWindowAPI.elementState.getSelect("headerTitleBox");

        this.#init();
    }
    #init():void{
        this.#initEventBus();
        this.#initEvent();
    }
    #initEventBus():void{
        this.#eventBus.on("window:header-title-text"  ,({value}) => this.#titleTextChange(value));
        this.#eventBus.on("window:header-display-type",({type }) => this.#titleDisplayType(type));
        this.#eventBus.on("window:header-icon-valid"  ,({flag }) => this.#validIcon(flag));
        this.#eventBus.on("window:header-icon-src"    ,({src  }) => this.#iconSrc(src));
    }
    #initEvent():void{
        const element = this.#EL_HEADER_DELETE_BUTTON.getElement();
        validation(element,"HTMLElement");

        element.addEventListener("click",()=>{
            this.#eventBus.emit("window:close",{id:""});
        })
    }


    #titleTextChange( title:string):void{
        if(!title) return ;
        this.#EL_HEADER_TITLE_TEXT.changeInnerText(title);
    }
    #isStatusHederTitleTypeAuto():void{
        const elementHeaderBox = this.#EL_HEADER_TITLE_BOX.getElement();
        const elementHeaderText = this.#EL_HEADER_TITLE_TEXT.getElement();

        validation(elementHeaderBox,"HTMLElement");
        validation(elementHeaderText,"HTMLElement");

        if(isDisplayFitCompute(elementHeaderBox,elementHeaderText)){
            this.#validTitleScroll(false)
        }else{
            this.#validTitleScroll(true)
        }
    }
    #titleDisplayType(inputType:TitleDisplayType):void{


        const handlers:Record<TitleDisplayType,()=>void> = {
            auto  : () => this.#isStatusHederTitleTypeAuto(),
            scroll: () => this.#validTitleScroll(true),
            stint : () => this.#validTitleScroll(false)
        }

        const fn = (handlers[inputType] || handlers.auto);
        fn();
    }

    #validTitleScroll(flag:boolean):void{
        const element = this.#EL_HEADER_TITLE_TEXT.getElement();
        classSwitching(flag,element,"is-scroll-animation")
    }

    #iconSrc( src :string):void{
        const element = this.#EL_HEADER_ICON.getElement();
        validation(element,"HTMLImageElement");
        element.src = src;
    }

    #validIcon(flag:boolean):void{
        const element = this.#EL_HEADER_ICON.getElement();
        classSwitching(flag,element,"is-icon")
    }

}