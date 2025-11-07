# Object Helper Tool

A powerful helper tool for visual novel games that allows real-time testing and manipulation of object placement and animations in scenes. Available in IIFE (Immediately Invoked Function Expression) format for standalone use.

## 🚀 Features

- **🎮 Apply to Scene**: Instantly test objects in real-time without modifying game scripts
- **Real-time object control**: Test object placement and animations instantly with live preview
- **Complete property support**: Configure all object properties including position, scale, rotation, alpha, pivot, flip, tint, and more
- **Tween animation support**: Create smooth animations with easing functions and see them play immediately
- **Command parsing**: Parse OBJECT commands into individual parameters
- **Command generation**: Generate OBJECT commands from input values
- **Copy to clipboard**: Quickly copy generated commands
- **Smart initialization**: Automatically detects when you're in the game scene and shows the UI
- **Keyboard shortcuts**: Quick access with Ctrl+Shift+O
- **Draggable interface**: Move the helper window anywhere on screen
- **Visual feedback**: Status messages with color-coded feedback

## 📁 Files

- [`object-helper-tool.js`](object-helper-tool.js) - **IIFE version** for console, HTML, and bookmarklets

- [`object-helper-tool-tampermonkey.js`](object-helper-tool-tampermonkey.js) - Tampermonkey/Greasemonkey userscript version

## 🔧 Installation & Usage

### Method 1: Browser Console (Quick Testing)

Perfect for one-time use or testing:

1. Open your game in the browser
2. Open the browser's developer console:
   - **Windows/Linux**: Press `F12` or `Ctrl+Shift+J`
   - **Mac**: Press `Cmd+Option+J`
3. Copy the entire contents of [`object-helper-tool.js`](object-helper-tool.js)
4. Paste into the console and press `Enter`
5. The tool will automatically initialize and open

**Usage:**
- The tool opens automatically after initialization
- Press `Ctrl+Shift+O` to toggle the tool
- Type `beginObjectHelper()` in console to open manually
- Type `endObjectHelper()` in console to close

### Method 2: HTML Integration (Permanent Installation)

Best for development or local games:

1. Add the script tag to your HTML file before the closing `</body>` tag:
   ```html
   <script src="path/to/object-helper-tool.js"></script>
   ```

2. Or embed it inline:
   ```html
   <script>
   // Paste the entire contents of object-helper-tool.js here
   </script>
   ```

**The tool will:**
- Load automatically when the page loads
- Wait for game objects to be ready
- Check if the current window name is 'game'
- Open automatically once initialized (if in game scene)

### Method 3: Bookmarklet (Browser Bookmark)

Convenient for frequently used games:

1. Create a new bookmark in your browser
2. Name it "Object Helper Tool"
3. Set the URL/Location to:
   ```javascript
   javascript:(function(){var s=document.createElement('script');s.src='https://your-domain.com/path/to/object-helper-tool.js';document.head.appendChild(s);})();
   ```
   **Note:** Replace the URL with the actual path to your script file

4. Click the bookmark when on the game page to load the tool

## 🎮 How to Use

### Opening the Helper Tool
- **Automatic**: Tool opens automatically 1 second after detecting the game scene (when `ig.game.windowName == 'game'`)
- **Keyboard shortcut**: Press `Ctrl+Shift+O`
- **Console command**: Type `beginObjectHelper()` in the browser console
- **Close**: Click the × button or press `Ctrl+Shift+O` again

### Smart Initialization
The tool includes intelligent scene detection:
- Waits for required game objects (`window.ig`, `window._DATAGAME`) to be available
- Checks if you're in the actual game scene by verifying `ig.game.windowName == 'game'`
- Only initializes when in the game scene, not during menus or loading screens
- Automatically shows the UI after 1 second once the game scene is detected
- **To disable auto-show**: Set `_AUTO_SHOW = false` at the top of the script (line 16)

### Interface Overview

#### Required Fields

**Object ID**
- Unique identifier for the object
- Example: `basketball`, `truck2`, `wheel2`

**Source Image**
- Name of the image file (without extension)
- Example: `ball`, `truck`, `wheel_convertible`

#### FROM Properties (Initial State)

These define the starting state of the object:

- **X, Y**: Position coordinates
- **ScaleX, ScaleY**: Scale values (0-1 or higher)
- **Angle**: Rotation in degrees
- **Alpha**: Transparency (0-1, where 0 is fully transparent, 1 is fully opaque)

#### TO Properties (Tween Target - Optional)

These define the target state for animation. If left empty, the object will be placed without animation:

- **X, Y**: Target position coordinates
- **ScaleX, ScaleY**: Target scale values
- **Angle**: Target rotation in degrees
- **Alpha**: Target transparency

#### Additional Properties

**Time** (seconds)
- Duration of the tween animation
- Leave empty for instant placement
- Example: `1` for 1 second animation

**Delay** (seconds)
- Delay before starting the animation
- Leave empty for no delay
- Example: `0.2`

**PivotX, PivotY** (0-1)
- Pivot point for rotation and scaling
- Default: `0.5` (center of object)
- `0` = left/top edge, `1` = right/bottom edge

