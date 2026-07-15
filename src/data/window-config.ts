export type TitleDisplayType = "auto" | "scroll" | "stint";
export type WindowConfigState = {
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

export const INITIAL_WINDOW_CONFIG_STATE:WindowConfigState = {
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