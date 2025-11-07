# ZoomPan Helper Tool

A powerful helper tool for visual novel games that allows real-time testing and manipulation of zoom/pan camera effects. Available in two versions: **IIFE (Immediately Invoked Function Expression)** for standalone use and **Tampermonkey** for automatic injection.

## 🚀 Features

- **Real-time camera control**: Test zoom and pan effects instantly
- **Easing support**: Choose from 30 different easing functions via dropdown menu
- **Command parsing**: Parse ANIMEFFECT commands into individual parameters
- **Command generation**: Generate ANIMEFFECT commands from input values
- **Copy to clipboard**: Quickly copy generated commands
- **Camera reset**: Instantly reset camera to default position
- **Smart initialization**: Automatically detects when you're in the game scene and shows the UI
- **Keyboard shortcuts**: Quick access with Ctrl+Shift+Z
- **Draggable interface**: Move the helper window anywhere on screen
- **Visual feedback**: Status messages with color-coded animations

## 📁 Files

- [`zoompan-helper-tool.js`](zoompan-helper-tool.js) - **IIFE version** for console, HTML, and bookmarklets
- [`zoompan-helper-tool-tampermonkey.js`](zoompan-helper-tool-tampermonkey.js) - **Tampermonkey userscript version**

## 🔧 Installation & Usage

### Method 1: IIFE Version (Recommended for Testing)

The IIFE version (`zoompan-helper-tool.js`) is a standalone script that works in any environment without dependencies.

#### Option A: Browser Console (Quick Testing)

Perfect for one-time use or testing:

1. Open your game in the browser
2. Open the browser's developer console:
   - **Windows/Linux**: Press `F12` or `Ctrl+Shift+J`
   - **Mac**: Press `Cmd+Option+J`
3. Copy the entire contents of [`zoompan-helper-tool.js`](zoompan-helper-tool.js)
4. Paste into the console and press `Enter`
5. The tool will automatically initialize and open

**Usage:**
- The tool opens automatically after initialization
- Press `Ctrl+Shift+Z` to toggle the tool
- Type `beginZoomPanHelper()` in console to open manually
- Type `endZoomPanHelper()` in console to close

#### Option B: HTML Integration (Permanent Installation)

Best for development or local games:

1. Add the script tag to your HTML file before the closing `</body>` tag:
   ```html
   <script src="path/to/zoompan-helper-tool.js"></script>
   ```

2. Or embed it inline:
   ```html
   <script>
   // Paste the entire contents of zoompan-helper-tool.js here
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
2. Name it "ZoomPan Helper Tool"
3. Set the URL/Location to:
   ```javascript
   javascript:(function(){var s=document.createElement('script');s.src='https://your-domain.com/path/to/zoompan-helper-tool.js';document.head.appendChild(s);})();
   ```
   **Note:** Replace the URL with the actual path to your script file

4. Click the bookmark when on the game page to load the tool

**Alternative (Inline):** For offline use, you can embed the entire script:
```javascript
javascript:(function(){/* paste minified zoompan-helper-tool.js code here */})();
```

### Method 2: Tampermonkey Version (Automatic Injection)

The Tampermonkey version (`zoompan-helper-tool-tampermonkey.js`) automatically injects the tool into matching pages.

#### Prerequisites
- Install the [Tampermonkey](https://www.tampermonkey.net/) browser extension

#### Installation
1. Open Tampermonkey dashboard (click the extension icon → Dashboard)
2. Click the "+" button or "Create a new script"
3. Replace the default content with the contents of [`zoompan-helper-tool-tampermonkey.js`](zoompan-helper-tool-tampermonkey.js)
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
- Press `Ctrl+Shift+Z` to toggle the tool anytime

## 🔑 Key Differences Between Versions

### IIFE Version (`zoompan-helper-tool.js`)
- ✅ No browser extensions required
- ✅ Works in any environment (console, HTML, bookmarklet)
- ✅ Full control over when and how it loads
- ✅ Easy to test and debug
- ✅ Can be embedded directly in HTML files
- ❌ Must be manually loaded each time (unless embedded in HTML)
- ❌ Requires access to modify HTML or use console

### Tampermonkey Version (`zoompan-helper-tool-tampermonkey.js`)
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
// 2. Paste the entire contents of zoompan-helper-tool.js
// 3. Press Enter - tool opens automatically

// Manual control:
beginZoomPanHelper();  // Open the tool
endZoomPanHelper();    // Close the tool

// Or use keyboard shortcut: Ctrl+Shift+Z
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
    <script src="zoompan-helper-tool.js"></script>
</body>
</html>
```

### Example 3: Conditional Loading (IIFE)

```html
<script>
// Only load helper tool in development mode
if (location.hostname === 'localhost' || location.search.includes('debug=true')) {
    var script = document.createElement('script');
    script.src = 'zoompan-helper-tool.js';
    document.head.appendChild(script);
    console.log('ZoomPan Helper Tool loaded in debug mode');
}
</script>
```