**FlipX, FlipY** (checkbox)
- Flip the object horizontally or vertically
- Check to enable

**Easing**
- Animation easing function for smooth transitions
- Default: `Linear.EaseNone`
- Options include: Quadratic, Cubic, Bounce, etc.

**zIndex**
- Layer ordering
- `< 0`: Behind characters
- `>= 0`: In front of characters
- Example: `-1`, `1`

**Remove** (checkbox)
- Remove the object after tween animation completes
- Check to enable

**Persist** (checkbox)
- Keep the object in all subsequent scenes
- Set to `false` to remove from persistence
- Check to enable

**Loop**
- Make the tween animation loop
- Options:
  - `None`: No looping
  - `Revert`: Loop back to initial FROM values
  - `Reverse`: Loop backwards (TO → FROM → TO)

**Tint**
- Apply a color tint to the object
- Format: Hex code (e.g., `#fff000`) or `none` to remove tint
- Example: `#ff0000` (red), `black`, `none`

**TextDelay** (seconds)
- Number. Optional. Add textDelay on the scene. Only for cinematic scenes without dialog.
- Add empty line between each ANIMEFFECT. or OBJECT.
- Example: `2`

#### Command Line Tools

**Parse Command**
- Paste an OBJECT command into the Command Line field
- Click "Parse Command" to extract values into individual fields
- Example command:
  ```
  OBJECT. basketball ball from { x:0,y:0, scaleX:1,scaleY:1 } to { x:0,y:400 } time 1 easing Bounce.EaseOut pivotX 0.5 pivotY 0.5 zIndex 1 remove true flipX true
  ```

**Generate Command**
- Fill in the input fields with your desired values
- Click "Generate Command" to create an OBJECT command
- The generated command appears in the Command Line field

**Copy Command**
- Click the 📋 button to copy the command to clipboard
- Useful for pasting into your game scripts

#### Action Buttons

**Apply to Scene**
- Instantly applies the object to the current game scene
- Uses the values from all input fields to create and place the object
- Enables real-time testing without needing to modify game scripts
- Shows animation if TO properties are set
- **Multiple objects**: Each unique Object ID creates a separate object in the scene
- **Update existing**: Reapplying the same Object ID updates that object's properties
- **Preserves others**: Applying a new object keeps all existing objects in the scene
- **Existing animations are preserved**: Applying a new object will not reset or restart animations of other objects; only the new/updated object's animation is started/restarted

- **Requirements**: Must be in the game scene (not menus or loading screens)
- **Note**: Applied objects are temporary and won't persist unless you add the command to your game script

**Clear Fields**
- Resets all input fields to default values
- Clears the command line
- Does not affect objects currently in the scene

### Workflow Examples

#### Example 1: Real-Time Testing with Apply to Scene
1. Open the game and navigate to any scene
2. Press `Ctrl+Shift+O` to open the Object Helper
3. Set Object ID to `ball1`
4. Set Source Image to `ball`
5. Set FROM: X=`200`, Y=`200`
6. Click **"Apply to Scene"** - the ball appears instantly!
7. Adjust the position values and click "Apply to Scene" again to see changes
8. Once satisfied, click "Generate Command" to get the command for your script
9. Copy the command: `OBJECT. ball1 ball from { x:200,y:200 }`

**Adding Multiple Objects:**
1. Change Object ID to `ball2`
2. Set FROM: X=`400`, Y=`200`
3. Click **"Apply to Scene"** - now you have TWO balls on screen!
4. Change Object ID to `ball3`, set different position, apply again
5. All three balls coexist in the scene simultaneously

#### Example 2: Simple Object Placement (No Animation)
1. Set Object ID to `ball1`
2. Set Source Image to `ball`
3. Set FROM X to `200`, Y to `200`
4. Click "Generate Command"
5. Copy the command: `OBJECT. ball1 ball from { x:200,y:200 }`

#### Example 3: Testing Animation in Real-Time
1. Set Object ID to `basketball`
2. Set Source Image to `ball`
3. Set FROM: X=`0`, Y=`0`, ScaleX=`1`, ScaleY=`1`
4. Set TO: X=`0`, Y=`400`
5. Set Time to `1`
6. Set Easing to `Bounce.EaseOut`
7. Click **"Apply to Scene"** - watch the ball bounce down!
8. Try different easing functions and click "Apply to Scene" to compare
9. Adjust timing and positions until perfect
10. Click "Generate Command" when satisfied

Result:
```
OBJECT. basketball ball from { x:0,y:0,scaleX:1,scaleY:1 } to { x:0,y:400 } time 1 easing Bounce.EaseOut
```

#### Example 4: Animated Object Entry (Full Command)
1. Set Object ID to `basketball`
2. Set Source Image to `ball`
3. Set FROM: X=`0`, Y=`0`, ScaleX=`1`, ScaleY=`1`
4. Set TO: X=`0`, Y=`400`
5. Set Time to `1`
6. Set Easing to `Bounce.EaseOut`
7. Set PivotX to `0.5`, PivotY to `0.5`
8. Set zIndex to `1`
9. Check "Remove" checkbox
10. Check "FlipX" checkbox
11. Click "Generate Command"

