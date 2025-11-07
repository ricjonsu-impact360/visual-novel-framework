# Character Helper Tool

A powerful helper tool for visual novel games that allows real-time manipulation of character emotions and animations. Available in two versions: **IIFE (Immediately Invoked Function Expression)** for standalone use and **Tampermonkey** for automatic injection.

## 🚀 Features

- **Real-time character control**: Change emotions and animations instantly
- **Auto-apply mode**: Automatically apply changes as you select them
- **Search functionality**: Quickly find emotions and animations with live search
- **Current state detection**: Fetch and display the current character state
- **Smart initialization**: Automatically detects when you're in the game scene and shows the UI
- **Keyboard shortcuts**: Quick access with Ctrl+Shift+D
- **Draggable interface**: Move the helper window anywhere on screen
- **Navigation controls**: Browse through emotions/animations with arrow buttons
- **Copy functionality**: Copy emotion/animation names to clipboard

## 📁 Files

- [`character-helper-tool.js`](character-helper-tool.js) - **IIFE version** for console, HTML, and bookmarklets
- [`character-helper-tool-tampermonkey.js`](character-helper-tool-tampermonkey.js) - **Tampermonkey userscript version**

## 🔧 Installation & Usage

### Method 1: IIFE Version (Recommended for Testing)

The IIFE version (`character-helper-tool.js`) is a standalone script that works in any environment without dependencies.

#### Option A: Browser Console (Quick Testing)

Perfect for one-time use or testing:

1. Open your game in the browser
2. Open the browser's developer console:
   - **Windows/Linux**: Press `F12` or `Ctrl+Shift+J`
   - **Mac**: Press `Cmd+Option+J`
3. Copy the entire contents of [`character-helper-tool.js`](character-helper-tool.js)
4. Paste into the console and press `Enter`
5. The tool will automatically initialize and open

**Usage:**
- The tool opens automatically after initialization
- Press `Ctrl+Shift+D` to toggle the tool
- Type `beginHelper()` in console to open manually
- Type `endHelper()` in console to close

#### Option B: HTML Integration (Permanent Installation)

Best for development or local games:

1. Add the script tag to your HTML file before the closing `</body>` tag:
   ```html
   <script src="path/to/character-helper-tool.js"></script>
   ```

2. Or embed it inline:
   ```html
   <script>
   // Paste the entire contents of character-helper-tool.js here
   </script>
   ```

**The tool will:**
- Load automatically when the page loads
- Wait for game objects to be ready
- Check if the current window name is 'game'
- Open automatically once initialized (if in game scene)

#### Option C: Bookmarklet (Browser Bookmark)

Convenient for frequently used games:

1. Create a new bookmark in your browser
2. Name it "Character Helper Tool"
3. Set the URL/Location to:
   ```javascript
   javascript:(function(){var s=document.createElement('script');s.src='https://your-domain.com/path/to/character-helper-tool.js';document.head.appendChild(s);})();
   ```
   **Note:** Replace the URL with the actual path to your script file

4. Click the bookmark when on the game page to load the tool

**Alternative (Inline):** For offline use, you can embed the entire script:
```javascript
javascript:(function(){/* paste minified character-helper-tool.js code here */})();
```

### Method 2: Tampermonkey Version (Automatic Injection)

The Tampermonkey version (`character-helper-tool-tampermonkey.js`) automatically injects the tool into matching pages.

#### Prerequisites
- Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension

#### Installation
1. Open Tampermonkey dashboard (click the extension icon → Dashboard)
2. Click the "+" button or "Create a new script"
3. Replace the default content with the contents of [`character-helper-tool-tampermonkey.js`](character-helper-tool-tampermonkey.js)
4. Update the `@match` directive to match your game's URL:
   ```javascript
   // @match        *://localhost/Visual-Novels/*
   // Or use your specific domain:
   // @match        *://your-game-domain.com/*
   ```
5. Save the script (`Ctrl+S` or `Cmd+S`)

#### Usage
- The script automatically loads when you visit a matching page
- Wait for the game to fully load
- The tool initializes automatically in the background
- **Auto-show**: The UI automatically opens n second(s) after detecting the game scene (when `ig.game.windowName == 'game'`)
- Press `Ctrl+Shift+D` to toggle the tool anytime

## 🔑 Key Differences Between Versions

### IIFE Version (`character-helper-tool.js`)
- ✅ No browser extensions required
- ✅ Works in any environment (console, HTML, bookmarklet)
- ✅ Full control over when and how it loads
- ✅ Easy to test and debug
- ✅ Can be embedded directly in HTML files
- ❌ Must be manually loaded each time (unless embedded in HTML)
- ❌ Requires access to modify HTML or use console