### Example 4: Testing Specific Camera Effects (IIFE)

```javascript
// After loading the tool, you can programmatically test effects
beginZoomPanHelper();

// Wait for tool to open, then access the game controller
var controller = window.ig.game.currentWindow;

// Test a zoom effect programmatically
controller.zoomPanCamera(3, 0, 0, null, null, 0.5, 0, function() {
    console.log('Zoom effect completed');
});
```

## 🎮 How to Use

### Opening the Helper Tool
- **Automatic**: Tool opens automatically n second(s) after detecting the game scene (when `ig.game.windowName == 'game'`)
- **Keyboard shortcut**: Press `Ctrl+Shift+Z`
- **Console command**: Type `beginZoomPanHelper()` in the browser console
- **Close**: Click the × button or press `Ctrl+Shift+Z` again

### Smart Initialization
The tool includes intelligent scene detection:
- Waits for required game objects (`window.ig`, `window._DATAGAME`) to be available
- Checks if you're in the actual game scene by verifying `ig.game.windowName == 'game'`
- Only initializes when in the game scene, not during menus or loading screens
- Automatically shows the UI after n second(s) once the game scene is detected
- **To disable auto-show**: Set `_AUTO_SHOW = false` at the top of the script (line 16)

### Interface Overview

#### Input Fields

**Scale (required)**
- The zoom level for the camera
- Default: 1 (normal size)
- Example: 3 (3x zoom)

**PosX (optional)**
- Initial X position of the camera anchor point
- Leave empty to use current position
- Example: -100

**PosY (optional)**
- Initial Y position of the camera anchor point
- Leave empty to use current position
- Example: 100

**MoveX (required)**
- Horizontal movement distance
- Default: 0 (no horizontal movement)
- Example: 150

**MoveY (required)**
- Vertical movement distance
- Default: 0 (no vertical movement)
- Example: 700

**Time (optional)**
- Duration of the zoom/pan animation in seconds
- Leave empty for instant effect
- Example: 0.2

**Delay (optional)**
- Delay before starting the animation in seconds
- Leave empty for no delay
- Example: 0.5

**Easing (optional)**
- Animation easing function for smooth transitions
- Default: `Linear.EaseNone` (constant speed)
- Dropdown menu with 30 easing options across 11 categories:
  - **Linear**: EaseNone
  - **Quadratic**: EaseIn, EaseOut, EaseInOut
  - **Cubic**: EaseIn, EaseOut, EaseInOut
  - **Quartic**: EaseIn, EaseOut, EaseInOut
  - **Quintic**: EaseIn, EaseOut, EaseInOut
  - **Sinusoidal**: EaseIn, EaseOut, EaseInOut
  - **Exponential**: EaseIn, EaseOut, EaseInOut
  - **Circular**: EaseIn, EaseOut, EaseInOut
  - **Elastic**: EaseIn, EaseOut, EaseInOut
  - **Back**: EaseIn, EaseOut, EaseInOut
  - **Bounce**: EaseIn, EaseOut, EaseInOut
- **Recommended easings**:
  - For smooth, natural motion: `Cubic.EaseInOut` or `Quadratic.EaseInOut`
  - For quick start: `Cubic.EaseIn` or `Quadratic.EaseIn`
  - For smooth stop: `Cubic.EaseOut` or `Quadratic.EaseOut`
  - For dramatic effects: `Elastic.EaseOut` or `Back.EaseOut`
  - For playful animations: `Bounce.EaseOut`

#### Command Line Tools

**Parse Command**
- Paste an ANIMEFFECT command into the Command Line field
- Click "Parse Command" to extract values into individual fields
- Example command:
  ```
  ANIMEFFECT. zoom_pan scale 3 posX -100 posY 100 moveX 150 moveY 700 time 0.2 easing Cubic.EaseInOut
  ```

**Generate Command**
- Fill in the input fields with your desired values
- Click "Generate Command" to create an ANIMEFFECT command
- The generated command appears in the Command Line field

**Copy Command**
- Click the 📋 button to copy the command to clipboard
- Useful for pasting into your game scripts

#### Action Buttons

**Apply ZoomPan**
- Applies the current zoom/pan settings to the game camera
- Uses values from the input fields
- Provides visual feedback on success/failure

**Reset Camera**
- Instantly resets the camera to default position
- Stops any ongoing zoom/pan animations
- Resets: scale=1, posX=0, posY=0, anchors=0.5

**Clear Fields**
- Resets all input fields to default values
- Clears the command line
- Does not affect the current camera state

### Workflow Examples

#### Example 1: Testing a Zoom Effect
1. Set Scale to `3`
2. Set MoveX to `0` and MoveY to `0`
3. Set Time to `0.5`
4. Select Easing: `Cubic.EaseInOut` (for smooth acceleration/deceleration)
5. Click "Apply ZoomPan"
6. Click "Reset Camera" to return to normal

