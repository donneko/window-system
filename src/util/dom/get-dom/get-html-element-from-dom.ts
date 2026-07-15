import{isValidationOfStringAndNotNull}from"./is-validation-of-string-and-not-null.js";
    /**
     * HtmlElementを取得するメソット
     * @param {String} cssSelector - 取得するHtmlElementのCSSの名前
     * @typedef {Object} option - 取得方法などのオプション
     * @property {HTMLElement} targetObject - 取得するターゲットエレメント
     * @returns {(HTMLElement|null)} - 取得した結果
     */
    type HtmlElementOption = {
        targetObject?:Document | HTMLElement,
        all?:boolean,
    }
    export function getHtmlElementFromDom(
        cssSelector:string,
        {targetObject = document,all = false}:HtmlElementOption ={}
    ):unknown{
    if(!isValidationOfStringAndNotNull(cssSelector)) return null;
    if(all){
        return targetObject.querySelectorAll(cssSelector);
        }

        return targetObject.querySelector(cssSelector);
    }