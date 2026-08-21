export const WINDOW_BODY_HTML = `
    <div class="window-header js-window-header-body">
        <div class="window-header-icon-box">
            <img class="window-header-icon js-window-header-icon" alt="" loading="lazy">
        </div>
        <div class="window-header-title js-window-header-title-body">
            <div class="window-header-title-box js-window-header-title-box">
                <span class="window-header-title-text js-window-header-title-text"></span>
            </div>
        </div>
        <div class="window-header-button-area">
            <button class="window-header-remove-button window-header-button js-window-header-delete-button"
                    type="button" aria-label="Close window">×</button>
        </div>
    </div>
    <div class="window-body js-window-content-body">
        <div class="window-body-content js-window-content-box">
            <iframe class="window-body-content-frame js-window-content-frame" title="Window content"></iframe>
        </div>
    </div>
    <span class="window-decision window-decision-top" data-resize-direction="n"></span>
    <span class="window-decision window-decision-bottom" data-resize-direction="s"></span>
    <span class="window-decision window-decision-left" data-resize-direction="w"></span>
    <span class="window-decision window-decision-right" data-resize-direction="e"></span>
    <span class="window-decision window-decision-top-left" data-resize-direction="nw"></span>
    <span class="window-decision window-decision-top-right" data-resize-direction="ne"></span>
    <span class="window-decision window-decision-bottom-left" data-resize-direction="sw"></span>
    <span class="window-decision window-decision-bottom-right" data-resize-direction="se"></span>
`;
