import {getHtmlElementFromDom} from"../get-dom/get-html-element-from-dom.js";
import {createElement} from"../create-element/create-element.js";

type HtmlElementOption = {
    targetObject?:Document | HTMLElement,
    all?:boolean,
}

export class HtmlElementController{
    #HTML_ELEMENT:unknown;

    constructor(cssSelector:string |null,option?:HtmlElementOption){
        this.#initElement(cssSelector,option);
    }
    #initElement(cssSelector:string |null,option?:HtmlElementOption){
        if(!cssSelector)return;
        const html = getHtmlElementFromDom(cssSelector,option);

        if(!this.#isHTMLElement(html))return;
        this.#HTML_ELEMENT = html;

    }
    /**
     * 存在するinnerHtmlを消去して、新しく追加します
     * @param {string} tagName 
     * @param {function(HTMLElement)} fn 
     */
    changeNewDomElement(tagName:string,fn = (e:HTMLElement)=> e ){
        const request = this.#newAddDomProcess(tagName,fn)

        this.#changeDom(request);
    }

    /**
     * 最後に追加します
     * @param {string} tagName 
     * @param {function(HTMLElement)} fn 
     */
    appendNewDomElement(tagName:string,fn = (e:HTMLElement)=> e ){
        const request = this.#newAddDomProcess(tagName,fn)
        this.#appendDom(request);
    }

    /**
     * innerHtmlを消去します
     */
    clearDomElement(){
        this.#clearElement()
    }

    #newAddDomProcess(tagName:string,fn:Function){
        const tmp = createElement(tagName)
        
        if(typeof fn !== "function")return tmp;
        try {
            const request = fn(tmp);
            return request
        } catch (error) {
            console.error(error)
            return tmp
        }
    }

    changeInnerText(inputInnerText:string){
        if(!this.#isHTMLElement(this.#HTML_ELEMENT))return;

        this.#HTML_ELEMENT.innerText = inputInnerText;
    }
    #isHTMLElement(html:unknown){
        return (html instanceof HTMLElement);
    }
    /**
     * 
     * @returns {HTMLElement}
     */
    getElement(){
        return this.#HTML_ELEMENT
    }
    /**
     * 内部のデータを上書きします
     * @returns {HTMLElement}
     */
    setElement(newElement:HTMLElement){
        if(!this.#isHTMLElement(newElement))return;

        this.#HTML_ELEMENT = newElement;
    }
    /**
     * 注意: XSSに注意してください!!
     */
    #changeDom(dom:HTMLElement){
        if(!this.#isHTMLElement(dom))return;
        if(!this.#isHTMLElement(this.#HTML_ELEMENT))return;

        this.#HTML_ELEMENT.replaceChildren(dom)
    }
    /**
     * 注意: XSSに注意してください!!
     */
    #appendDom(dom:HTMLElement){
        if(!this.#isHTMLElement(dom))return;
        if(!this.#isHTMLElement(this.#HTML_ELEMENT))return;

        this.#HTML_ELEMENT.append(dom);
    }
    #clearElement(){
        if(!this.#isHTMLElement(this.#HTML_ELEMENT))return;

        this.#HTML_ELEMENT.innerHTML = "";
    }
}