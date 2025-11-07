/**
 * Object Helper Tool - IIFE Version
 * Version: 1.0.0
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
    var _VERSION = "v1.0.0";
    var _AUTO_SHOW = true;
    var _SHOW_DELAY = 1; /* in seconds */

    // Wait for the page to be fully loaded and game objects to be available
    function waitForGameReady (callback, maxAttempts) {
        var attempts = 0;
        maxAttempts = typeof maxAttempts !== 'undefined' ? maxAttempts : 30;
        
        function checkReady () {
            attempts++;

            if (window.ig && window._DATAGAME && window.ig.game && window.ig.game.windowName !== 'game') {
                console.warn('Object Helper won\'t launch unless you\'re in game scene!');
            }
            if (window.ig && window._DATAGAME && window.ig.game && window.ig.game.windowName == 'game') {
                console.warn('Object Helper Initialized');
                callback();
                return;
            }

            if (attempts < maxAttempts) {
                setTimeout(checkReady, 1000);
            } else {
                console.warn('Object Helper Tool: Game objects not found after maximum attempts');
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
        window.ObjectHelperTool = {
            isOpen: false,
            helperWindow: null,

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
                helperWindow.id = 'object-helper-tool';
                helperWindow.innerHTML =
                    '<div class="obj-helper-header" id="obj-helper-header">' +
                        '<h3>Object Helper Tool</h3>' +
                        '<button id="obj-helper-close-btn" class="obj-close-btn">×</button>' +
                    '</div>' +
                    '<div class="obj-helper-content">' +
                        '<div class="obj-form-group">' +
                            '<label for="obj-objectID-input">Object ID (required):</label>' +
                            '<input type="text" id="obj-objectID-input" class="obj-form-control" placeholder="e.g., basketball">' +
                        '</div>' +
                        '<div class="obj-form-group">' +
                            '<label for="obj-source-input">Source Image (required):</label>' +
                            '<input type="text" id="obj-source-input" class="obj-form-control" placeholder="e.g., ball">' +
                        '</div>' +
                        '<div class="obj-section-header">FROM Properties (Initial State)</div>' +
                        '<div class="obj-form-row">' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-from-x">X:</label>' +
                                '<input type="number" id="obj-from-x" class="obj-form-control" placeholder="0">' +
                            '</div>' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-from-y">Y:</label>' +
                                '<input type="number" id="obj-from-y" class="obj-form-control" placeholder="0">' +
                            '</div>' +
                        '</div>' +
                        '<div class="obj-form-row">' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-from-scaleX">ScaleX:</label>' +
                                '<input type="number" id="obj-from-scaleX" class="obj-form-control" step="0.1" placeholder="1">' +
                            '</div>' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-from-scaleY">ScaleY:</label>' +
                                '<input type="number" id="obj-from-scaleY" class="obj-form-control" step="0.1" placeholder="1">' +
                            '</div>' +
                        '</div>' +
                        '<div class="obj-form-row">' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-from-angle">Angle:</label>' +
                                '<input type="number" id="obj-from-angle" class="obj-form-control" placeholder="0">' +
                            '</div>' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-from-alpha">Alpha:</label>' +
                                '<input type="number" id="obj-from-alpha" class="obj-form-control" step="0.1" min="0" max="1" placeholder="1">' +
                            '</div>' +
                        '</div>' +
                        '<div class="obj-section-header">TO Properties (Tween Target - Optional)</div>' +
                        '<div class="obj-form-row">' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-to-x">X:</label>' +
                                '<input type="number" id="obj-to-x" class="obj-form-control" placeholder="">' +
                            '</div>' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-to-y">Y:</label>' +
                                '<input type="number" id="obj-to-y" class="obj-form-control" placeholder="">' +
                            '</div>' +
                        '</div>' +
                        '<div class="obj-form-row">' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-to-scaleX">ScaleX:</label>' +
                                '<input type="number" id="obj-to-scaleX" class="obj-form-control" step="0.1" placeholder="">' +
                            '</div>' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-to-scaleY">ScaleY:</label>' +
                                '<input type="number" id="obj-to-scaleY" class="obj-form-control" step="0.1" placeholder="">' +
                            '</div>' +
                        '</div>' +
                        '<div class="obj-form-row">' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-to-angle">Angle:</label>' +
                                '<input type="number" id="obj-to-angle" class="obj-form-control" placeholder="">' +
                            '</div>' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-to-alpha">Alpha:</label>' +
                                '<input type="number" id="obj-to-alpha" class="obj-form-control" step="0.1" min="0" max="1" placeholder="">' +
                            '</div>' +
                        '</div>' +
                        '<div class="obj-section-header">Additional Properties</div>' +
                        '<div class="obj-info-note">💡 Note: When updating existing objects, changes to fields from Delay onwards may require modifying Time or position fields first to take effect.</div>' +
                        '<div class="obj-form-row">' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-time-input">Time (seconds):</label>' +
                                '<input type="number" id="obj-time-input" class="obj-form-control" step="0.1" placeholder="">' +
                            '</div>' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-delay-input">Delay (seconds):</label>' +
                                '<input type="number" id="obj-delay-input" class="obj-form-control" step="0.1" placeholder="">' +
                            '</div>' +
                        '</div>' +
                        '<div class="obj-form-row">' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-pivotX-input">PivotX (0-1):</label>' +
                                '<input type="number" id="obj-pivotX-input" class="obj-form-control" step="0.1" min="0" max="1" placeholder="0.5">' +
                            '</div>' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-pivotY-input">PivotY (0-1):</label>' +
                                '<input type="number" id="obj-pivotY-input" class="obj-form-control" step="0.1" min="0" max="1" placeholder="0.5">' +
                            '</div>' +
                        '</div>' +
                        '<div class="obj-form-row">' +
                            '<div class="obj-form-group obj-half">' +
                                '<label><input type="checkbox" id="obj-flipX-input"> FlipX</label>' +
                            '</div>' +
                            '<div class="obj-form-group obj-half">' +
                                '<label><input type="checkbox" id="obj-flipY-input"> FlipY</label>' +
                            '</div>' +
                        '</div>' +
                        '<div class="obj-form-group">' +
                            '<label for="obj-easing-input">Easing:</label>' +
                            '<select id="obj-easing-input" class="obj-form-control">' +
                                '<option value="Linear.EaseNone">Linear.EaseNone</option>' +
                                '<option value="Quadratic.EaseIn">Quadratic.EaseIn</option>' +
                                '<option value="Quadratic.EaseOut">Quadratic.EaseOut</option>' +
                                '<option value="Quadratic.EaseInOut">Quadratic.EaseInOut</option>' +
                                '<option value="Cubic.EaseIn">Cubic.EaseIn</option>' +
                                '<option value="Cubic.EaseOut">Cubic.EaseOut</option>' +
                                '<option value="Cubic.EaseInOut">Cubic.EaseInOut</option>' +
                                '<option value="Bounce.EaseIn">Bounce.EaseIn</option>' +
                                '<option value="Bounce.EaseOut">Bounce.EaseOut</option>' +
                                '<option value="Bounce.EaseInOut">Bounce.EaseInOut</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="obj-form-row">' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-zIndex-input">zIndex:</label>' +
                                '<input type="number" id="obj-zIndex-input" class="obj-form-control" placeholder="0">' +
                            '</div>' +
                            '<div class="obj-form-group obj-half">' +
                                '<label for="obj-textDelay-input">TextDelay:</label>' +
                                '<input type="number" id="obj-textDelay-input" class="obj-form-control" step="0.1" placeholder="">' +
                            '</div>' +
                        '</div>' +
                        '<div class="obj-form-row">' +
                            '<div class="obj-form-group obj-half">' +
                                '<label><input type="checkbox" id="obj-remove-input"> Remove</label>' +
                            '</div>' +
                            '<div class="obj-form-group obj-half">' +
                                '<label><input type="checkbox" id="obj-persist-input"> Persist</label>' +
                            '</div>' +
                        '</div>' +
                        '<div class="obj-form-group">' +
                            '<label for="obj-loop-input">Loop:</label>' +
                            '<select id="obj-loop-input" class="obj-form-control">' +
                                '<option value="">None</option>' +
                                '<option value="revert">Revert</option>' +
                                '<option value="reverse">Reverse</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="obj-form-group">' +
                            '<label for="obj-tint-input">Tint (hex or "none"):</label>' +
                            '<input type="text" id="obj-tint-input" class="obj-form-control" placeholder="e.g., #fff000 or none">' +
                        '</div>' +
                        '<div class="obj-form-group">' +
                            '<label for="obj-command-input">Command Line:</label>' +
                            '<input type="text" id="obj-command-input" class="obj-form-control obj-command-input" placeholder="OBJECT. basketball ball from { x:0,y:0 } to { x:0,y:400 } time 1">' +
                            '<div class="obj-command-buttons">' +
                                '<button id="obj-parse-command-btn" class="obj-parse-btn">Parse Command</button>' +
                                '<button id="obj-generate-command-btn" class="obj-generate-btn">Generate Command</button>' +
                                '<button id="obj-copy-command-btn" class="obj-copy-btn">📋</button>' +
                            '</div>' +
                        '</div>' +
                        '<div class="obj-button-group">' +
                            '<button id="obj-apply-btn" class="obj-apply-btn">Apply to Scene</button>' +
                            '<button id="obj-clear-fields-btn" class="obj-clear-btn">Clear Fields</button>' +
                        '</div>' +
                        '<div class="obj-status-area">' +
                            '<div id="obj-helper-status"></div>' +
                        '</div>' +
                    '</div>';

                this.addStyles();
                document.body.appendChild(helperWindow);
                this.helperWindow = helperWindow;
                this.makeDraggable();
            },

            addStyles: function () {
                if (document.getElementById('object-helper-styles')) return;

                var styles = document.createElement('style');
                styles.id = 'object-helper-styles';
                styles.textContent =
                    '#object-helper-tool { position: fixed; top: 50px; right: 400px; width: 420px; max-height: 90vh; background: rgba(0, 0, 0, 0.95); border: 2px solid #444; border-radius: 8px; color: white; font-family: Arial, sans-serif; font-size: 14px; z-index: 10000; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); display: flex; flex-direction: column; }' +
                    '.obj-helper-header { background: #333; padding: 10px 15px; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none; flex-shrink: 0; }' +
                    '.obj-helper-header h3 { margin: 0; color: #fff; font-size: 16px; }' +
                    '.obj-close-btn { background: #ff4444; border: none; color: white; width: 25px; height: 25px; border-radius: 50%; cursor: pointer; font-size: 16px; line-height: 1; }' +
                    '.obj-close-btn:hover { background: #ff6666; }' +
                    '.obj-helper-content { padding: 15px; overflow-y: auto; overflow-x: hidden; }' +
                    '.obj-form-group { margin-bottom: 12px; }' +
                    '.obj-form-group label { display: block; margin-bottom: 5px; color: #ccc; font-weight: bold; font-size: 12px; }' +
                    '.obj-form-control { width: 100%; padding: 6px; border: 1px solid #555; border-radius: 4px; background: #222; color: white; font-size: 13px; box-sizing: border-box; }' +
                    '.obj-form-control:focus { outline: none; border-color: #4CAF50; }' +
                    '.obj-form-row { display: flex; gap: 10px; }' +
                    '.obj-half { flex: 1; }' +
                    '.obj-section-header { background: #444; padding: 8px; margin: 15px -15px 10px -15px; font-weight: bold; font-size: 13px; color: #4CAF50; }' +
                    '.obj-info-note { background: #2a2a2a; border-left: 3px solid #FF9800; padding: 8px 10px; margin: 10px 0; font-size: 11px; color: #ffcc80; line-height: 1.4; }' +
                    '.obj-command-input { font-family: monospace; font-size: 11px; }' +
                    '.obj-command-buttons { display: flex; gap: 5px; margin-top: 8px; }' +
                    '.obj-parse-btn, .obj-generate-btn { background: #FF9800; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; flex: 1; }' +
                    '.obj-parse-btn:hover, .obj-generate-btn:hover { background: #F57C00; }' +
                    '.obj-generate-btn { background: #9C27B0; }' +
                    '.obj-generate-btn:hover { background: #7B1FA2; }' +
                    '.obj-copy-btn { background: #6c757d; border: none; color: white; width: 35px; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 14px; }' +
                    '.obj-copy-btn:hover { background: #5a6268; }' +
                    '.obj-button-group { display: flex; gap: 8px; margin-top: 15px; }' +
                    '.obj-apply-btn { flex: 1; padding: 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; background: #4CAF50; color: white; }' +
                    '.obj-apply-btn:hover { background: #45a049; }' +
                    '.obj-clear-btn { flex: 1; padding: 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; background: #2196F3; color: white; }' +
                    '.obj-clear-btn:hover { background: #1976D2; }' +
                    '.obj-status-area { margin-top: 15px; padding: 10px; background: #111; border-radius: 4px; min-height: 20px; }' +
                    '#obj-helper-status { font-size: 11px; color: #ccc; }' +
                    '.obj-status-success { color: #4CAF50 !important; }' +
                    '.obj-status-error { color: #ff4444 !important; }';
                document.head.appendChild(styles);
            },

            makeDraggable: function () {
                var header = document.getElementById('obj-helper-header');
                var windowEl = this.helperWindow;
                var isDragging = false,
                    initialX, initialY, xOffset = 0,
                    yOffset = 0;

                var dragStart = function (e) {
                    if (e.target.id === 'obj-helper-close-btn') return;
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
                var commandInput = document.getElementById('obj-command-input');
                if (!commandInput) return;

                var command = commandInput.value.trim();
                if (!command) {
                    this.showStatus('Please enter a command', 'error');
                    return;
                }

                var parts = command.split(/\s+/);
                if (parts.length < 3 || !parts[0].toLowerCase().startsWith('object')) {
                    this.showStatus('Command must start with "OBJECT."', 'error');
                    return;
                }

                // Clear fields first
                this.clearFields();

                // Parse objectID and source
                document.getElementById('obj-objectID-input').value = parts[1];
                document.getElementById('obj-source-input').value = parts[2];

                // Parse properties
                var i = 3;
                while (i < parts.length) {
                    var key = parts[i].toLowerCase();

                    if (key === 'from' || key === 'to') {
                        // Parse object notation { x:0, y:0, ... }
                        var objStr = '';
                        var braceCount = 0;
                        i++;
                        while (i < parts.length) {
                            objStr += parts[i] + ' ';
                            for (var c = 0; c < parts[i].length; c++) {
                                if (parts[i][c] === '{') braceCount++;
                                if (parts[i][c] === '}') braceCount--;
                            }
                            i++;
                            if (braceCount === 0) break;
                        }

                        // Parse the object properties
                        var prefix = key === 'from' ? 'obj-from-' : 'obj-to-';
                        var props = objStr.match(/(\w+)\s*:\s*([^,}]+)/g);
                        if (props) {
                            props.forEach(function (prop) {
                                var match = prop.match(/(\w+)\s*:\s*([^,}]+)/);
                                if (match) {
                                    var propName = match[1].toLowerCase();
                                    var propValue = match[2].trim();
                                    var el = document.getElementById(prefix + propName);
                                    if (el) el.value = propValue;
                                }
                            });
                        }
                    } else {
                        // Parse simple key-value pairs
                        if (i + 1 < parts.length) {
                            var value = parts[i + 1];
                            var element;

                            switch (key) {
                                case 'time':
                                    element = document.getElementById('obj-time-input');
                                    if (element) element.value = value;
                                    break;
                                case 'delay':
                                    element = document.getElementById('obj-delay-input');
                                    if (element) element.value = value;
                                    break;
                                case 'pivotx':
                                    element = document.getElementById('obj-pivotX-input');
                                    if (element) element.value = value;
                                    break;
                                case 'pivoty':
                                    element = document.getElementById('obj-pivotY-input');
                                    if (element) element.value = value;
                                    break;
                                case 'flipx':
                                    element = document.getElementById('obj-flipX-input');
                                    if (element) element.checked = value.toLowerCase() === 'true';
                                    break;
                                case 'flipy':
                                    element = document.getElementById('obj-flipY-input');
                                    if (element) element.checked = value.toLowerCase() === 'true';
                                    break;
                                case 'easing':
                                    element = document.getElementById('obj-easing-input');
                                    if (element) element.value = value;
                                    break;
                                case 'zindex':
                                    element = document.getElementById('obj-zIndex-input');
                                    if (element) element.value = value;
                                    break;
                                case 'remove':
                                    element = document.getElementById('obj-remove-input');
                                    if (element) element.checked = value.toLowerCase() === 'true';
                                    break;
                                case 'persist':
                                    element = document.getElementById('obj-persist-input');
                                    if (element) element.checked = value.toLowerCase() === 'true';
                                    break;
                                case 'loop':
                                    element = document.getElementById('obj-loop-input');
                                    if (element) element.value = value;
                                    break;
                                case 'tint':
                                    element = document.getElementById('obj-tint-input');
                                    if (element) element.value = value;
                                    break;
                                case 'textdelay':
                                    element = document.getElementById('obj-textDelay-input');
                                    if (element) element.value = value;
                                    break;
                            }
                            i += 2;
                        } else {
                            i++;
                        }
                    }
                }

                this.showStatus('Command parsed successfully', 'success');
            },

            generateCommand: function () {
                var objectID = document.getElementById('obj-objectID-input').value.trim();
                var source = document.getElementById('obj-source-input').value.trim();

                if (!objectID || !source) {
                    this.showStatus('Object ID and Source are required', 'error');
                    return;
                }

                var command = 'OBJECT. ' + objectID + ' ' + source;

                // Build FROM object
                var fromProps = [];
                var fromX = document.getElementById('obj-from-x').value;
                var fromY = document.getElementById('obj-from-y').value;
                var fromScaleX = document.getElementById('obj-from-scaleX').value;
                var fromScaleY = document.getElementById('obj-from-scaleY').value;
                var fromAngle = document.getElementById('obj-from-angle').value;
                var fromAlpha = document.getElementById('obj-from-alpha').value;

                if (fromX) fromProps.push('x:' + fromX);
                if (fromY) fromProps.push('y:' + fromY);
                if (fromScaleX) fromProps.push('scaleX:' + fromScaleX);
                if (fromScaleY) fromProps.push('scaleY:' + fromScaleY);
                if (fromAngle) fromProps.push('angle:' + fromAngle);
                if (fromAlpha) fromProps.push('alpha:' + fromAlpha);

                if (fromProps.length > 0) {
                    command += ' from { ' + fromProps.join(',') + ' }';
                }

                // Build TO object
                var toProps = [];
                var toX = document.getElementById('obj-to-x').value;
                var toY = document.getElementById('obj-to-y').value;
                var toScaleX = document.getElementById('obj-to-scaleX').value;
                var toScaleY = document.getElementById('obj-to-scaleY').value;
                var toAngle = document.getElementById('obj-to-angle').value;
                var toAlpha = document.getElementById('obj-to-alpha').value;

                if (toX) toProps.push('x:' + toX);
                if (toY) toProps.push('y:' + toY);
                if (toScaleX) toProps.push('scaleX:' + toScaleX);
                if (toScaleY) toProps.push('scaleY:' + toScaleY);
                if (toAngle) toProps.push('angle:' + toAngle);
                if (toAlpha) toProps.push('alpha:' + toAlpha);

                if (toProps.length > 0) {
                    command += ' to { ' + toProps.join(',') + ' }';
                }

                // Add other properties
                var time = document.getElementById('obj-time-input').value;
                var delay = document.getElementById('obj-delay-input').value;
                var pivotX = document.getElementById('obj-pivotX-input').value;
                var pivotY = document.getElementById('obj-pivotY-input').value;
                var flipX = document.getElementById('obj-flipX-input').checked;
                var flipY = document.getElementById('obj-flipY-input').checked;
                var easing = document.getElementById('obj-easing-input').value;
                var zIndex = document.getElementById('obj-zIndex-input').value;
                var remove = document.getElementById('obj-remove-input').checked;
                var persist = document.getElementById('obj-persist-input').checked;
                var loop = document.getElementById('obj-loop-input').value;
                var tint = document.getElementById('obj-tint-input').value.trim();
                var textDelay = document.getElementById('obj-textDelay-input').value;

                if (time) command += ' time ' + time;
                if (delay) command += ' delay ' + delay;
                if (pivotX) command += ' pivotX ' + pivotX;
                if (pivotY) command += ' pivotY ' + pivotY;
                if (flipX) command += ' flipX true';
                if (flipY) command += ' flipY true';
                if (easing && easing !== 'Linear.EaseNone') command += ' easing ' + easing;
                if (zIndex) command += ' zIndex ' + zIndex;
                if (remove) command += ' remove true';
                if (persist) command += ' persist true';
                if (loop) command += ' loop ' + loop;
                if (tint) command += ' tint ' + tint;
                if (textDelay) command += ' textDelay ' + textDelay;

                var commandInput = document.getElementById('obj-command-input');
                if (commandInput) {
                    commandInput.value = command;
                }
                this.showStatus('Command generated successfully', 'success');
            },

            copyCommand: function () {
                var commandInput = document.getElementById('obj-command-input');
                if (!commandInput) return;

                var command = commandInput.value.trim();
                if (!command) {
                    this.showStatus('No command to copy. Generate or enter a command first.', 'error');
                    return;
                }

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
                        this.showStatus('Command copied to clipboard', 'success');
                    } else {
                        this.showStatus('Failed to copy command', 'error');
                    }
                } catch (err) {
                    this.showStatus('Error copying command: ' + err, 'error');
                }

                document.body.removeChild(textArea);
            },

            applyToScene: function () {
                // Check if game is ready
                if (!window.ig || !window.ig.game || !window.ig.game.windowName) {
                    this.showStatus('Game not ready. Make sure you are in the game scene.', 'error');
                    return;
                }

                if (window.ig.game.windowName !== 'game') {
                    this.showStatus('You must be in the game scene to apply objects.', 'error');
                    return;
                }

                var objectID = document.getElementById('obj-objectID-input').value.trim();
                var source = document.getElementById('obj-source-input').value.trim();

                if (!objectID || !source) {
                    this.showStatus('Object ID and Source are required', 'error');
                    return;
                }

                // Preload the image before applying the object
                this.preloadImageAndApply(objectID, source);
            },

            preloadImageAndApply: function (objectID, source) {
                var self = this;

                // Build the image path
                var imagePath = window._BASEPATH.object + source + '.png';

                // Check if image is already in cache and loaded
                if (window.ig.Image.cache[imagePath] && window.ig.Image.cache[imagePath].loaded) {
                    // Image already loaded, proceed immediately
                    self.applyObjectToScene(objectID, source);
                    return;
                }

                // Show loading status
                self.showStatus('Loading image: ' + source + '.png...', 'info');

                // Create and preload the image
                var preloadImage = new window.ig.Image(imagePath);

                // Set up a callback to apply the object once the image is loaded
                var checkImageLoaded = function () {
                    if (preloadImage.loaded) {
                        self.applyObjectToScene(objectID, source);
                    } else if (preloadImage.failed) {
                        self.showStatus('Error: Failed to load image "' + source + '.png". Check that the file exists in the objects folder.', 'error');
                    } else {
                        // Image still loading, check again in 100ms
                        setTimeout(checkImageLoaded, 100);
                    }
                };

                // Start checking if image is loaded
                setTimeout(checkImageLoaded, 100);
            },

            applyObjectToScene: function (objectID, source) {
                // Build FROM object
                var fromObj = {};
                var fromX = document.getElementById('obj-from-x').value;
                var fromY = document.getElementById('obj-from-y').value;
                var fromScaleX = document.getElementById('obj-from-scaleX').value;
                var fromScaleY = document.getElementById('obj-from-scaleY').value;
                var fromAngle = document.getElementById('obj-from-angle').value;
                var fromAlpha = document.getElementById('obj-from-alpha').value;

                if (fromX) fromObj.x = parseFloat(fromX);
                if (fromY) fromObj.y = parseFloat(fromY);
                if (fromScaleX) fromObj.scaleX = parseFloat(fromScaleX);
                if (fromScaleY) fromObj.scaleY = parseFloat(fromScaleY);
                if (fromAngle) fromObj.angle = parseFloat(fromAngle);
                if (fromAlpha) fromObj.alpha = parseFloat(fromAlpha);

                // Build TO object
                var toObj = null;
                var toX = document.getElementById('obj-to-x').value;
                var toY = document.getElementById('obj-to-y').value;
                var toScaleX = document.getElementById('obj-to-scaleX').value;
                var toScaleY = document.getElementById('obj-to-scaleY').value;
                var toAngle = document.getElementById('obj-to-angle').value;
                var toAlpha = document.getElementById('obj-to-alpha').value;

                if (toX || toY || toScaleX || toScaleY || toAngle || toAlpha) {
                    toObj = {};
                    if (toX) toObj.x = parseFloat(toX);
                    if (toY) toObj.y = parseFloat(toY);
                    if (toScaleX) toObj.scaleX = parseFloat(toScaleX);
                    if (toScaleY) toObj.scaleY = parseFloat(toScaleY);
                    if (toAngle) toObj.angle = parseFloat(toAngle);
                    if (toAlpha) toObj.alpha = parseFloat(toAlpha);
                }

                // Build object data structure
                var objectData = {
                    id: Object.keys(ig.game.currentWindow.entityOverlay).length,
                    objectID: objectID,
                    source: source,
                    from: fromObj,
                    to: toObj
                };

                // Add other properties
                var time = document.getElementById('obj-time-input').value;
                var delay = document.getElementById('obj-delay-input').value;
                var pivotX = document.getElementById('obj-pivotX-input').value;
                var pivotY = document.getElementById('obj-pivotY-input').value;
                var flipX = document.getElementById('obj-flipX-input').checked;
                var flipY = document.getElementById('obj-flipY-input').checked;
                var easing = document.getElementById('obj-easing-input').value;
                var zIndex = document.getElementById('obj-zIndex-input').value;
                var remove = document.getElementById('obj-remove-input').checked;
                var persist = document.getElementById('obj-persist-input').checked;
                var loop = document.getElementById('obj-loop-input').value;
                var tint = document.getElementById('obj-tint-input').value.trim();
                var textDelay = document.getElementById('obj-textDelay-input').value;

                if (time) objectData.time = parseFloat(time);
                if (delay) objectData.delay = parseFloat(delay);
                if (pivotX) objectData.pivotX = parseFloat(pivotX);
                if (pivotY) objectData.pivotY = parseFloat(pivotY);
                if (flipX) objectData.flipX = true;
                if (flipY) objectData.flipY = true;
                if (easing && easing !== 'Linear.EaseNone') objectData.easing = easing;
                if (zIndex) objectData.zIndex = parseInt(zIndex);
                if (remove) objectData.remove = true;
                if (persist) objectData.persist = true;
                if (loop) objectData.loop = loop;
                if (tint) objectData.tint = tint;
                if (textDelay) objectData.textDelay = parseFloat(textDelay);

                // Preserve existing objects without re-initializing their tweens
                var objectArray = [];
                var currentWindow = window.ig.game.currentWindow;

                // Add lightweight placeholders for existing objects to prevent deletion
                if (currentWindow.entityOverlay) {
                    for (var existingID in currentWindow.entityOverlay) {
                        if (currentWindow.entityOverlay[existingID] && existingID !== objectID) {
                            // Push a placeholder that skips re-initialization in placeOverlayObject
                            objectArray.push({
                                id: objectArray.length,
                                objectID: existingID,
                                chain: 999999
                            });
                        }
                    }
                }

                // Ensure the new/updated object gets a unique, sequential id at the end
                objectData.id = objectArray.length;
                objectArray.push(objectData);

                // Create a story object with all objects
                var storyData = {
                    object: objectArray
                };

                try {
                    // Call placeOverlayObject with animation enabled
                    currentWindow.placeOverlayObject(true, storyData);
                    this.showStatus('Object "' + objectID + '" applied to scene successfully!', 'success');
                } catch (err) {
                    this.showStatus('Error applying object: ' + err.message, 'error');
                    console.error('Object Helper Error:', err);
                }
            },

            clearFields: function () {
                document.getElementById('obj-objectID-input').value = '';
                document.getElementById('obj-source-input').value = '';
                document.getElementById('obj-from-x').value = '';
                document.getElementById('obj-from-y').value = '';
                document.getElementById('obj-from-scaleX').value = '';
                document.getElementById('obj-from-scaleY').value = '';
                document.getElementById('obj-from-angle').value = '';
                document.getElementById('obj-from-alpha').value = '';
                document.getElementById('obj-to-x').value = '';
                document.getElementById('obj-to-y').value = '';
                document.getElementById('obj-to-scaleX').value = '';
                document.getElementById('obj-to-scaleY').value = '';
                document.getElementById('obj-to-angle').value = '';
                document.getElementById('obj-to-alpha').value = '';
                document.getElementById('obj-time-input').value = '';
                document.getElementById('obj-delay-input').value = '';
                document.getElementById('obj-pivotX-input').value = '';
                document.getElementById('obj-pivotY-input').value = '';
                document.getElementById('obj-flipX-input').checked = false;
                document.getElementById('obj-flipY-input').checked = false;
                document.getElementById('obj-easing-input').value = 'Linear.EaseNone';
                document.getElementById('obj-zIndex-input').value = '';
                document.getElementById('obj-remove-input').checked = false;
                document.getElementById('obj-persist-input').checked = false;
                document.getElementById('obj-loop-input').value = '';
                document.getElementById('obj-tint-input').value = '';
                document.getElementById('obj-textDelay-input').value = '';
                document.getElementById('obj-command-input').value = '';
                this.showStatus('Fields cleared', 'success');
            },

            showStatus: function (message, type) {
                if (typeof type === 'undefined') type = 'info';
                if (!this.helperWindow) return;

                var statusEl = document.getElementById('obj-helper-status');
                if (!statusEl) return;

                statusEl.textContent = message;
                statusEl.className = type === 'error' ? 'obj-status-error' : (type === 'success' ? 'obj-status-success' : '');
            },

            bindEvents: function () {
                var self = this;

                document.getElementById('obj-helper-close-btn').addEventListener('click', function () { self.close(); });
                document.getElementById('obj-parse-command-btn').addEventListener('click', function () { self.parseCommand(); });
                document.getElementById('obj-generate-command-btn').addEventListener('click', function () { self.generateCommand(); });
                document.getElementById('obj-copy-command-btn').addEventListener('click', function () { self.copyCommand(); });
                document.getElementById('obj-apply-btn').addEventListener('click', function () { self.applyToScene(); });
                document.getElementById('obj-clear-fields-btn').addEventListener('click', function () { self.clearFields(); });

                document.getElementById('obj-command-input').addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        self.parseCommand();
                    }
                });
            },

            open: function () {
                if (this.isOpen) return;
                this.init();
                this.isOpen = true;
                this.showStatus('Object Helper Tool ready');
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
        window.beginObjectHelper = function () {
            window.ObjectHelperTool.open();
        };

        window.endObjectHelper = function () {
            window.ObjectHelperTool.close();
        };

        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'O') {
                e.preventDefault();
                if (window.ObjectHelperTool.isOpen) {
                    window.endObjectHelper();
                } else {
                    window.beginObjectHelper();
                }
            }
        });

        console.log(_VERSION + ' Object Helper Tool loaded! Use beginObjectHelper() to open the helper window or press Ctrl+Shift+O');

        if (_AUTO_SHOW) {
            console.log('Object Helper: Showing UI in ' + _SHOW_DELAY + ' second(s)');
            setTimeout(function () { window.beginObjectHelper();}, _SHOW_DELAY * 1000);
        }

    }

})();