### Tampermonkey Version (`character-helper-tool-tampermonkey.js`)
- ✅ Automatic injection on matching pages
- ✅ Persistent across page reloads
- ✅ No manual intervention needed
- ✅ Easy to enable/disable via Tampermonkey
- ✅ Updates automatically when script is modified
- ❌ Requires browser extension installation
- ❌ URL matching must be configured correctly

## 💡 Usage Examples

### Example 1: Quick Testing in Console (IIFE)

```javascript
// 1. Open browser console (F12)
// 2. Paste the entire contents of character-helper-tool.js
// 3. Press Enter - tool opens automatically

// Manual control:
beginHelper();  // Open the tool
endHelper();    // Close the tool

// Or use keyboard shortcut: Ctrl+Shift+D
```

### Example 2: HTML Embedding (IIFE)

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Visual Novel</title>
</head>
<body>
    <!-- Your game content -->
    <div id="gameCanvas"></div>
    
    <!-- Load the helper tool at the end -->
    <script src="character-helper-tool.js"></script>
</body>
</html>
```

### Example 3: Conditional Loading (IIFE)

```html
<script>
// Only load helper tool in development mode
if (location.hostname === 'localhost' || location.search.includes('debug=true')) {
    var script = document.createElement('script');
    script.src = 'character-helper-tool.js';
    document.head.appendChild(script);
    console.log('Character Helper Tool loaded in debug mode');
}
</script>
```

### Example 4: Loading from CDN or External Source (IIFE)

```javascript
// Create and inject script dynamically
(function() {
    var script = document.createElement('script');
    script.src = 'https://your-cdn.com/character-helper-tool.js';
    script.onload = function() {
        console.log('Character Helper Tool loaded successfully');
    };
    script.onerror = function() {
        console.error('Failed to load Character Helper Tool');
    };
    document.head.appendChild(script);
})();
```

## 🎮 How to Use

### Opening the Helper Tool
- **Automatic**: Tool opens automatically n second(s) after detecting the game scene (when `ig.game.windowName == 'game'`)
- **Keyboard shortcut**: Press `Ctrl+Shift+D`
- **Console command**: Type `beginHelper()` in the browser console
- **Close**: Click the × button or press `Ctrl+Shift+D` again

### Smart Initialization
The tool includes intelligent scene detection:
- Waits for required game objects (`window.ig`, `window._DATAGAME`) to be available
- Checks if you're in the actual game scene by verifying `ig.game.windowName == 'game'`
- Only initializes when in the game scene, not during menus or loading screens
- Automatically shows the UI after n second(s) once the game scene is detected
- **To disable auto-show**: Set `_AUTO_SHOW = false` at the top of the script (line 16)

### Interface Overview

#### Character Selection
- Select the character you want to modify from the dropdown
- Click "Fetch Current State" to load the character's current emotion and animation

#### Emotion Control
- **Dropdown**: Select from available emotions
- **Search**: Type to filter emotions with live suggestions
- **Navigation**: Use ◀ ▶ buttons to browse emotions
- **Copy**: Click 📋 to copy the emotion name

#### Animation Control
- **Dropdown**: Select from available animations/poses
- **Search**: Type to filter animations with live suggestions
- **Navigation**: Use ◀ ▶ buttons to browse animations
- **Copy**: Click 📋 to copy the animation name

#### Handheld Items Control
- **Dropdown**: Select from available items
- **Search**: Type to filter animations with live suggestions
- **Navigation**: Use ◀ ▶ buttons to browse items
- **Copy**: Click 📋 to copy the item name

#### Auto-Apply Mode
- Enable the checkbox to automatically apply changes when selecting emotions/animations
- When disabled, use "Apply Emotion", "Apply Animation" and "Apply Handheld Item" buttons manually

#### Additional Controls
- **Refresh Data**: Reload character, emotion, and animation data
- **Drag**: Click and drag the header to move the helper window

### Keyboard Shortcuts
- `Ctrl+Shift+D`: Toggle helper tool open/close
- `Escape`: Close search suggestions

## 🔍 Troubleshooting

### Tool Won't Load
- Ensure the game is fully loaded before running the script
- Check browser console for error messages
- Verify that required game objects (`ig`, `_DATAGAME`) are available

### Character Not Found
- Make sure you're in a game scene with characters present
- Try refreshing the data with the "Refresh Data" button
- Check that the character name matches exactly

### Emotions/Animations Not Working
- Verify the game supports the selected emotion/animation
- Check browser console for detailed error messages
- Try fetching the current state to see what's available

## 🛠 Technical Requirements

- This tool relies on the existing exposed functions and objects: `window.ig`, `window._DATAGAME`, `changeEmotion()`, and  `changePose()`
