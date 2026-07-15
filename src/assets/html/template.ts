export const WINDOW_BODY_HTML = `
                            <!-- WindowSystem 本体 -->
                                <div class="window-header js-window-header-body">
                                    <div class="window-header-icon-box">
                                        <img class="window-header-icon js-window-header-icon" loading="lazy" src="">
                                    </div>
                                    <div class="window-header-title js-window-header-title-body">
                                        <div class="window-header-title-text js-window-header-title-box isScrollAnimation">
                                            <span class="js-window-header-title-text">エラー</span>
                                        </div>
                                    </div>
                                    <div class="window-header-button-area">
                                        <div class="window-header-button-box window-header-button-box-log">
                                            <button class="window-header-log-button window-header-button js-window-header-log-button">
                                                ㏒
                                            </button>
                                        </div>
                                        <div class="window-header-button-box">
                                            <button class="window-header-remove-button window-header-button js-window-header-delete-button">
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="window-body js-window-content-body">
                                    <div class="window-body-content js-window-content-box">
                                    </div>
                                </div>
                                <!-- WindowSystem 縁(当たり判定) -->
                                <!-- top/bottom/left/right -->
                                <span class="window-decision window-decision-top"></span>
                                <span class="window-decision window-decision-bottom"></span>
                                <span class="window-decision window-decision-left"></span>
                                <span class="window-decision window-decision-right"></span>
                                <!-- top-left/top-right/bottom-left/bottom-right -->
                                <span class="window-decision window-decision-top-left"></span>
                                <span class="window-decision window-decision-top-right"></span>
                                <span class="window-decision window-decision-bottom-left"></span>
                                <span class="window-decision window-decision-bottom-right"></span>
                        `;