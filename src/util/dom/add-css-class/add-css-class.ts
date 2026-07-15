
export function addCssClass(element:HTMLElement,cssClassList:string[]){
    cssClassList.forEach(cssClass => {
        element.classList.add(cssClass);
    });
}