import{ WindowSystem } from "./app/window-system.js";

type WindowPersistentState = {
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;

    isActive: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    isHidden: boolean;
};

type TitleDisplayType = "auto" | "scroll" | "stint";
type WindowConfigState = {
    id: string;
    title: string;
    titleDisplayType:TitleDisplayType;

    basisElement:HTMLElement;

    minWidth: number;
    minHeight: number;
    maxWidth: number | null;
    maxHeight: number | null;

    movable: boolean;
    resizable: boolean;
    closable: boolean;
}
export function window(){

    const INITIAL_WINDOW_CONFIG_STATE:WindowConfigState = {
        id: "id",
        title: "title",
        titleDisplayType:"auto",

        basisElement:document.body,

        minWidth: 0,
        minHeight: 0,
        maxWidth: null,
        maxHeight: null,

        movable: false,
        resizable: false,
        closable: false,
    };
    const INITIAL_WINDOW_PERSISTENT_STATE:WindowPersistentState = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        zIndex: 0,

        isActive: false,
        isMinimized: false,
        isMaximized: false,
        isHidden: false,
    };

    const initialWindowConfig = {
        config:{...INITIAL_WINDOW_CONFIG_STATE},
        persistent:{...INITIAL_WINDOW_PERSISTENT_STATE},
    }

    return new WindowSystem(initialWindowConfig);
}

const WINDOW_SYSTEM = window();




