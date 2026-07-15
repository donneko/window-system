function computeFontSizeEm(elementInnerText:HTMLElement):number{
    const ELEMENT_INNER_TEXT = elementInnerText;

    const ELEMENT_INNER_TEXT_COMPUTED_STYLE = window.getComputedStyle(ELEMENT_INNER_TEXT);
    const FONT_SIZE_PX = parseFloat(ELEMENT_INNER_TEXT_COMPUTED_STYLE.fontSize);

    return FONT_SIZE_PX;
}

export function isDisplayFitCompute(element:HTMLElement,elementInnerText:HTMLElement):boolean{
    const ELEMENT            = element;
    const ELEMENT_INNER_TEXT = elementInnerText ?? ELEMENT;

    const ELEMENT_STYLE = window.getComputedStyle(ELEMENT);
    const ONE_FONT      = computeFontSizeEm(ELEMENT_INNER_TEXT)

    const WIDTH_SIZE_PX = parseFloat(ELEMENT_STYLE.width)

    const ALL_TEXT_FONT_SIZE_PX     = ONE_FONT * ELEMENT_INNER_TEXT.textContent.length;
    const DISPLAY_WIDTH_COMPUTED_PX = WIDTH_SIZE_PX - ALL_TEXT_FONT_SIZE_PX;


    return DISPLAY_WIDTH_COMPUTED_PX > 0;
}