#### Example 2: Creating a Pan Effect
1. Set Scale to `1`
2. Set MoveX to `200` and MoveY to `100`
3. Set Time to `1.0`
4. Select Easing: `Quadratic.EaseOut` (for smooth stop)
5. Click "Apply ZoomPan"
6. Click "Generate Command" to get the ANIMEFFECT command

#### Example 3: Parsing Existing Commands
1. Copy an ANIMEFFECT command from your script
2. Paste it into the Command Line field
3. Click "Parse Command"
4. Modify values as needed (including easing)
5. Click "Apply ZoomPan" to test

#### Example 4: Testing Different Easing Functions
1. Set up a basic zoom/pan effect (e.g., Scale: 2, MoveX: 100, Time: 1.0)
2. Try different easing options from the dropdown:
   - `Linear.EaseNone` - Constant speed
   - `Cubic.EaseInOut` - Smooth start and stop
   - `Elastic.EaseOut` - Bouncy effect at the end
   - `Back.EaseOut` - Slight overshoot at the end
3. Click "Apply ZoomPan" after each selection to see the difference
4. Click "Reset Camera" between tests

### Keyboard Shortcuts
- `Ctrl+Shift+Z`: Toggle helper tool open/close
- `Enter`: Parse command (when Command Line field is focused)

## 🎨 Understanding Easing Functions

Easing functions control the rate of change during animations, making them feel more natural and polished.

### What is Easing?

Easing determines how an animation progresses over time:
- **Linear.EaseNone**: Constant speed from start to finish (no easing)
- **EaseIn**: Starts slow, accelerates toward the end
- **EaseOut**: Starts fast, decelerates toward the end
- **EaseInOut**: Starts slow, accelerates in the middle, decelerates at the end

### Easing Categories

The tool provides 30 easing functions across 11 categories:

1. **Linear** - Constant speed, no acceleration
   - Best for: Mechanical movements, UI elements

2. **Quadratic** - Gentle acceleration/deceleration
   - Best for: Subtle, natural movements

3. **Cubic** - Moderate acceleration/deceleration
   - Best for: Most camera movements, general purpose

4. **Quartic** - Strong acceleration/deceleration
   - Best for: Dramatic camera movements

5. **Quintic** - Very strong acceleration/deceleration
   - Best for: Highly dramatic effects

6. **Sinusoidal** - Smooth, wave-like motion
   - Best for: Gentle, flowing movements

7. **Exponential** - Exponential acceleration/deceleration
   - Best for: Fast, dynamic movements

8. **Circular** - Circular arc motion
   - Best for: Smooth, curved movements

9. **Elastic** - Spring-like bouncing effect
   - Best for: Playful, attention-grabbing animations

10. **Back** - Slight overshoot/undershoot
    - Best for: Emphasis, drawing attention

11. **Bounce** - Bouncing ball effect
    - Best for: Playful, energetic animations

### Quick Reference Guide

**For camera zoom/pan effects:**
- **Smooth and professional**: `Cubic.EaseInOut` or `Quadratic.EaseInOut`
- **Quick zoom in**: `Cubic.EaseIn` or `Exponential.EaseIn`
- **Smooth zoom out**: `Cubic.EaseOut` or `Quadratic.EaseOut`
- **Dramatic reveal**: `Back.EaseOut` (slight overshoot)
- **Playful/comedic**: `Elastic.EaseOut` or `Bounce.EaseOut`
- **Constant speed**: `Linear.EaseNone` (default)

### Testing Easing Functions

The dropdown menu makes it easy to experiment:
1. Set up your zoom/pan parameters
2. Select different easing functions from the dropdown
3. Click "Apply ZoomPan" to see the effect
4. Click "Reset Camera" to try another easing
5. Once satisfied, click "Generate Command" to get the code

## 🔍 Troubleshooting

### Tool Won't Load
- Ensure the game is fully loaded before running the script
- Check browser console for error messages
- Verify that required game objects (`ig`, `_DATAGAME`) are available

### Camera Effects Not Working
- Make sure you're in a game scene (not menu)
- Verify the game controller is available
- Check browser console for detailed error messages
- Ensure required fields (Scale, MoveX, MoveY) have valid values

### Command Parsing Fails
- Verify the command starts with "ANIMEFFECT."
- Ensure the command type is "zoom_pan"
- Check that parameters are in the correct format (key-value pairs)
- Example of correct format: `ANIMEFFECT. zoom_pan scale 3 moveX 0 moveY 0 easing Cubic.EaseInOut`
- Easing values must match the exact format: `EaseType.EaseTiming` (case-sensitive)

### Reset Camera Not Working
- Make sure you're in a game scene with an active camera
- Check that the game controller object exists
- Try refreshing the page if the camera state is corrupted

## 🛠 Technical Requirements

- This tool relies on the existing exposed functions and objects: `window.ig`, `window._DATAGAME`, and `zoomPanCamera()`
