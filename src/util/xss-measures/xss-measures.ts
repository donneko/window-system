export function xssMeasures(inputText:string):string{
    if(typeof inputText !== "string")return "";

    return inputText.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }