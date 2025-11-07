// ==UserScript==
// @name         Character Helper
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Waits for the game to be ready before initializing the helper tool to prevent race conditions.
// @author       You
// @match        *://localhost/Visual-Novels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=localhost
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    var _VERSION = "v1.1.2";
    var _AUTO_SHOW = true;
    var _SHOW_DELAY = 1; /* in seconds */

    // Wait for the page to be fully loaded and game objects to be available
    function waitForGameReady (callback, maxAttempts) {
        var attempts = 0;
        maxAttempts = typeof maxAttempts !== 'undefined' ? maxAttempts : 30;
        function checkReady () {
            attempts++;

            if (unsafeWindow.ig && unsafeWindow._DATAGAME && unsafeWindow.ig.game && unsafeWindow.ig.game.windowName !== 'game') {
                console.warn('Character Helper won\'t launch unless you\'re in game scene!');
            }
            if (unsafeWindow.ig && unsafeWindow._DATAGAME && unsafeWindow.ig.game && unsafeWindow.ig.game.windowName == 'game') {
                console.warn('Character Helper Initialized');
                callback();
                return;
            }

            if (attempts < maxAttempts) {
                setTimeout(checkReady, 1000);
            } else {
                console.warn('Character Helper Tool: Game objects not found after maximum attempts');
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
        // Global helper object - attach to unsafeWindow so it's accessible
        unsafeWindow.CharacterHelperTool = {
            isOpen: false,
            helperWindow: null,
            currentCharacters: [],
            emotions: [],
            animations: [],
            handheldItems: [],
            autoApply: false,

            // Initialize the helper tool
            init: function () {
                this.loadData();
                this.createHelperWindow();
                this.bindEvents(); // Events are bound after creation
            },

            // Load character data from the game
            loadData: function () {
                try {
                    var gameController = unsafeWindow.ig.game.currentWindow;
                    if (!gameController) {
                        console.error('Game controller not found. Make sure you are in a game scene.');
                        return false;
                    }

                    this.currentCharacters = gameController.arrChar.filter(function (char) {
                        return char && char !== "";
                    });

                    // Get emotions, animations, and handheld items from game data, create a copy, and sort them
                    this.emotions = (unsafeWindow._DATAGAME.listEmotion || []).slice().sort();
                    this.animations = (unsafeWindow._DATAGAME.pose || []).slice().sort();
                    // Handheld items are stored as an object, so extract keys
                    this.handheldItems = (unsafeWindow._DATAGAME.objectHandheld ? Object.keys(unsafeWindow._DATAGAME.objectHandheld).sort() : []);
                    return true;
                } catch (error) {
                    console.error('Error loading game data:', error);
                    return false;
                }
            },

            // Create the helper window HTML
            createHelperWindow: function () {
                if (this.helperWindow) {
                    this.helperWindow.remove();
                }

                var helperWindow = document.createElement('div');
                helperWindow.id = 'character-helper-tool';
                helperWindow.innerHTML =
                    '<div class="ch-helper-header" id="helper-header">' +
                        '<h3>Character Helper Tool</h3>' +
                        '<button id="helper-close-btn" class="ch-close-btn">×</button>' +
                    '</div>' +
                    '<div class="ch-helper-content">' +
                        '<div class="ch-form-group">' +
                            '<label for="character-select">Character:</label>' +
                            '<select id="character-select" class="ch-form-control">' +
                                '<option value="">Select Character...</option>' +
                            '</select>' +
                            '<button id="fetch-state-btn" class="ch-fetch-btn">Fetch Current State</button>' +
                        '</div>' +
                        '<div class="ch-form-group">' +
                            '<label for="emotion-select">Emotion:</label>' +
                            '<div class="ch-dropdown-with-nav">' +
                                '<button id="emotion-prev-btn" class="ch-nav-btn ch-prev-btn">‹</button>' +
                                '<select id="emotion-select" class="ch-form-control ch-searchable">' +
                                    '<option value="">Select Emotion...</option>' +
                                '</select>' +
                                '<button id="emotion-next-btn" class="ch-nav-btn ch-next-btn">›</button>' +
                                '<button id="emotion-copy-btn" class="ch-nav-btn ch-copy-btn">📋</button>' +
                            '</div>' +
                            '<div class="ch-search-container">' +
                                '<input type="text" id="emotion-search" class="ch-search-input" placeholder="Search emotions...">' +
                                '<div id="emotion-suggestions" class="ch-suggestions-list"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="ch-form-group">' +
                            '<label for="animation-select">Animation:</label>' +
                            '<div class="ch-dropdown-with-nav">' +
                                '<button id="animation-prev-btn" class="ch-nav-btn ch-prev-btn">‹</button>' +
                                '<select id="animation-select" class="ch-form-control ch-searchable">' +
                                    '<option value="">Select Animation...</option>' +
                                '</select>' +
                                '<button id="animation-next-btn" class="ch-nav-btn ch-next-btn">›</button>' +
                                '<button id="animation-copy-btn" class="ch-nav-btn ch-copy-btn">📋</button>' +
                            '</div>' +
                            '<div class="ch-search-container">' +
                                '<input type="text" id="animation-search" class="ch-search-input" placeholder="Search animations...">' +
                                '<div id="animation-suggestions" class="ch-suggestions-list"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="ch-form-group">' +
                            '<label for="handheld-item-select">Handheld Item:</label>' +
                            '<div class="ch-dropdown-with-nav">' +
                                '<button id="handheld-item-prev-btn" class="ch-nav-btn ch-prev-btn">‹</button>' +
                                '<select id="handheld-item-select" class="ch-form-control ch-searchable">' +
                                    '<option value="">Select Handheld Item...</option>' +
                                '</select>' +
                                '<button id="handheld-item-next-btn" class="ch-nav-btn ch-next-btn">›</button>' +
                                '<button id="handheld-item-clear-btn" class="ch-nav-btn ch-clear-btn">✖</button>' +
                                '<button id="handheld-item-copy-btn" class="ch-nav-btn ch-copy-btn">📋</button>' +
                            '</div>' +
                            '<div class="ch-search-container">' +
                                '<input type="text" id="handheld-item-search" class="ch-search-input" placeholder="Search handheld items...">' +
                                '<div id="handheld-item-suggestions" class="ch-suggestions-list"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="ch-auto-apply-group">' +
                            '<label class="ch-auto-apply-label">' +
                                '<input type="checkbox" id="auto-apply-toggle"> Auto-apply changes' +
                            '</label>' +
                        '</div>' +
                        '<div class="ch-button-group">' +
                            '<button id="apply-emotion-btn" class="ch-apply-btn">Apply Emotion</button>' +
                            '<button id="apply-animation-btn" class="ch-apply-btn">Apply Animation</button>' +
                            '<button id="apply-handheld-item-btn" class="ch-apply-btn">Apply Handheld Item</button>' +
                            '<button id="refresh-data-btn" class="ch-refresh-btn">Refresh Data</button>' +
                        '</div>' +
                        '<div class="ch-status-area">' +
                            '<div id="helper-status"></div>' +
                        '</div>' +
                    '</div>';

                this.addStyles();
                document.body.appendChild(helperWindow);
                this.helperWindow = helperWindow;
                this.makeDraggable();
                this.populateDropdowns();
            },

            addStyles: function () {
                if (document.getElementById('character-helper-styles')) return;

                var styles = document.createElement('style');
                styles.id = 'character-helper-styles';
                styles.textContent =
                    '#character-helper-tool { position: fixed; top: 50px; right: 20px; width: 350px; max-height: 90vh; background: rgba(0, 0, 0, 0.95); border: 2px solid #444; border-radius: 8px; color: white; font-family: Arial, sans-serif; font-size: 14px; z-index: 10000; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); display: flex; flex-direction: column; }' +
                    '.ch-helper-header { background: #333; padding: 10px 15px; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none; flex-shrink: 0; }' +
                    '.ch-helper-header h3 { margin: 0; color: #fff; font-size: 16px; }' +
                    '.ch-close-btn { background: #ff4444; border: none; color: white; width: 25px; height: 25px; border-radius: 50%; cursor: pointer; font-size: 16px; line-height: 1; }' +
                    '.ch-close-btn:hover { background: #ff6666; }' +
                    '.ch-helper-content { padding: 15px; overflow-y: auto; overflow-x: hidden; }' +
                    '.ch-form-group { margin-bottom: 15px; }' +
                    '.ch-form-group label { display: block; margin-bottom: 5px; color: #ccc; font-weight: bold; }' +
                    '.ch-form-control { width: 100%; padding: 8px; border: 1px solid #555; border-radius: 4px; background: #222; color: white; font-size: 14px; box-sizing: border-box; }' +
                    '.ch-form-control:focus { outline: none; border-color: #4CAF50; }' +
                    '.ch-dropdown-with-nav { display: flex; align-items: center; gap: 5px; }' +
                    '.ch-dropdown-with-nav .ch-form-control { flex: 1; }' +
                    '.ch-nav-btn { background: #555; border: 1px solid #666; color: white; width: 30px; height: 34px; border-radius: 4px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }' +
                    '.ch-nav-btn:hover { background: #666; }' +
                    '.ch-nav-btn:disabled { background: #333; color: #666; cursor: not-allowed; }' +
                    '.ch-copy-btn { background: #6c757d; }' +
                    '.ch-copy-btn:hover { background: #5a6268; }' +
                    '.ch-clear-btn { background: #dc3545; }' +
                    '.ch-clear-btn:hover { background: #c82333; }' +
                    '.ch-search-container { position: relative; margin-top: 8px; }' +
                    '.ch-search-input { width: 100%; padding: 8px 12px; border: 1px solid #555; border-radius: 4px; background: #333; color: white; font-size: 14px; box-sizing: border-box; }' +
                    '.ch-search-input:focus { outline: none; border-color: #4CAF50; box-shadow: 0 0 5px rgba(76, 175, 80, 0.3); }' +
                    '.ch-suggestions-list { position: absolute; top: 100%; left: 0; right: 0; background: #222; border: 1px solid #555; border-top: none; border-radius: 0 0 4px 4px; max-height: 200px; overflow-y: auto; z-index: 1000; display: none; }' +
                    '.ch-suggestion-item { padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #444; color: #ccc; font-size: 14px; }' +
                    '.ch-suggestion-item:hover { background: #444; color: white; }' +
                    '.ch-suggestion-item:last-child { border-bottom: none; }' +
                    '.ch-suggestion-item.ch-highlighted { background: #4CAF50; color: white; }' +
                    '.ch-auto-apply-group { margin: 15px 0; padding: 10px; background: #333; border-radius: 4px; border-left: 3px solid #4CAF50; }' +
                    '.ch-auto-apply-label { display: flex; align-items: center; color: #ccc; font-size: 14px; cursor: pointer; }' +
                    '.ch-auto-apply-label input[type="checkbox"] { margin-right: 8px; transform: scale(1.2); }' +
                    '.ch-fetch-btn { background: #FF9800; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-top: 8px; width: 100%; }' +
                    '.ch-fetch-btn:hover { background: #F57C00; }' +
                    '.ch-button-group { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; }' +
                    '.ch-apply-btn, .ch-refresh-btn { flex: 1; padding: 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; }' +
                    '.ch-apply-btn { background: #4CAF50; color: white; }' +
                    '.ch-apply-btn:hover { background: #45a049; }' +
                    '.ch-refresh-btn { background: #2196F3; color: white; }' +
                    '.ch-refresh-btn:hover { background: #1976D2; }' +
                    '.ch-status-area { margin-top: 15px; padding: 10px; background: #111; border-radius: 4px; min-height: 20px; transition: background-color 0.3s ease; }' +
                    '@keyframes ch-flash-success { 0% { background-color: rgba(76, 175, 80, 0.5); } 100% { background-color: #111; } }' +
                    '@keyframes ch-flash-error { 0% { background-color: rgba(255, 68, 68, 0.5); } 100% { background-color: #111; } }' +
                    '.ch-status-area.ch-status-flash-success { animation: ch-flash-success 1s ease-out; }' +
                    '.ch-status-area.ch-status-flash-error { animation: ch-flash-error 1s ease-out; }' +
                    '#helper-status { font-size: 12px; color: #ccc; }' +
                    '.ch-status-success { color: #4CAF50 !important; }' +
                    '.ch-status-error { color: #ff4444 !important; }';
                document.head.appendChild(styles);
            },

            populateDropdowns: function () {
                this.populateCharacters();
                this.populateEmotions();
                this.populateAnimations();
                this.populateHandheldItems();
            },

            showEmotionSuggestions: function (filter) {
                var self = this;
                var suggestionsContainer = document.getElementById('emotion-suggestions');
                
                if (!suggestionsContainer) return;
                
                suggestionsContainer.innerHTML = ''; // Clear previous suggestions
                var filteredEmotions = [];

                if (filter.length > 0) {
                    filteredEmotions = this.emotions.filter(function (emo) {
                        return emo.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                    });
                }

                if (filteredEmotions.length > 0) {
                    filteredEmotions.slice(0, 10).forEach(function (emo) {
                        var item = document.createElement('div');
                        item.className = 'ch-suggestion-item';
                        item.textContent = emo;
                        item.addEventListener('click', function () {
                            self.selectEmotion(emo);
                        });
                        suggestionsContainer.appendChild(item);
                    });
                    suggestionsContainer.style.display = 'block';
                } else {
                    suggestionsContainer.style.display = 'none';
                }
            },

            showAnimationSuggestions: function (filter) {
                var self = this;
                var suggestionsContainer = document.getElementById('animation-suggestions');
                
                if (!suggestionsContainer) return;
                
                suggestionsContainer.innerHTML = ''; // Clear previous suggestions
                var filteredAnimations = [];

                if (filter.length > 0) {
                    filteredAnimations = this.animations.filter(function (anim) {
                        return anim.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                    });
                }

                if (filteredAnimations.length > 0) {
                    filteredAnimations.slice(0, 10).forEach(function (anim) {
                        var item = document.createElement('div');
                        item.className = 'ch-suggestion-item';
                        item.textContent = anim;
                        item.addEventListener('click', function () {
                            self.selectAnimation(anim);
                        });
                        suggestionsContainer.appendChild(item);
                    });
                    suggestionsContainer.style.display = 'block';
                } else {
                    suggestionsContainer.style.display = 'none';
                }
            },

            showHandheldItemSuggestions: function (filter) {
                var self = this;
                var suggestionsContainer = document.getElementById('handheld-item-suggestions');
                
                if (!suggestionsContainer) return;
                
                suggestionsContainer.innerHTML = ''; // Clear previous suggestions
                var filteredItems = [];

                if (filter.length > 0) {
                    filteredItems = this.handheldItems.filter(function (item) {
                        return item.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                    });
                }

                if (filteredItems.length > 0) {
                    filteredItems.slice(0, 10).forEach(function (item) {
                        var itemEl = document.createElement('div');
                        itemEl.className = 'ch-suggestion-item';
                        itemEl.textContent = item;
                        itemEl.addEventListener('click', function () {
                            self.selectHandheldItem(item);
                        });
                        suggestionsContainer.appendChild(itemEl);
                    });
                    suggestionsContainer.style.display = 'block';
                } else {
                    suggestionsContainer.style.display = 'none';
                }
            },

            selectEmotion: function (emotion) {
                var emotionSelect = document.getElementById('emotion-select');
                var emotionSearch = document.getElementById('emotion-search');
                var emotionSuggestions = document.getElementById('emotion-suggestions');
                
                if (emotionSelect) {
                    emotionSelect.value = emotion;
                }
                if (emotionSearch) {
                    emotionSearch.value = '';
                }
                if (emotionSuggestions) {
                    emotionSuggestions.style.display = 'none';
                }

                if (this.autoApply) {
                    this.applyEmotion();
                }
            },

            selectAnimation: function (animation) {
                var animationSelect = document.getElementById('animation-select');
                var animationSearch = document.getElementById('animation-search');
                var animationSuggestions = document.getElementById('animation-suggestions');
                
                if (animationSelect) {
                    animationSelect.value = animation;
                }
                if (animationSearch) {
                    animationSearch.value = '';
                }
                if (animationSuggestions) {
                    animationSuggestions.style.display = 'none';
                }

                if (this.autoApply) {
                    this.applyAnimation();
                }
            },

            selectHandheldItem: function (item) {
                var handheldItemSelect = document.getElementById('handheld-item-select');
                var handheldItemSearch = document.getElementById('handheld-item-search');
                var handheldItemSuggestions = document.getElementById('handheld-item-suggestions');
                
                if (handheldItemSelect) {
                    handheldItemSelect.value = item;
                }
                if (handheldItemSearch) {
                    handheldItemSearch.value = '';
                }
                if (handheldItemSuggestions) {
                    handheldItemSuggestions.style.display = 'none';
                }

                if (this.autoApply) {
                    this.applyHandheldItem();
                }
            },

            hideSuggestions: function () {
                var emotionSuggestions = document.getElementById('emotion-suggestions');
                var animationSuggestions = document.getElementById('animation-suggestions');
                var handheldItemSuggestions = document.getElementById('handheld-item-suggestions');
                
                if (emotionSuggestions) {
                    emotionSuggestions.style.display = 'none';
                }
                if (animationSuggestions) {
                    animationSuggestions.style.display = 'none';
                }
                if (handheldItemSuggestions) {
                    handheldItemSuggestions.style.display = 'none';
                }
            },

            // Fetch current emotion and animation of selected character
            fetchCurrentState: function () {
                var characterSelect = document.getElementById('character-select');
                
                if (!characterSelect) return;
                
                var character = characterSelect.value;

                if (!character) {
                    this.showStatus('Please select a character first', 'error');
                    return;
                }

                try {
                    var gameController = unsafeWindow.ig.game.currentWindow;
                    var charIndex = gameController.arrChar.indexOf(character);

                    if (charIndex === -1) {
                        this.showStatus('Character not found in scene', 'error');
                        return;
                    }

                    var charSprite = gameController['sptChar' + charIndex];
                    console.log('Character sprite properties:', charSprite);

                    var currentEmotion = '';
                    var emotionIndex = -1;
                    if (charSprite.emotionNow !== undefined && charSprite.emotionNow >= 0) {
                        emotionIndex = charSprite.emotionNow;
                        var originalEmotionList = unsafeWindow._DATAGAME.listEmotion || [];
                        if (emotionIndex < originalEmotionList.length) {
                            currentEmotion = originalEmotionList[emotionIndex];
                        }
                    }

                    var currentAnimation = '';
                    if (charSprite.poseNow) {
                        var upperAnimName = charSprite.poseNow.toUpperCase();
                        for (var i = 0; i < this.animations.length; i++) {
                            if (this.animations[i].toUpperCase() === upperAnimName) {
                                currentAnimation = this.animations[i];
                                break;
                            }
                        }
                    }

                    var currentHandheldItem = '';
                    if (charSprite.handheldItemNow) {
                        var upperItemName = charSprite.handheldItemNow.toUpperCase();
                        for (var i = 0; i < this.handheldItems.length; i++) {
                            if (this.handheldItems[i].toUpperCase() === upperItemName) {
                                currentHandheldItem = this.handheldItems[i];
                                break;
                            }
                        }
                    }

                    if (currentEmotion) {
                        var emotionSelect = document.getElementById('emotion-select');
                        if (emotionSelect) {
                            emotionSelect.value = currentEmotion;
                        }
                    }
                    if (currentAnimation) {
                        var animationSelect = document.getElementById('animation-select');
                        if (animationSelect) {
                            animationSelect.value = currentAnimation;
                        }
                    }
                    if (currentHandheldItem) {
                        var handheldItemSelect = document.getElementById('handheld-item-select');
                        if (handheldItemSelect) {
                            handheldItemSelect.value = currentHandheldItem;
                        }
                    }

                    var statusMsg = 'Fetched state for ' + character + ': ';
                    var detectedItems = [];
                    if (currentEmotion) {
                        detectedItems.push('Emotion: ' + currentEmotion + ' (index: ' + emotionIndex + ')');
                    }
                    if (currentAnimation) {
                        detectedItems.push('Animation: ' + currentAnimation);
                    }
                    if (currentHandheldItem) {
                        detectedItems.push('Handheld Item: ' + currentHandheldItem);
                    }
                    if (detectedItems.length > 0) {
                        statusMsg += detectedItems.join(', ');
                    } else {
                        statusMsg += 'No current state detected. Check console for sprite properties.';
                    }
                    this.showStatus(statusMsg, detectedItems.length > 0 ? 'success' : 'error');
                } catch (error) {
                    this.showStatus('Error fetching current state: ' + error.message, 'error');
                    console.error('Fetch state error:', error);
                }
            },

            makeDraggable: function () {
                var header = document.getElementById('helper-header');
                var windowEl = this.helperWindow;
                var isDragging = false,
                    initialX, initialY, xOffset = 0,
                    yOffset = 0;

                var dragStart = function (e) {
                    if (e.target.id === 'helper-close-btn') return;
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

            populateCharacters: function () {
                var select = document.getElementById('character-select');
                
                if (!select) return;
                
                select.innerHTML = '<option value="">Select Character...</option>';
                this.currentCharacters.forEach(function (char) {
                    var option = document.createElement('option');
                    option.value = char;
                    option.textContent = char;
                    select.appendChild(option);
                });
            },

            populateEmotions: function () {
                var select = document.getElementById('emotion-select');
                
                if (!select) return;
                
                select.innerHTML = '<option value="">Select Emotion...</option>';
                this.emotions.forEach(function (emo) {
                    var option = document.createElement('option');
                    option.value = emo;
                    option.textContent = emo;
                    select.appendChild(option);
                });
            },

            populateAnimations: function () {
                var select = document.getElementById('animation-select');
                
                if (!select) return;
                
                select.innerHTML = '<option value="">Select Animation...</option>';
                this.animations.forEach(function (anim) {
                    var option = document.createElement('option');
                    option.value = anim;
                    option.textContent = anim;
                    select.appendChild(option);
                });
            },

            populateHandheldItems: function () {
                var select = document.getElementById('handheld-item-select');
                
                if (!select) return;
                
                select.innerHTML = '<option value="">Select Handheld Item...</option>';
                this.handheldItems.forEach(function (item) {
                    var option = document.createElement('option');
                    option.value = item;
                    option.textContent = item;
                    select.appendChild(option);
                });
            },

            navigateSelect: function (selectId, items, direction) {
                var select = document.getElementById(selectId);
                
                if (!select) return;
                
                var currentIndex = items.indexOf(select.value);
                var newIndex = currentIndex + direction;
                if (newIndex < 0) newIndex = items.length - 1;
                if (newIndex >= items.length) newIndex = 0;
                select.value = items[newIndex];
                select.dispatchEvent(new Event('change'));
            },

            navigateEmotion: function (direction) {
                this.navigateSelect('emotion-select', this.emotions, direction);
            },

            navigateAnimation: function (direction) {
                this.navigateSelect('animation-select', this.animations, direction);
            },

            navigateHandheldItem: function (direction) {
                this.navigateSelect('handheld-item-select', this.handheldItems, direction);
            },

            applyEmotion: function () {
                var characterSelect = document.getElementById('character-select');
                var emotionSelect = document.getElementById('emotion-select');

                if (!characterSelect || !emotionSelect) return;
                
                var character = characterSelect.value;
                var emotion = emotionSelect.value;
                if (!character) { this.showStatus('Please select a character', 'error'); return; }
                if (!emotion) { this.showStatus('Please select an emotion', 'error'); return; }
                try {
                    var gameController = unsafeWindow.ig.game.currentWindow;
                    var charIndex = gameController.arrChar.indexOf(character);
                    if (charIndex === -1) { this.showStatus('Character not found in scene', 'error'); return; }
                    // FIX: Get index from the original unsorted list to ensure the correct emotion is applied
                    var emotionIndex = (unsafeWindow._DATAGAME.listEmotion || []).indexOf(emotion);
                    if (emotionIndex === -1) { this.showStatus('Invalid emotion', 'error'); return; }
                    gameController['sptChar' + charIndex].changeEmotion(emotionIndex);
                    this.showStatus('Applied ' + emotion + ' to ' + character, 'success');
                } catch (error) { this.showStatus('Error applying emotion: ' + error.message, 'error'); }
            },

            applyAnimation: function () {
                var characterSelect = document.getElementById('character-select');
                var animationSelect = document.getElementById('animation-select');

                if (!characterSelect || !animationSelect) return;
                
                var character = characterSelect.value;
                var animation = animationSelect.value;
                if (!character) { this.showStatus('Please select a character', 'error'); return; }
                if (!animation) { this.showStatus('Please select an animation', 'error'); return; }
                try {
                    var gameController = unsafeWindow.ig.game.currentWindow;
                    var charIndex = gameController.arrChar.indexOf(character);
                    if (charIndex === -1) { this.showStatus('Character not found in scene', 'error'); return; }
                    
                    var charSprite = gameController['sptChar' + charIndex];
                    
                    // Get the currently selected handheld item (if any) to preserve it
                    var handheldItemSelect = document.getElementById('handheld-item-select');
                    var handheldItem = handheldItemSelect ? handheldItemSelect.value : '';
                    
                    // Force animation replay by briefly switching to ANIM_IDLE if it's the same animation
                    if (charSprite.poseNow === animation) {
                        charSprite.changePose('ANIM_IDLE', handheldItem || null, null, null, null, null);
                    }
                    
                    // Apply animation with handheld item if selected
                    // changePose(poseName, handheld, shadow, animSpeed, tint, _isWalkInOrOut)
                    charSprite.changePose(animation, handheldItem || null, null, null, null, null);
                    
                    var emotionSelect = document.getElementById('emotion-select');
                    var emotion = emotionSelect ? emotionSelect.value : '';
                    var statusMessage = 'Applied ' + animation;
                    if (handheldItem) statusMessage += ' with ' + handheldItem;
                    statusMessage += ' to ' + character;

                    if (emotion) {
                        var emotionIndex = (unsafeWindow._DATAGAME.listEmotion || []).indexOf(emotion);
                        if (emotionIndex !== -1) {
                            gameController['sptChar' + charIndex].changeEmotion(emotionIndex);
                            statusMessage = 'Applied ' + animation;
                            if (handheldItem) statusMessage += ' with ' + handheldItem;
                            statusMessage += ' & ' + emotion + ' to ' + character;
                        }
                    }
                    this.showStatus(statusMessage, 'success');

                } catch (error) { this.showStatus('Error applying animation: ' + error.message, 'error'); }
            },

            applyHandheldItem: function () {
                var characterSelect = document.getElementById('character-select');
                var handheldItemSelect = document.getElementById('handheld-item-select');

                if (!characterSelect || !handheldItemSelect) return;
                
                var character = characterSelect.value;
                var handheldItem = handheldItemSelect.value;
                if (!character) { this.showStatus('Please select a character', 'error'); return; }
                if (!handheldItem) { this.showStatus('Please select a handheld item', 'error'); return; }
                try {
                    var gameController = unsafeWindow.ig.game.currentWindow;
                    var charIndex = gameController.arrChar.indexOf(character);
                    if (charIndex === -1) { this.showStatus('Character not found in scene', 'error'); return; }
                    var charSprite = gameController['sptChar' + charIndex];
                    var currentPose = charSprite.poseNow || 'ANIM_IDLE';
                    
                    // Handheld items are applied via changePose() as the 2nd parameter
                    // changePose(poseName, handheld, shadow, animSpeed, tint, _isWalkInOrOut)
                    charSprite.changePose(currentPose, handheldItem, null, null, null, null);
                    
                    this.showStatus('Applied ' + handheldItem + ' to ' + character + ' with pose ' + currentPose, 'success');
                } catch (error) { this.showStatus('Error applying handheld item: ' + error.message, 'error'); }
            },

            clearHandheldItem: function () {
                var characterSelect = document.getElementById('character-select');
                var handheldItemSelect = document.getElementById('handheld-item-select');

                if (!characterSelect || !handheldItemSelect) return;
                
                var character = characterSelect.value;
                if (!character) { this.showStatus('Please select a character first', 'error'); return; }
                
                try {
                    var gameController = unsafeWindow.ig.game.currentWindow;
                    var charIndex = gameController.arrChar.indexOf(character);
                    if (charIndex === -1) { this.showStatus('Character not found in scene', 'error'); return; }
                    
                    var charSprite = gameController['sptChar' + charIndex];
                    var currentPose = charSprite.poseNow || 'ANIM_IDLE';
                    
                    // Clear the dropdown selection
                    handheldItemSelect.value = '';
                    
                    // Remove handheld item by applying current pose with null handheld
                    charSprite.changePose(currentPose, null, null, null, null, null);
                    
                    this.showStatus('Cleared handheld item from ' + character, 'success');
                } catch (error) { this.showStatus('Error clearing handheld item: ' + error.message, 'error'); }
            },

            showStatus: function (message, type) {
                if (typeof type === 'undefined') type = 'info';
                
                if (!this.helperWindow) return;
                
                var statusArea = this.helperWindow.querySelector('.ch-status-area');
                var statusEl = document.getElementById('helper-status');

                if (!statusEl) return;

                // Update text and text color
                statusEl.textContent = message;
                statusEl.className = type === 'error' ? 'ch-status-error' : (type === 'success' ? 'ch-status-success' : '');

                // Trigger background flash animation
                if (statusArea) {
                    // Remove previous animation classes to allow re-triggering
                    statusArea.classList.remove('ch-status-flash-success', 'ch-status-flash-error');

                    // Force a reflow for the animation to restart if the same class is added again.
                    void statusArea.offsetWidth;

                    if (type === 'success') {
                        statusArea.classList.add('ch-status-flash-success');
                    } else if (type === 'error') {
                        statusArea.classList.add('ch-status-flash-error');
                    }
                }
            },

            refresh: function () {
                if (this.loadData()) {
                    this.populateDropdowns();
                    this.showStatus('Data refreshed successfully', 'success');
                } else {
                    this.showStatus('Failed to refresh data', 'error');
                }
            },

            toggleAutoApply: function () {
                var autoApplyToggle = document.getElementById('auto-apply-toggle');
                
                if (!autoApplyToggle) return;
                
                this.autoApply = autoApplyToggle.checked;
                this.showStatus('Auto-apply ' + (this.autoApply ? 'enabled' : 'disabled'), 'success');
            },

            copyToClipboard: function (text) {
                if (!text) {
                    this.showStatus('Nothing to copy', 'error');
                    return;
                }
                var textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed'; // Prevent scrolling to bottom
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    var successful = document.execCommand('copy');
                    if (successful) {
                        this.showStatus('Copied: ' + text, 'success');
                    } else {
                        this.showStatus('Failed to copy', 'error');
                    }
                } catch (err) {
                    this.showStatus('Error copying: ' + err, 'error');
                }
                document.body.removeChild(textArea);
            },

            // *** MODIFICATION: All event listeners are now bound here ***
            bindEvents: function () {
                var self = this;

                // Window Controls
                document.getElementById('helper-close-btn').addEventListener('click', function () { self.close(); });
                document.getElementById('refresh-data-btn').addEventListener('click', function () { self.refresh(); });
                document.getElementById('fetch-state-btn').addEventListener('click', function () { self.fetchCurrentState(); });

                // Apply Buttons
                document.getElementById('apply-emotion-btn').addEventListener('click', function () { self.applyEmotion(); });
                document.getElementById('apply-animation-btn').addEventListener('click', function () { self.applyAnimation(); });
                document.getElementById('apply-handheld-item-btn').addEventListener('click', function () { self.applyHandheldItem(); });

                // Navigation Buttons
                document.getElementById('emotion-prev-btn').addEventListener('click', function () { self.navigateEmotion(-1); });
                document.getElementById('emotion-next-btn').addEventListener('click', function () { self.navigateEmotion(1); });
                document.getElementById('animation-prev-btn').addEventListener('click', function () { self.navigateAnimation(-1); });
                document.getElementById('animation-next-btn').addEventListener('click', function () { self.navigateAnimation(1); });
                document.getElementById('handheld-item-prev-btn').addEventListener('click', function () { self.navigateHandheldItem(-1); });
                document.getElementById('handheld-item-next-btn').addEventListener('click', function () { self.navigateHandheldItem(1); });

                // Copy Buttons
                document.getElementById('emotion-copy-btn').addEventListener('click', function () {
                    var textToCopy = document.getElementById('emotion-select').value;
                    self.copyToClipboard(textToCopy);
                });
                document.getElementById('animation-copy-btn').addEventListener('click', function () {
                    var textToCopy = document.getElementById('animation-select').value;
                    self.copyToClipboard(textToCopy);
                });
                document.getElementById('handheld-item-copy-btn').addEventListener('click', function () {
                    var textToCopy = document.getElementById('handheld-item-select').value;
                    self.copyToClipboard(textToCopy);
                });
                document.getElementById('handheld-item-clear-btn').addEventListener('click', function () {
                    self.clearHandheldItem();
                });

                // Auto-Apply Toggle
                document.getElementById('auto-apply-toggle').addEventListener('change', function () { self.toggleAutoApply(); });

                // Search functionality with live suggestions
                document.getElementById('emotion-search').addEventListener('input', function (e) {
                    self.showEmotionSuggestions(e.target.value);
                });

                document.getElementById('animation-search').addEventListener('input', function (e) {
                    self.showAnimationSuggestions(e.target.value);
                });

                document.getElementById('handheld-item-search').addEventListener('input', function (e) {
                    self.showHandheldItemSuggestions(e.target.value);
                });

                // Hide suggestions when clicking outside
                document.addEventListener('click', function (e) {
                    if (!e.target.closest('.ch-search-container')) {
                        self.hideSuggestions();
                    }
                });

                // Handle keyboard navigation in search fields
                document.getElementById('emotion-search').addEventListener('keydown', function (e) {
                    if (e.key === 'Escape') {
                        self.hideSuggestions();
                        this.blur();
                    }
                });

                document.getElementById('animation-search').addEventListener('keydown', function (e) {
                    if (e.key === 'Escape') {
                        self.hideSuggestions();
                        this.blur();
                    }
                });

                document.getElementById('handheld-item-search').addEventListener('keydown', function (e) {
                    if (e.key === 'Escape') {
                        self.hideSuggestions();
                        this.blur();
                    }
                });

                // Auto-apply on dropdown change
                document.getElementById('emotion-select').addEventListener('change', function () {
                    if (self.autoApply && this.value) {
                        self.applyEmotion();
                    }
                });

                document.getElementById('animation-select').addEventListener('change', function () {
                    if (self.autoApply && this.value) {
                        self.applyAnimation();
                    }
                });

                document.getElementById('handheld-item-select').addEventListener('change', function () {
                    if (self.autoApply && this.value) {
                        self.applyHandheldItem();
                    }
                });
            },

            open: function () {
                 if (this.isOpen) return;
                if (!this.loadData()) {
                    alert('Cannot open helper tool. Make sure you are in a game scene with characters.');
                    return;
                }
                this.init();
                this.isOpen = true;
                this.showStatus('Helper tool ready');
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
        unsafeWindow.beginHelper = function () {
            unsafeWindow.CharacterHelperTool.open();
        };

        unsafeWindow.endHelper = function () {
            unsafeWindow.CharacterHelperTool.close();
        };

        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.keyCode === 68)) {
                e.preventDefault();
                if (unsafeWindow.CharacterHelperTool.isOpen) {
                    unsafeWindow.endHelper();
                } else {
                    unsafeWindow.beginHelper();
                }
            }
        });

        console.log(_VERSION + ' Character Helper Tool loaded! Use beginHelper() to open the helper window or press Ctrl+Shift+D');

        if (_AUTO_SHOW) {
            console.log('Character Helper: Showing UI in ' + _SHOW_DELAY + ' second(s)');
            setTimeout(function () { unsafeWindow.beginHelper();}, _SHOW_DELAY);
        }
    }

})();
