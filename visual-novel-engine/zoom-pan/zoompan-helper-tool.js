/**
 * ZoomPan Helper Tool - IIFE Version
 * Version: 1.2.1
 * 
 * This is a standalone IIFE version that can be used in:
 * - Browser developer console (copy-paste)
 * - HTML files (<script> tag)
 * - Bookmarklets
 * 
 * No Tampermonkey or other browser extensions required.
 */

(function () {
    'use strict';
    var _VERSION = "v1.2.1";
    var _AUTO_SHOW = true;
    var _SHOW_DELAY = 1; /* in seconds */

    // Wait for the page to be fully loaded and game objects to be available
    function waitForGameReady (callback, maxAttempts) {
        var attempts = 0;
        maxAttempts = typeof maxAttempts !== 'undefined' ? maxAttempts : 30;
        
        function checkReady () {
            attempts++;

            if (window.ig && window._DATAGAME && window.ig.game && window.ig.game.windowName !== 'game') {
                console.warn('ZoomPan Helper won\'t launch unless you\'re in game scene!');
            }
            if (window.ig && window._DATAGAME && window.ig.game && window.ig.game.windowName == 'game') {
                console.warn('ZoomPan Helper Initialized');
                callback();
                return;
            }

            if (attempts < maxAttempts) {
                setTimeout(checkReady, 1000);
            } else {
                console.warn('ZoomPan Helper Tool: Game objects not found after maximum attempts');
                console.warn('If the engine is not yet loaded, please wait and reload once the engine is fully loaded');
            }
        }

        checkReady();
    }

    // Initialize the helper tool once game is ready
    waitForGameReady(function () {
        initializeHelperTool();
    });

    function initializeHelperTool () {
        // Global helper object - attach to window so it's accessible
        window.ZoomPanHelperTool = {
            isOpen: false,
            helperWindow: null,
            autoApply: false,

            // Initialize the helper tool
            init: function () {
                this.createHelperWindow();
                this.bindEvents();
            },

            // Create the helper window HTML
            createHelperWindow: function () {
                if (this.helperWindow) {
                    this.helperWindow.remove();
                }

                var helperWindow = document.createElement('div');
                helperWindow.id = 'zoompan-helper-tool';
                helperWindow.innerHTML =
                    '<div class="zp-helper-header" id="zp-helper-header">' +
                        '<h3>ZoomPan Helper Tool</h3>' +
                        '<button id="zp-helper-close-btn" class="zp-close-btn">×</button>' +
                    '</div>' +
                    '<div class="zp-helper-content">' +
                        '<div class="zp-form-group">' +
                            '<label for="zp-scale-input">Scale (required):</label>' +
                            '<input type="number" id="zp-scale-input" class="zp-form-control" step="0.1" value="1" placeholder="e.g., 3">' +
                        '</div>' +
                        '<div class="zp-form-group">' +
                            '<label for="zp-posX-input">PosX (optional):</label>' +
                            '<input type="number" id="zp-posX-input" class="zp-form-control" placeholder="e.g., -100">' +
                        '</div>' +
                        '<div class="zp-form-group">' +
                            '<label for="zp-posY-input">PosY (optional):</label>' +
                            '<input type="number" id="zp-posY-input" class="zp-form-control" placeholder="e.g., 100">' +
                        '</div>' +
                        '<div class="zp-form-group">' +
                            '<label for="zp-moveX-input">MoveX (required):</label>' +
                            '<input type="number" id="zp-moveX-input" class="zp-form-control" value="0" placeholder="e.g., 150">' +
                        '</div>' +
                        '<div class="zp-form-group">' +
                            '<label for="zp-moveY-input">MoveY (required):</label>' +
                            '<input type="number" id="zp-moveY-input" class="zp-form-control" value="0" placeholder="e.g., 700">' +
                        '</div>' +
                        '<div class="zp-form-group">' +
                            '<label for="zp-time-input">Time (optional):</label>' +
                            '<input type="number" id="zp-time-input" class="zp-form-control" step="0.1" placeholder="e.g., 0.2">' +
                        '</div>' +
                        '<div class="zp-form-group">' +
                            '<label for="zp-delay-input">Delay (optional):</label>' +
                            '<input type="number" id="zp-delay-input" class="zp-form-control" step="0.1" placeholder="e.g., 0.5">' +
                        '</div>' +
                        '<div class="zp-form-group">' +
                            '<label for="zp-easing-input">Easing (optional):</label>' +
                            '<select id="zp-easing-input" class="zp-form-control">' +
                                '<option value="Linear.EaseNone">Linear.EaseNone</option>' +
                                '<option value="Quadratic.EaseIn">Quadratic.EaseIn</option>' +
                                '<option value="Quadratic.EaseOut">Quadratic.EaseOut</option>' +
                                '<option value="Quadratic.EaseInOut">Quadratic.EaseInOut</option>' +
                                '<option value="Cubic.EaseIn">Cubic.EaseIn</option>' +
                                '<option value="Cubic.EaseOut">Cubic.EaseOut</option>' +
                                '<option value="Cubic.EaseInOut">Cubic.EaseInOut</option>' +
                                '<option value="Quartic.EaseIn">Quartic.EaseIn</option>' +
                                '<option value="Quartic.EaseOut">Quartic.EaseOut</option>' +
                                '<option value="Quartic.EaseInOut">Quartic.EaseInOut</option>' +
                                '<option value="Quintic.EaseIn">Quintic.EaseIn</option>' +
                                '<option value="Quintic.EaseOut">Quintic.EaseOut</option>' +
                                '<option value="Quintic.EaseInOut">Quintic.EaseInOut</option>' +
                                '<option value="Sinusoidal.EaseIn">Sinusoidal.EaseIn</option>' +
                                '<option value="Sinusoidal.EaseOut">Sinusoidal.EaseOut</option>' +
                                '<option value="Sinusoidal.EaseInOut">Sinusoidal.EaseInOut</option>' +
                                '<option value="Exponential.EaseIn">Exponential.EaseIn</option>' +
                                '<option value="Exponential.EaseOut">Exponential.EaseOut</option>' +
                                '<option value="Exponential.EaseInOut">Exponential.EaseInOut</option>' +
                                '<option value="Circular.EaseIn">Circular.EaseIn</option>' +
                                '<option value="Circular.EaseOut">Circular.EaseOut</option>' +
                                '<option value="Circular.EaseInOut">Circular.EaseInOut</option>' +
                                '<option value="Elastic.EaseIn">Elastic.EaseIn</option>' +
                                '<option value="Elastic.EaseOut">Elastic.EaseOut</option>' +
                                '<option value="Elastic.EaseInOut">Elastic.EaseInOut</option>' +
                                '<option value="Back.EaseIn">Back.EaseIn</option>' +
                                '<option value="Back.EaseOut">Back.EaseOut</option>' +
                                '<option value="Back.EaseInOut">Back.EaseInOut</option>' +
                                '<option value="Bounce.EaseIn">Bounce.EaseIn</option>' +
                                '<option value="Bounce.EaseOut">Bounce.EaseOut</option>' +
                                '<option value="Bounce.EaseInOut">Bounce.EaseInOut</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="zp-form-group">' +
                            '<label for="zp-command-input">Command Line:</label>' +
                            '<input type="text" id="zp-command-input" class="zp-form-control zp-command-input" placeholder="ANIMEFFECT. zoom_pan scale 3 posX -100 posY 100 moveX 150 moveY 700 time 0.2 easing Cubic.EaseInOut">' +
                            '<div class="zp-command-buttons">' +
                                '<button id="zp-parse-command-btn" class="zp-parse-btn" title="Parse the command line into individual input fields">Parse Command</button>' +
                                '<button id="zp-generate-command-btn" class="zp-generate-btn" title="Generate command line from current input field values">Generate Command</button>' +
                                '<button id="zp-copy-command-btn" class="zp-copy-btn" title="Copy the current command to clipboard">📋</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="zp-button-group">' +
                            '<button id="zp-apply-zoompan-btn" class="zp-apply-btn">Apply ZoomPan</button>' +
                            '<button id="zp-reset-camera-btn" class="zp-reset-btn">Reset Camera</button>' +
                            '<button id="zp-clear-fields-btn" class="zp-clear-btn">Clear Fields</button>' +
                        '</div>' +
                        '<div class="zp-status-area">' +
                            '<div id="zp-helper-status"></div>' +
                        '</div>' +
                    '</div>';

                this.addStyles();
                document.body.appendChild(helperWindow);
                this.helperWindow = helperWindow;
                this.makeDraggable();
            },

            addStyles: function () {
                if (document.getElementById('zoompan-helper-styles')) return;

                var styles = document.createElement('style');
                styles.id = 'zoompan-helper-styles';
                styles.textContent =
                    '#zoompan-helper-tool { position: fixed; top: 50px; left: 20px; width: 380px; max-height: 90vh; background: rgba(0, 0, 0, 0.95); border: 2px solid #444; border-radius: 8px; color: white; font-family: Arial, sans-serif; font-size: 14px; z-index: 10000; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); display: flex; flex-direction: column; }' +
                    '.zp-helper-header { background: #333; padding: 10px 15px; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none; flex-shrink: 0; }' +
                    '.zp-helper-header h3 { margin: 0; color: #fff; font-size: 16px; }' +
                    '.zp-close-btn { background: #ff4444; border: none; color: white; width: 25px; height: 25px; border-radius: 50%; cursor: pointer; font-size: 16px; line-height: 1; }' +
                    '.zp-close-btn:hover { background: #ff6666; }' +
                    '.zp-helper-content { padding: 15px; overflow-y: auto; overflow-x: hidden; }' +
                    '.zp-form-group { margin-bottom: 15px; }' +
                    '.zp-form-group label { display: block; margin-bottom: 5px; color: #ccc; font-weight: bold; }' +
                    '.zp-form-control { width: 100%; padding: 8px; border: 1px solid #555; border-radius: 4px; background: #222; color: white; font-size: 14px; box-sizing: border-box; }' +
                    '.zp-form-control:focus { outline: none; border-color: #4CAF50; }' +
                    '.zp-command-input { font-family: monospace; font-size: 12px; }' +
                    '.zp-command-buttons { display: flex; gap: 5px; margin-top: 8px; }' +
                    '.zp-parse-btn, .zp-generate-btn { background: #FF9800; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; flex: 1; }' +
                    '.zp-parse-btn:hover, .zp-generate-btn:hover { background: #F57C00; }' +
                    '.zp-generate-btn { background: #9C27B0; }' +
                    '.zp-generate-btn:hover { background: #7B1FA2; }' +
                    '.zp-copy-btn { background: #6c757d; border: none; color: white; width: 35px; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }' +
                    '.zp-copy-btn:hover { background: #5a6268; }' +
                    '.zp-button-group { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; }' +
                    '.zp-apply-btn, .zp-reset-btn, .zp-clear-btn { flex: 1; padding: 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; }' +
                    '.zp-apply-btn { background: #4CAF50; color: white; }' +
                    '.zp-apply-btn:hover { background: #45a049; }' +
                    '.zp-reset-btn { background: #f44336; color: white; }' +
                    '.zp-reset-btn:hover { background: #da190b; }' +
                    '.zp-clear-btn { background: #2196F3; color: white; }' +
                    '.zp-clear-btn:hover { background: #1976D2; }' +
                    '.zp-status-area { margin-top: 15px; padding: 10px; background: #111; border-radius: 4px; min-height: 20px; transition: background-color 0.3s ease; }' +
                    '@keyframes zp-flash-success { 0% { background-color: rgba(76, 175, 80, 0.5); } 100% { background-color: #111; } }' +
                    '@keyframes zp-flash-error { 0% { background-color: rgba(255, 68, 68, 0.5); } 100% { background-color: #111; } }' +
                    '.zp-status-area.zp-status-flash-success { animation: zp-flash-success 1s ease-out; }' +
                    '.zp-status-area.zp-status-flash-error { animation: zp-flash-error 1s ease-out; }' +
                    '#zp-helper-status { font-size: 12px; color: #ccc; }' +
                    '.zp-status-success { color: #4CAF50 !important; }' +
                    '.zp-status-error { color: #ff4444 !important; }' +
                    '.zp-parse-btn[title]:hover::after, .zp-generate-btn[title]:hover::after, .zp-copy-btn[title]:hover::after { content: attr(title); position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: rgba(0, 0, 0, 0.9); color: white; padding: 6px 8px; border-radius: 4px; font-size: 12px; white-space: nowrap; z-index: 10001; margin-bottom: 5px; }' +
                    '.zp-parse-btn, .zp-generate-btn, .zp-copy-btn { position: relative; }' +
                    '.zp-parse-btn[title]:hover::before, .zp-generate-btn[title]:hover::before, .zp-copy-btn[title]:hover::before { content: ""; position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: rgba(0, 0, 0, 0.9); z-index: 10001; margin-bottom: -5px; }';
                document.head.appendChild(styles);
            },

            makeDraggable: function () {
                var header = document.getElementById('zp-helper-header');
                var windowEl = this.helperWindow;
                var isDragging = false,
                    initialX, initialY, xOffset = 0,
                    yOffset = 0;

                var dragStart = function (e) {
                    if (e.target.id === 'zp-helper-close-btn') return;
                    isDragging = true;
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                    header.style.cursor = 'grabbing';
                };

                var drag = function (e) {
                    if (isDragging) {
                        e.preventDefault();
                        xOffset = e.clientX - initialX;
                        yOffset = e.clientY - initialY;
                        windowEl.style.transform = 'translate(' + xOffset + 'px, ' + yOffset + 'px)';
                    }
                };

                var dragEnd = function () {
                    if (isDragging) {
                        isDragging = false;
                        header.style.cursor = 'move';
                    }
                };

                header.addEventListener('mousedown', dragStart);
                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', dragEnd);
            },

            parseCommand: function () {
                var commandInput = document.getElementById('zp-command-input');
                
                if (!commandInput) return;
                
                var command = commandInput.value.trim();

                if (!command) {
                    this.showStatus('Please enter a command', 'error');
                    return;
                }

                // Parse ANIMEFFECT command format
                // Expected: ANIMEFFECT. zoom_pan scale 3 posX -100 posY 100 moveX 150 moveY 700 time 0.2
                var parts = command.split(/\s+/);

                if (parts.length < 2 || !parts[0].toLowerCase().startsWith('animeffect')) {
                    this.showStatus('Command must start with "ANIMEFFECT."', 'error');
                    return;
                }

                if (parts[1].toLowerCase() !== 'zoom_pan') {
                    this.showStatus('Only zoom_pan type is supported', 'error');
                    return;
                }

                // Clear all fields first
                this.clearFields();

                // Parse parameters
                for (var i = 2; i < parts.length; i += 2) {
                    if (i + 1 >= parts.length) break;

                    var param = parts[i].toLowerCase();
                    var value = parts[i + 1];
                    var element;

                    switch (param) {
                        case 'scale':
                            element = document.getElementById('zp-scale-input');
                            if (element) element.value = value;
                            break;
                        case 'posx':
                            element = document.getElementById('zp-posX-input');
                            if (element) element.value = value;
                            break;
                        case 'posy':
                            element = document.getElementById('zp-posY-input');
                            if (element) element.value = value;
                            break;
                        case 'movex':
                            element = document.getElementById('zp-moveX-input');
                            if (element) element.value = value;
                            break;
                        case 'movey':
                            element = document.getElementById('zp-moveY-input');
                            if (element) element.value = value;
                            break;
                        case 'time':
                            element = document.getElementById('zp-time-input');
                            if (element) element.value = value;
                            break;
                        case 'delay':
                            element = document.getElementById('zp-delay-input');
                            if (element) element.value = value;
                            break;
                        case 'easing':
                            element = document.getElementById('zp-easing-input');
                            if (element) element.value = value;
                            break;
                    }
                }

                this.showStatus('Command parsed successfully. Click the Apply button to apply the effect', 'success');
            },

            generateCommand: function () {
                var scaleInput = document.getElementById('zp-scale-input');
                var posXInput = document.getElementById('zp-posX-input');
                var posYInput = document.getElementById('zp-posY-input');
                var moveXInput = document.getElementById('zp-moveX-input');
                var moveYInput = document.getElementById('zp-moveY-input');
                var timeInput = document.getElementById('zp-time-input');
                var delayInput = document.getElementById('zp-delay-input');
                var easingInput = document.getElementById('zp-easing-input');

                if (!scaleInput || !moveXInput || !moveYInput) return;

                var scale = scaleInput.value;
                var posX = posXInput ? posXInput.value : '';
                var posY = posYInput ? posYInput.value : '';
                var moveX = moveXInput.value;
                var moveY = moveYInput.value;
                var time = timeInput ? timeInput.value : '';
                var delay = delayInput ? delayInput.value : '';
                var easing = easingInput ? easingInput.value : '';

                // Validate required fields
                if (!scale || isNaN(parseFloat(scale))) {
                    this.showStatus('Scale is required to generate command', 'error');
                    return;
                }
                if (!moveX || isNaN(parseFloat(moveX))) {
                    this.showStatus('MoveX is required to generate command', 'error');
                    return;
                }
                if (!moveY || isNaN(parseFloat(moveY))) {
                    this.showStatus('MoveY is required to generate command', 'error');
                    return;
                }

                // Build command string
                var command = 'ANIMEFFECT. zoom_pan scale ' + scale;

                if (posX && posX.trim() !== '') {
                    command += ' posX ' + posX;
                }
                if (posY && posY.trim() !== '') {
                    command += ' posY ' + posY;
                }

                command += ' moveX ' + moveX + ' moveY ' + moveY;

                if (time && time.trim() !== '') {
                    command += ' time ' + time;
                }
                if (delay && delay.trim() !== '') {
                    command += ' delay ' + delay;
                }
                if (easing && easing.trim() !== '' && easing.trim() !== 'Linear.EaseNone') {
                    command += ' easing ' + easing;
                }

                // Set the command in the input field
                var commandInput = document.getElementById('zp-command-input');
                if (commandInput) {
                    commandInput.value = command;
                }
                this.showStatus('Command generated successfully', 'success');
            },

            copyCommand: function () {
                var commandInput = document.getElementById('zp-command-input');
                
                if (!commandInput) return;
                
                var command = commandInput.value.trim();

                if (!command) {
                    this.showStatus('No command to copy. Generate or enter a command first.', 'error');
                    return;
                }

                // Copy to clipboard
                var textArea = document.createElement('textarea');
                textArea.value = command;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    var successful = document.execCommand('copy');
                    if (successful) {
                        this.showStatus('Command copied to clipboard: ' + command, 'success');
                    } else {
                        this.showStatus('Failed to copy command', 'error');
                    }
                } catch (err) {
                    this.showStatus('Error copying command: ' + err, 'error');
                }

                document.body.removeChild(textArea);
            },

            clearFields: function () {
                var scaleInput = document.getElementById('zp-scale-input');
                var posXInput = document.getElementById('zp-posX-input');
                var posYInput = document.getElementById('zp-posY-input');
                var moveXInput = document.getElementById('zp-moveX-input');
                var moveYInput = document.getElementById('zp-moveY-input');
                var timeInput = document.getElementById('zp-time-input');
                var delayInput = document.getElementById('zp-delay-input');
                var easingInput = document.getElementById('zp-easing-input');
                var commandInput = document.getElementById('zp-command-input');

                if (scaleInput) scaleInput.value = '1';
                if (posXInput) posXInput.value = '';
                if (posYInput) posYInput.value = '';
                if (moveXInput) moveXInput.value = '0';
                if (moveYInput) moveYInput.value = '0';
                if (timeInput) timeInput.value = '';
                if (delayInput) delayInput.value = '';
                if (easingInput) easingInput.value = 'Linear.EaseNone';
                if (commandInput) commandInput.value = '';
                this.showStatus('Fields cleared', 'success');
            },

            applyZoomPan: function () {
                var scaleInput = document.getElementById('zp-scale-input');
                var posXInput = document.getElementById('zp-posX-input');
                var posYInput = document.getElementById('zp-posY-input');
                var moveXInput = document.getElementById('zp-moveX-input');
                var moveYInput = document.getElementById('zp-moveY-input');
                var timeInput = document.getElementById('zp-time-input');
                var delayInput = document.getElementById('zp-delay-input');
                var easingInput = document.getElementById('zp-easing-input');

                if (!scaleInput || !moveXInput || !moveYInput) return;

                var scale = parseFloat(scaleInput.value);
                var posX = posXInput ? posXInput.value : '';
                var posY = posYInput ? posYInput.value : '';
                var moveX = parseFloat(moveXInput.value);
                var moveY = parseFloat(moveYInput.value);
                var time = timeInput ? timeInput.value : '';
                var delay = delayInput ? delayInput.value : '';
                var easing = easingInput ? easingInput.value : '';

                // Validate required fields
                if (isNaN(scale)) {
                    this.showStatus('Scale is required and must be a number', 'error');
                    return;
                }
                if (isNaN(moveX)) {
                    this.showStatus('MoveX is required and must be a number', 'error');
                    return;
                }
                if (isNaN(moveY)) {
                    this.showStatus('MoveY is required and must be a number', 'error');
                    return;
                }

                try {
                    var gameController = window.ig.game.currentWindow;
                    if (!gameController) {
                        this.showStatus('Game controller not found. Make sure you are in a game scene.', 'error');
                        return;
                    }

                    // Convert values to proper types
                    var _zscale = scale;
                    var _zmoveX = moveX;
                    var _zmoveY = moveY;
                    var _zposX = posX !== '' ? parseFloat(posX) : null;
                    var _zposY = posY !== '' ? parseFloat(posY) : null;
                    var _zduration = time !== '' ? parseFloat(time) : null;
                    var _zdelay = delay !== '' ? parseFloat(delay) : 0;
                    var _zeasing = (easing && easing.trim() !== '') ? easing.trim() : '';

                    // Call the zoomPanCamera function directly
                    // zoomPanCamera(scl, moveX, moveY, posX, posY, duration, delayAnim, funcComp, tweenEasing, interval, sclStart, shakeDistance)
                    gameController.zoomPanCamera(_zscale, _zmoveX, _zmoveY, _zposX, _zposY, _zduration, _zdelay,
                        function () {
                            console.log('ZoomPan animation completed');
                        },
                        _zeasing
                    );

                    var statusMsg = 'Applied ZoomPan: scale=' + _zscale + ', moveX=' + _zmoveX + ', moveY=' + _zmoveY;
                    if (_zposX !== null) statusMsg += ', posX=' + _zposX;
                    if (_zposY !== null) statusMsg += ', posY=' + _zposY;
                    if (_zduration !== null) statusMsg += ', time=' + _zduration;
                    if (_zdelay > 0) statusMsg += ', delay=' + _zdelay;
                    if (_zeasing !== '') statusMsg += ', easing=' + _zeasing;

                    this.showStatus(statusMsg, 'success');
                } catch (error) {
                    this.showStatus('Error applying zoom/pan: ' + error.message, 'error');
                    console.error('ZoomPan error:', error);
                }
            },

            resetCamera: function () {
                try {
                    var gameController = window.ig.game.currentWindow;
                    if (!gameController) {
                        this.showStatus('Game controller not found. Make sure you are in a game scene.', 'error');
                        return;
                    }

                    // Stop any ongoing zoom/pan animations
                    if (gameController.zoomPanCameraTween) {
                        gameController.zoomPanCameraTween.stop();
                    }
                    if (gameController.zoomPanCameraTweenDuration) {
                        gameController.zoomPanCameraTweenDuration.stop();
                    }

                    // Reset camera to default values
                    gameController.zoomBG = 1;
                    gameController.posXBG = 0;
                    gameController.posYBG = 0;
                    gameController.anchorBGX = 0.5;
                    gameController.anchorBGY = 0.5;
                    gameController.lastposXBG = 0;
                    gameController.lastposYBG = 0;

                    if (gameController.bg) {
                        gameController.bg.pntX = 0.5;
                        gameController.bg.pntY = 0.5;
                        gameController.bg.statMove = gameController.bg.moveStatus.NONE;
                    }

                    gameController.boolZoomPanCamera = false;
                    gameController.dataZoomPanCamera = null;

                    this.showStatus('Camera reset to default position', 'success');
                } catch (error) {
                    this.showStatus('Error resetting camera: ' + error.message, 'error');
                    console.error('Camera reset error:', error);
                }
            },

            showStatus: function (message, type) {
                if (typeof type === 'undefined') type = 'info';
                
                if (!this.helperWindow) return;
                
                var statusArea = this.helperWindow.querySelector('.zp-status-area');
                var statusEl = document.getElementById('zp-helper-status');

                if (!statusEl) return;

                // Update text and text color
                statusEl.textContent = message;
                statusEl.className = type === 'error' ? 'zp-status-error' : (type === 'success' ? 'zp-status-success' : '');

                // Trigger background flash animation
                if (statusArea) {
                    // Remove previous animation classes to allow re-triggering
                    statusArea.classList.remove('zp-status-flash-success', 'zp-status-flash-error');

                    // Force a reflow for the animation to restart if the same class is added again.
                    void statusArea.offsetWidth;

                    if (type === 'success') {
                        statusArea.classList.add('zp-status-flash-success');
                    } else if (type === 'error') {
                        statusArea.classList.add('zp-status-flash-error');
                    }
                }
            },

            bindEvents: function () {
                var self = this;

                // Window Controls
                document.getElementById('zp-helper-close-btn').addEventListener('click', function () { self.close(); });

                // Action Buttons
                document.getElementById('zp-apply-zoompan-btn').addEventListener('click', function () { self.applyZoomPan(); });
                document.getElementById('zp-reset-camera-btn').addEventListener('click', function () { self.resetCamera(); });
                document.getElementById('zp-clear-fields-btn').addEventListener('click', function () { self.clearFields(); });
                document.getElementById('zp-parse-command-btn').addEventListener('click', function () { self.parseCommand(); });
                document.getElementById('zp-generate-command-btn').addEventListener('click', function () { self.generateCommand(); });
                document.getElementById('zp-copy-command-btn').addEventListener('click', function () { self.copyCommand(); });

                // Enter key support for command input
                document.getElementById('zp-command-input').addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        self.parseCommand();
                    }
                });
            },

            open: function () {
                if (this.isOpen) return;
                this.init();
                this.isOpen = true;
                this.showStatus('ZoomPan Helper Tool ready');
            },

            close: function () {
                if (this.helperWindow) {
                    this.helperWindow.remove();
                    this.helperWindow = null;
                }
                this.isOpen = false;
            }
        };

        // Global functions and shortcuts
        window.beginZoomPanHelper = function () {
            window.ZoomPanHelperTool.open();
        };

        window.endZoomPanHelper = function () {
            window.ZoomPanHelperTool.close();
        };

        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
                e.preventDefault();
                if (window.ZoomPanHelperTool.isOpen) {
                    window.endZoomPanHelper();
                } else {
                    window.beginZoomPanHelper();
                }
            }
        });

        console.log(_VERSION + ' ZoomPan Helper Tool loaded! Use beginZoomPanHelper() to open the helper window or press Ctrl+Shift+Z');
        
        if (_AUTO_SHOW) {
            console.log('ZoomPan Helper: Showing UI in ' + _SHOW_DELAY + ' second(s)');
            setTimeout(function () { window.beginZoomPanHelper();}, _SHOW_DELAY);
        }

    }

})();