Result:
```
OBJECT. basketball ball from { x:0,y:0,scaleX:1,scaleY:1 } to { x:0,y:400 } time 1 pivotX 0.5 pivotY 0.5 flipX true easing Bounce.EaseOut zIndex 1 remove true
```

#### Example 5: Looping Rotation Animation
1. Set Object ID to `wheel2`
2. Set Source Image to `wheel_convertible`
3. Set FROM: X=`-448`, Y=`1487`, Angle=`360`
4. Set TO: Angle=`0`
5. Set Time to `1`
6. Set PivotX to `0.5`, PivotY to `0.5`
7. Check "FlipX" checkbox
8. Set zIndex to `1`
9. Check "Persist" checkbox
10. Set Loop to `revert`
11. Click "Generate Command"

Result:
```
OBJECT. wheel2 wheel_convertible from { x:-448,y:1487,angle:360 } to { angle:0 } time 1 pivotX 0.5 pivotY 0.5 flipX true zIndex 1 persist true loop revert
```

#### Example 6: Object with Tint
1. Set Object ID to `ball2`
2. Set Source Image to `ball`
3. Set FROM: X=`200`, Y=`200`
4. Set Tint to `#fff000`
5. Click "Generate Command"

Result:
```
OBJECT. ball2 ball from { x:200,y:200 } tint #fff000
```

#### Example 7: Parsing Existing Commands
1. Copy an OBJECT command from your script
2. Paste it into the Command Line field
3. Click "Parse Command"
4. Modify values as needed
5. Click "Generate Command" to get the updated command

### Keyboard Shortcuts
- `Ctrl+Shift+O`: Toggle helper tool open/close
- `Enter`: Parse command (when Command Line field is focused)

## 📝 OBJECT Command Format Reference

```
OBJECT. <objectID> <source> [from { properties }] [to { properties }] [options]
```

### Properties in FROM/TO objects:
- `x`, `y`: Position
- `scaleX`, `scaleY`: Scale (0-1 or higher)
- `angle`: Rotation in degrees
- `alpha`: Transparency (0-1)

### Options:
- `time <number>`: Tween duration in seconds
- `delay <number>`: Delay before tween starts
- `pivotX <number>`, `pivotY <number>`: Pivot point (0-1)
- `flipX <bool>`, `flipY <bool>`: Flip horizontally/vertically
- `easing <EasingType>`: Easing function
- `zIndex <int>`: Layer ordering
- `remove <bool>`: Remove after tween
- `persist <bool>`: Keep in all scenes
- `loop <revert|reverse>`: Loop type
- `tint <hex|none>`: Color tint
- `textDelay <number>`: Number. Optional. Add textDelay on the scene. Only for cinematic scenes without dialog. Add empty line between each ANIMEFFECT. or OBJECT.

### Important Notes:
- **Curly brackets must be separated by spaces**: `from { x:0,y:0 }` not `from {x:0,y:0}`
- **Multiple objects require separate commands**
- **Objects not listed in a scene won't appear** (unless persisted)
- **No TO properties** = instant placement without animation
- **Persist true** = object appears in all subsequent scenes
- **Persist false** = removes persisted object

## 🔍 Troubleshooting

### Tool Won't Load
- Ensure the game is fully loaded before running the script
- Check browser console for error messages
- Verify that required game objects (`ig`, `_DATAGAME`) are available

### Command Parsing Fails
- Verify the command starts with "OBJECT."
- Ensure curly brackets have spaces: `from { x:0 }` not `from {x:0}`
- Check that properties are in the correct format (key:value pairs)
- Make sure object notation is properly closed with `}`

### Generated Command Doesn't Work
- Verify Object ID and Source are filled in
- Check that FROM properties are set (required for new objects)
- Ensure numeric values are valid numbers
- Test the command by pasting it into your game script

## 🛠 Technical Requirements

- This tool generates commands for the `placeOverlayObject` function in the game controller
- Objects are spawned as `EntityOverlay` entities
- Relies on exposed game objects: `window.ig`, `window._DATAGAME`

## 🎯 Tips for Best Results

1. **Use Apply to Scene for Testing**: Click "Apply to Scene" to instantly see your object in the game. Adjust values and reapply until perfect, then generate the command for your script
2. **Start Simple**: Begin with basic placement (just FROM properties) before adding animations
3. **Test Animations Live**: Use "Apply to Scene" to preview different easing functions and timing in real-time
4. **Iterate Quickly**: Change values → Apply to Scene → Observe → Repeat until satisfied
5. **Use Persist Wisely**: Remember that persisted objects appear in ALL subsequent scenes
6. **Layer Management**: Use negative zIndex for background objects, positive for foreground
7. **Pivot Points**: Set pivot to 0.5,0.5 for center rotation, adjust for different rotation points
8. **Tint Colors**: Use hex codes for precise colors, or color names like `black`, `white`
9. **Remove vs Persist**: Use `remove true` for temporary effects, `persist` for objects that should stay

