export function createElement(tagName:string):HTMLElement | undefined{
    const element = document.createElement(tagName);

    if(!element)return;

    return element;
}
