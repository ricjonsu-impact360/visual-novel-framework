# Visual Novel Engine - Complete Documentation

**Version:** 2.0.0
**Last Updated:** 2025-11-07
**Engine Size:** ~20MB
**Location:** `visual-novel-engine/`

---

## Table of Contents

1. [Introduction](#introduction)
2. [Core Game Loop](#core-game-loop)
3. [Impact.js Framework](#impactjs-framework)
4. [Plugin System](#plugin-system)
5. [Scene Execution](#scene-execution)
6. [Asset Loading](#asset-loading)
7. [Character Rendering](#character-rendering)
8. [Dialogue System](#dialogue-system)
9. [Audio System](#audio-system)
10. [Save/Load System](#saveload-system)
11. [Game Controllers](#game-controllers)
12. [API Reference](#api-reference)
13. [Extending the Engine](#extending-the-engine)

---

## Introduction

The Visual Novel Engine is a browser-based 2D game engine built on Impact.js, specifically designed for visual novel games. It provides a complete system for rendering backgrounds, animating characters, displaying dialogue, managing audio, and handling player choices.

### Key Features

- **Scene Management**: Director system for level/chapter organization
- **Character System**: Skeletal animation via Spriter (13-part modular system)
- **Dialogue System**: Chat bubbles with customizable styling
- **Audio**: BGM and SFX with Howler.js
- **Save/Load**: Encrypted localStorage persistence
- **Multi-language**: Runtime language switching
- **Responsive**: Automatic scaling for different screen sizes
- **Monetization**: Built-in shop, currency, and reward systems

### File Structure

```
visual-novel-engine/
├── engine.js (1.49MB)        # Compiled engine
├── engine.css                # Engine styles
├── lib/
│   ├── game/
│   │   ├── main.js           # Main game entry (MyGame class)
│   │   ├── entities/         # Game entities (87 classes)
│   │   └── levels/           # Level definitions (menu, game, preview)
│   ├── impact/               # Impact.js core (14 files)
│   └── plugins/              # Plugin system (114 files)
└── media/                    # Sample assets
```

---

## Core Game Loop

### Initialization Flow

**Entry Point:** `index.html` → `engine.js` → `ig.main()`

**File:** `lib/impact/impact.js:567-592`

```javascript
ig.main = function(canvasId, gameClass, fps, width, height, scale, loaderClass) {
    // 1. Create system
    ig.system = new ig.System(canvasId, fps, width, height, scale);

    // 2. Create input manager
    ig.input = new ig.Input();

    // 3. Create sound manager
    ig.soundManager = new ig.SoundManager();

    // 4. Create music manager
    ig.music = new ig.Music();

    // 5. Create and start loader
    ig.system.setGame(loaderClass);
    var loader = new loaderClass(gameClass, ig.resources);
    loader.load();
}
```

### Game Loop Architecture

**File:** `lib/impact/system.js:91-115`

```javascript
run: function() {
    // 1. Update timer
    ig.Timer.step();

    // 2. Calculate elapsed time
    this.tick = this.clock.tick();

    // 3. Call game's run() method
    this.delegate.run();

    // 4. Clear input state
    ig.input.clearPressed();

    // 5. Handle game class switching
    if(this.newGameClass) {
        this.setGameNow(this.newGameClass);
        this.newGameClass = null;
    }
}
```

### Game Run Cycle

**File:** `lib/impact/game.js:169-251`

```javascript
run: function() {
    this.update();  // Update game state
    this.draw();    // Render frame
}

update: function() {
    // 1. Load deferred levels
    if(this.loadLevelDeferred) {
        this.loadLevel(this.loadLevelDeferred);
        this.loadLevelDeferred = null;
    }

    // 2. Update all entities
    this.updateEntities();

    // 3. Check collisions
    this.checkEntities();

    // 4. Remove killed entities
    for(var i=0; i<this.entities.length; i++) {
        if(this.entities[i]._killed) {
            this.entities.splice(i, 1);
        }
    }

    // 5. Sort entities if needed
    if(this.sortBy) {
        this.entities.sort(this.sortBy);
    }

    // 6. Update background maps
    for(var i=0; i<this.backgroundMaps.length; i++) {
        this.backgroundMaps[i].update();
    }
}

draw: function() {
    // 1. Clear screen
    this.screen.clearRect(0, 0, ig.system.width, ig.system.height);

    // 2. Draw background maps
    for(var i=0; i<this.backgroundMaps.length; i++) {
        if(this.backgroundMaps[i].foreground) continue;
        this.backgroundMaps[i].draw();
    }

    // 3. Draw all entities
    this.drawEntities();

    // 4. Draw foreground maps
    for(var i=0; i<this.backgroundMaps.length; i++) {
        if(!this.backgroundMaps[i].foreground) continue;
        this.backgroundMaps[i].draw();
    }
}
```

**Frame Rate:** Typically 30 FPS (configurable)
**Update Order:** Entities → Collisions → Cleanup → Background Animation
**Draw Order:** Background Maps → Entities (by zIndex) → Foreground Maps

---

## Impact.js Framework

### Module System

**File:** `lib/impact/impact.js:230-354`

Impact.js uses a custom module system for dependency management:

```javascript
// Define a module
ig.module('game.entities.player')
    .requires(
        'impact.entity',
        'impact.animation'
    )
    .defines(function() {
        // Module code here
        EntityPlayer = ig.Entity.extend({
            // ...
        });
    });
```

**Key Functions:**

| Function | Purpose |
|----------|---------|
| `ig.module(name)` | Declare a module |
| `.requires(...deps)` | List dependencies |
| `.defines(body)` | Execute module body |

**Dependency Resolution:**
- Automatically loads dependencies via XHR
- Resolves in correct order
- Detects circular dependencies
- Caches loaded modules

### Class System

**File:** `lib/impact/impact.js:459-551`

```javascript
// Create a class
MyClass = ig.Class.extend({
    // Constructor
    init: function(x, y) {
        this.x = x;
        this.y = y;
    },

    // Method
    move: function(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
});

// Inheritance
MySubClass = MyClass.extend({
    init: function(x, y, z) {
        this.parent(x, y);  // Call parent constructor
        this.z = z;
    },

    move: function(dx, dy) {
        this.parent(dx, dy);  // Call parent method
        // Additional logic
    }
});

// Usage
var obj = new MyClass(10, 20);
obj.move(5, 5);
```

**Features:**
- `ig.Class.extend(def)` - Create class
- `this.parent(args)` - Call parent method
- `staticInstantiate()` - Factory pattern support
- Deep property copying

### Entity System

**File:** `lib/impact/entity.js`

**Base Entity Properties:**

```javascript
ig.Entity = ig.Class.extend({
    // Position and size
    pos: {x: 0, y: 0},
    size: {x: 16, y: 16},
    offset: {x: 0, y: 0},

    // Physics
    vel: {x: 0, y: 0},
    accel: {x: 0, y: 0},
    friction: {x: 0, y: 0},
    maxVel: {x: 100, y: 100},

    // Collision
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,

    // Rendering
    animSheet: null,
    currentAnim: null,
    zIndex: 0,
    alpha: 1,

    // State
    health: 10,
    _killed: false
});
```

**Entity Lifecycle:**

1. **init(x, y, settings)** - Constructor
2. **ready()** - Called after level load
3. **update()** - Called every frame
4. **draw()** - Render entity
5. **kill()** - Mark for removal

**Collision Types:**

```javascript
ig.Entity.TYPE = {
    NONE: 0,
    A: 1,
    B: 2,
    BOTH: 3
};

ig.Entity.COLLIDES = {
    NEVER: 0,
    LITE: 1,
    PASSIVE: 2,
    ACTIVE: 3,
    FIXED: 4
};
```

---

## Plugin System

### Plugin Architecture

The engine uses an **injection pattern** to extend core classes:

**File:** `lib/game/main.js:1-63`

```javascript
// Example plugin injection
ig.Game.inject({
    customMethod: function() {
        // New method added to ig.Game
    },

    init: function() {
        this.parent();  // Call original init
        // Custom initialization
    }
});

ig.Entity.inject({
    customProperty: null,

    update: function() {
        this.parent();  // Call original update
        // Custom update logic
    }
});
```

### Core Plugins Loaded

**File:** `lib/game/main.js:4-60`

**Load Order (important!):**

1. **Framework Patches** (14 files)
   - fps-limit-patch
   - timer-patch
   - user-agent-patch
   - webkit-image-smoothing-patch
   - windowfocus-onMouseDown-patch
   - input-patch

2. **Core Systems**
   - pointer (mouse/touch input)
   - responsive (screen scaling)
   - font.font-loader
   - handlers.dom-handler
   - handlers.size-handler
   - handlers.api-handler
   - handlers.visibility-handler

3. **Audio System**
   - audio.sound-handler
   - audio.howler-player
   - audio.sound-info

4. **I/O and Storage**
   - io.io-manager
   - io.storage-manager
   - secure-ls (AES encryption)

5. **Scene Management**
   - director (level manager)
   - custom-loader (asset loading)

6. **Animation and Rendering**
   - tweener
   - tween
   - tweens-handler
   - spriter.spriter (character animation)
   - chat-bubble.chat-bubble-manager

7. **Special Features**
   - tiered-rv.tiered-rv (reward videos)
   - fullscreen
   - freezeframe.freezeframe-plugin
   - multilang (localization)
   - notification (toast messages)
   - progressbar

### Plugin Categories

**Total: 114 files across 16 directories**

| Directory | Files | Purpose |
|-----------|-------|---------|
| **audio/** | 4 | Sound management (Howler.js wrapper) |
| **chat-bubble/** | 12 | Dialogue UI and bubble rendering |
| **data/** | 6 | Vector, color, geometry utilities |
| **font/** | 3 | Font loading and rendering |
| **freezeframe/** | 2 | GIF recording for marketing |
| **handlers/** | 8 | DOM, resize, API, visibility handling |
| **io/** | 4 | Storage manager, API communication |
| **packer/** | 3 | Asset packing and optimization |
| **particles/** | 2 | Particle system for visual effects |
| **patches/** | 14 | Framework fixes and enhancements |
| **responsive-keyboard/** | 2 | Mobile keyboard input |
| **spriter/** | 18 | Skeletal character animation |
| **tiered-rv/** | 4 | Reward video monetization |
| **Root** | 32 | Director, loader, tweens, multilang, etc. |

### Creating Custom Plugins

**Template:**

```javascript
// File: lib/plugins/my-plugin.js
ig.module('plugins.my-plugin')
    .requires(
        'impact.game'
    )
    .defines(function() {

        // Extend ig.Game
        ig.Game.inject({
            myPluginData: null,

            init: function() {
                this.parent();
                this.myPluginData = {};
                console.log('My plugin initialized');
            },

            myCustomMethod: function() {
                // Your logic here
            }
        });

        // Extend ig.Entity
        ig.Entity.inject({
            myEntityProperty: false,

            update: function() {
                this.parent();
                if(this.myEntityProperty) {
                    // Custom behavior
                }
            }
        });
    });
```

**Usage in main.js:**

```javascript
ig.module('game.main')
    .requires(
        'impact.game',
        // ... other plugins
        'plugins.my-plugin'  // Add your plugin
    )
    .defines(function() {
        // Game code
    });
```

---

## Scene Execution

### Director System

**File:** `lib/plugins/director.js`

The Director manages levels (chapters/scenes) and transitions.

**Director Class:**

```javascript
ig.Director = ig.Class.extend({
    game: null,
    levels: [],
    currentLevel: 0,

    init: function(theGame, initialLevels) {
        this.game = theGame;
        this.levels = [];
        this.currentLevel = 0;
        if(initialLevels) {
            this.append(initialLevels);
        }
    }
});
```

**Key Methods:**

| Method | Purpose | Example |
|--------|---------|---------|
| `loadLevel(n)` | Load level by index | `ig.director.loadLevel(0)` |
| `append(levels)` | Add levels to queue | `ig.director.append([level1, level2])` |
| `nextLevel()` | Go to next level | `ig.director.nextLevel()` |
| `previousLevel()` | Go to previous level | `ig.director.previousLevel()` |
| `jumpTo(level)` | Jump to specific level | `ig.director.jumpTo(levelObject)` |
| `reloadLevel()` | Restart current level | `ig.director.reloadLevel()` |
| `firstLevel()` | Go to first level | `ig.director.firstLevel()` |
| `lastLevel()` | Go to last level | `ig.director.lastLevel()` |

**Level Structure:**

```javascript
// File: lib/game/levels/game.js
LevelGame = {
    entities: [
        {
            type: "EntityGameController",
            x: 0,
            y: 0,
            settings: {}
        }
    ],
    layer: []  // Background map layers
};

LevelGameResources = [
    // Preloaded resources for this level
];
```

### Level Loading Process

**File:** `lib/impact/game.js:43-79`

```javascript
loadLevel: function(data) {
    // 1. Clear current state
    this.screen.clear();
    this.entities = [];
    this.namedEntities = {};

    // 2. Spawn entities from level data
    for(var i=0; i<data.entities.length; i++) {
        var ent = data.entities[i];
        this.spawnEntity(ent.type, ent.x, ent.y, ent.settings);
    }

    // 3. Sort entities by zIndex
    this.sortEntities();

    // 4. Load map layers
    this.collisionMap = ig.CollisionMap.staticNoCollision;
    this.backgroundMaps = [];

    for(var i=0; i<data.layer.length; i++) {
        var ld = data.layer[i];
        if(ld.name == 'collision') {
            this.collisionMap = new ig.CollisionMap(ld.tilesize, ld.data);
        } else {
            var newMap = new ig.BackgroundMap(ld.tilesize, ld.data, ld.tilesetName);
            this.backgroundMaps.push(newMap);
        }
    }

    // 5. Call ready() on all entities
    for(var i=0; i<this.entities.length; i++) {
        this.entities[i].ready();
    }
}
```

### Chapter/Scene Structure

Visual novels use a simplified level system:

**Levels:**
1. **LevelMenu** - Main menu (EntityMenuController)
2. **LevelGame** - Game play (EntityGameController)
3. **LevelPreview** - Character preview (EntityPreviewController)

**Scene Data Structure:**

Scenes are stored in `_LANG[language][chapter]` arrays:

```javascript
_LANG["en"]["Chapter1"] = [
    {
        sceneID: 0,
        charTalk: "Amy",
        text: "Hello!",
        char: [{name: "Amy", position: "center"}],
        bg: {name: "office", pos: "center"},
        bgm: {name: "calm_morning"}
    },
    // ... more scenes
];
```

---

## Asset Loading

### Custom Loader

**File:** `lib/plugins/custom-loader.js`

The custom loader handles chapter-specific asset preloading.

**Loading Workflow:**

```
1. GameController initializes
   ↓
2. Calls loadAssets()
   ↓
3. Loads chapter translation file (chapter1.en.js)
   ↓
4. Calls handleLoadAssets()
   ↓
5. Reads customload.js manifest for current chapter
   ↓
6. Preloads all assets:
   - Backgrounds (JPG/PNG)
   - Character sprites (Spriter)
   - Objects/props (PNG)
   - Sound effects (MP3/OGG)
   - Background music (MP3/OGG)
   - Voice acting (MP3)
   ↓
7. Shows loading screen with progress bar
   ↓
8. Calls update() each frame to check progress
   ↓
9. When all assets loaded, hides loading screen
   ↓
10. Game controller ready to execute scenes
```

**Key Methods:**

```javascript
loadAssets: function() {
    // Check if chapter strings are loaded
    if(!_LANG[currentLang][chapterName]) {
        // Load translation file via jQuery
        $.getScript('media/text/translate/' + chapterFile + '.js',
            function() {
                ig.game.handleLoadAssets();
            }
        );
    } else {
        this.handleLoadAssets();
    }
}

handleLoadAssets: function() {
    // Find chapter in customload.js
    var chapterData = _CUSTOMLOAD.Chapter[chapterIndex];

    // Load backgrounds
    for(var i=0; i<chapterData.bg.length; i++) {
        var bgImage = new ig.Image(_BASEPATH.background + chapterData.bg[i]);
        this.resourcesImages.push(bgImage);
    }

    // Load characters (Spriter)
    for(var i=0; i<chapterData.character.length; i++) {
        this.loadBoySpriter(chapterData.character[i]);
        this.loadGirlSpriter(chapterData.character[i]);
    }

    // Load objects
    for(var i=0; i<chapterData.object.length; i++) {
        var objImage = new ig.Image(_BASEPATH.object + chapterData.object[i]);
        this.resourcesImages.push(objImage);
    }

    // Load SFX
    for(var i=0; i<chapterData.sfx.length; i++) {
        ig.soundHandler.sfxPlayer.addAudioData(
            {path: _BASEPATH.sfx + chapterData.sfx[i]},
            chapterData.sfx[i]
        );
    }

    // Load BGM
    for(var i=0; i<chapterData.bgm.length; i++) {
        ig.soundHandler.bgmPlayer.addAudioData(
            {path: _BASEPATH.bgm + chapterData.bgm[i], loop: true},
            chapterData.bgm[i]
        );
    }
}

update: function() {
    // Check loading progress
    var totalAssets = this.resourcesImages.length + Object.keys(this.soundList).length;
    var loadedAssets = 0;

    // Count loaded images
    for(var i=0; i<this.resourcesImages.length; i++) {
        if(this.resourcesImages[i].loaded) {
            loadedAssets++;
        }
    }

    // Count loaded sounds
    for(var name in this.soundList) {
        if(this.soundList[name].state() == 'loaded') {
            loadedAssets++;
        }
    }

    // Update progress bar
    this.loadProgress = loadedAssets / totalAssets;

    // All loaded?
    if(loadedAssets >= totalAssets) {
        this.hideLoadingScreen();
    }
}

drawLoadingScreen: function() {
    // Draw background
    ig.system.context.fillStyle = _GAMESETTING._DATAGAME.uiColor.bubble.bgColor;
    ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);

    // Draw title image
    if(this.titleImage && this.titleImage.loaded) {
        this.titleImage.draw(centerX, centerY);
    }

    // Draw progress bar
    var barWidth = 400;
    var barHeight = 20;
    var progress = this.loadProgress;

    // Background
    ig.system.context.fillStyle = '#333333';
    ig.system.context.fillRect(centerX - barWidth/2, centerY + 100, barWidth, barHeight);

    // Progress
    ig.system.context.fillStyle = '#00FF00';
    ig.system.context.fillRect(centerX - barWidth/2, centerY + 100, barWidth * progress, barHeight);
}
```

### Asset Manifest Format

**File:** `media/text/customload.js`

```javascript
var _CUSTOMLOAD = {
    Chapter: [
        {},  // Chapter 0 - empty placeholder

        // Chapter 1
        {
            "chapterID": "Chapter1",
            "bg": ["office", "cafe", "park"],
            "character": ["Amy", "Jack"],
            "object": ["desk", "chair", "laptop"],
            "sfx": ["phone_ring", "door_open"],
            "bgm": ["calm_morning"],
            "duTheme": ["Amy"],  // Dress-up characters
            "outfit": [],
            "voiceover": []
        },

        // Chapter 2
        {
            "chapterID": "Chapter2",
            // ... assets for chapter 2
        }
    ]
};
```

**Asset Type Mapping:**

| Field | Base Path | Extension | Example |
|-------|-----------|-----------|---------|
| `bg` | `_BASEPATH.background` | `.jpg` or `.png` | `"office"` → `media/graphics/backgrounds/office.jpg` |
| `character` | `_BASEPATH.spriter` | (folder) | `"Amy"` → `media/graphics/sprites/amy/` |
| `object` | `_BASEPATH.object` | `.png` | `"desk"` → `media/graphics/object/desk.png` |
| `sfx` | `_BASEPATH.sfx` | `.mp3` | `"phone_ring"` → `media/audio/sfx/phone_ring.mp3` |
| `bgm` | `_BASEPATH.bgm` | `.mp3` | `"calm_morning"` → `media/audio/bgm/calm_morning.mp3` |
| `voiceover` | `_BASEPATH.voiceover` | `.mp3` | `"scene1_amy"` → `media/audio/voiceover/scene1_amy.mp3` |

---

## Character Rendering

### Spriter System

**File:** `lib/plugins/spriter/`

Spriter is a skeletal animation system that allows modular character creation with interchangeable parts.

**Architecture:**

```
SpriterCharacter (Boy/Girl)
    │
    ├── 13 Body Parts
    │   ├── skin
    │   ├── face
    │   ├── hair
    │   ├── top
    │   ├── bottom
    │   ├── shoes
    │   ├── glasses
    │   ├── earrings
    │   ├── hat
    │   ├── beard
    │   ├── anklet
    │   ├── bracelet
    │   └── necklace
    │
    └── Animations
        ├── ANIM_IDLE
        ├── ANIM_WALK
        ├── ANIM_TALK
        ├── ANIM_SIT
        └── 60+ more...
```

### Spriter Core Classes

**File:** `lib/plugins/spriter/spriter.js`

```javascript
Spriter = ig.Class.extend({
    folders: null,      // Sprite sheet folders (SpriterIdNameMap)
    entities: null,     // Animation entities (SpriterIdNameMap)

    init: function() {
        this.folders = new SpriterIdNameMap();
        this.entities = new SpriterIdNameMap();
    },

    addFolder: function(folder) {
        this.folders.add(folder);
    },

    addEntity: function(entity) {
        this.entities.add(entity);
    },

    getEntityByName: function(name) {
        return this.entities.getByName(name);
    },

    getAnimationByName: function(name) {
        // Find animation in entities
    }
});
```

### Spriter Display Entity

**File:** `lib/plugins/spriter/spriter-display.js`

```javascript
SpriterDisplay = ig.Entity.extend({
    scml: null,                   // SCML sprite data
    spriter: null,                // Spriter object
    currentAnimationName: "",     // Active animation
    animation: null,              // Animation object
    animationSpeed: 0,            // Play speed (%)
    scale: {x: 1, y: 1},          // X/Y scale
    bones: [],                    // Skeleton bones
    objects: [],                  // Sprite objects
    attachedImages: {},           // Custom overlays
    time: 0,                      // Animation time
    pause: false,                 // Pause flag
    finished: false,              // Complete flag

    // Set animation
    setAnimationByName: function(name, restart) {
        this.currentAnimationName = name;
        this.animation = this.spriter.getAnimationByName(name);
        if(restart) {
            this.time = 0;
        }
    },

    // Set speed (0-100%)
    setAnimationSpeed: function(percent) {
        this.animationSpeed = percent;
    },

    // Attach image to bone
    attachImage: function(bone, image, offsetX, offsetY, hideOriginal) {
        this.attachedImages[bone] = {
            image: image,
            offsetX: offsetX,
            offsetY: offsetY,
            hideOriginal: hideOriginal
        };
    },

    update: function() {
        if(!this.pause && this.animation) {
            this.time += ig.system.tick * this.animationSpeed / 100;

            // Loop animation
            if(this.time >= this.animation.length) {
                this.time = 0;
                this.finished = true;
            }
        }

        this.parent();
    },

    draw: function() {
        // Draw all sprite parts at correct positions
        for(var i=0; i<this.objects.length; i++) {
            var obj = this.objects[i];
            obj.image.draw(obj.x, obj.y, obj.angle, obj.scale.x, obj.scale.y);
        }

        this.parent();
    }
});
```

### Character Entities

**File:** `lib/game/entities/object/girl.js`

```javascript
SpriterGirl = SpriterDisplay.extend({
    charName: "amy",
    currentDU: null,

    init: function(x, y, settings) {
        this.parent(x, y, settings);

        // Load SCML data
        this.scml = new Spriter(spriterDataGirl);
        this.spriter = this.scml;

        // Set initial outfit
        this.changeDU(this.charName);

        // Set initial animation
        this.setAnimationByName("ANIM_IDLE");
    },

    // Change outfit/appearance
    changeDU: function(duName) {
        // Get outfit data from settings
        var outfitData = _DATAGAME.spriterData[duName].girl;

        // Load all 13 parts
        var parts = ['skin','face','hair','top','bottom','shoes',
                     'glasses','earrings','hat','beard','anklet',
                     'bracelet','necklace'];

        for(var i=0; i<parts.length; i++) {
            var partName = parts[i];
            var partValue = outfitData[partName];

            // Load images for this part
            var bones = _DATAGAME.girlPart[i+1];
            for(var j=0; j<bones.length; j++) {
                var boneName = bones[j];
                var imagePath = _BASEPATH.spriter + 'girl/' +
                                partValue + '/' + boneName + '.png';
                var image = new ig.Image(imagePath);

                // Attach to spriter bone
                this.spriter.attachImage(boneName + '.png', image, 0, 0, true);
            }
        }

        this.currentDU = duName;
    },

    // Change pose/animation
    changePose: function(animName) {
        this.setAnimationByName(animName, true);
    }
});
```

**Available Animations (60+ total):**

| Category | Animations |
|----------|------------|
| **Idle** | ANIM_IDLE, ANIM_IDLE_HAPPY, ANIM_IDLE_SAD |
| **Movement** | ANIM_WALK, ANIM_RUN, ANIM_JUMP |
| **Sitting** | ANIM_SIT, ANIM_SIT_TYPING, ANIM_SIT_READING |
| **Emotions** | ANIM_HAPPY, ANIM_SAD, ANIM_ANGRY, ANIM_CRY |
| **Actions** | ANIM_TALK, ANIM_WAVE, ANIM_POINT, ANIM_HUG |
| **Combat** | ANIM_PUNCH, ANIM_KICK, ANIM_DEFEND |
| **Special** | ANIM_SLEEP, ANIM_DANCE, ANIM_LAUGH |

### Character Usage in Scenes

```javascript
// Scene object with character
{
    "sceneID": 5,
    "charTalk": "Amy",
    "text": "Hello!",
    "char": [
        {
            "name": "Amy",           // Character name (matches spriterData)
            "position": "center",    // left|center|right
            "anim": "ANIM_TALK",     // Animation
            "emotion": "EMO_HAPPY",  // Emotion/expression
            "faceTo": "right",       // Direction: left|right
            "shadow": true,          // Drop shadow
            "zIndex": 10,            // Draw order
            "outfit": "casual"       // Alternative outfit (optional)
        }
    ]
}
```

---

## Dialogue System

### Chat Bubble Manager

**File:** `lib/plugins/chat-bubble/chat-bubble-manager.js`

The chat bubble system displays character dialogue in customizable speech bubbles.

**Game Injection:**

```javascript
ig.Game.inject({
    spawnChatBubble: function(chatBubbleParent, configs) {
        // Check if need to close previous bubble
        if(configs.chatBubbleDrawConfigs.bubbleConfigs.chatType != 'text') {
            if(chatBubbleParent.currentChatBubble) {
                chatBubbleParent.currentChatBubble.closeChatBubble();
                chatBubbleParent.currentChatBubble = null;
            }
        }

        // Set zIndex above parent
        if(!configs.zIndex) {
            configs.zIndex = chatBubbleParent.zIndex + 1;
        }

        // Spawn bubble entity
        var entity = ig.game.spawnEntity(ig.ChatBubble.Entity,
            Number.MIN_VALUE, Number.MIN_VALUE, configs);

        ig.game.sortEntitiesDeferred();

        // Link to parent
        chatBubbleParent.currentChatBubble = entity;

        return entity;
    }
});

ig.Entity.inject({
    currentChatBubble: null,

    kill: function() {
        // Clean up chat bubble when entity dies
        if(this.currentChatBubble) {
            this.currentChatBubble.closeChatBubble();
            this.currentChatBubble = null;
        }
        this.parent();
    }
});
```

### Bubble Configuration

**From GameController:**

```javascript
bubbleConfigs: {
    narrationWidth: 480 * _DATAGAME.ratioRes,
    width: 440 * _DATAGAME.ratioRes,
    height: 60 * _DATAGAME.ratioRes,
    fontSize: 30 * _DATAGAME.ratioRes,
    fontSizeName: 30,
    fontName: 'metromed',
    fontTextName: 'metroblack',
    position: {x: 0, y: 0},
    bubbleWidth: 440 * _DATAGAME.ratioRes
}
```

### Dialogue Display Flow

```
1. GameController reads scene object
   ↓
2. Extracts dialogue properties:
   - charTalk (speaker name)
   - text (dialogue text)
   - bubble (bubble type: normal|think|none)
   - bubbleOffsetY (vertical offset)
   ↓
3. Parse text into sentences
   ↓
4. Create bubble config object
   ↓
5. Spawn chat bubble entity
   ↓
6. Animate text display (typewriter effect)
   ↓
7. Wait for player input (click/tap)
   ↓
8. Close bubble
   ↓
9. Move to next scene
```

### Bubble Types

| Type | Description | Usage |
|------|-------------|-------|
| **normal** | Standard dialogue bubble | Character speaking |
| **think** | Thought bubble | Character thinking |
| **narration** | Narrator text box | Story narration |
| **none** | No bubble (text only) | System messages |

### Text Animation

```javascript
// Text display variables
fullSentence: [],       // Parsed sentences
arrText: [],            // Split text array
text: '',               // Full dialogue
currentWord: 0,         // Display progress
counterWord: 0,         // Frame counter
modWord: 60,            // Frames per character
textDelay: 0,           // Initial delay

// Update method
update: function() {
    if(this.textDelay > 0) {
        this.textDelay -= ig.system.tick;
        return;
    }

    this.counterWord += ig.system.tick * 60;

    if(this.counterWord >= this.modWord) {
        this.counterWord = 0;
        this.currentWord++;

        // Display next character
        if(this.currentWord <= this.arrText.length) {
            this.displayedText = this.arrText.slice(0, this.currentWord).join('');
        }
    }
}
```

---

## Audio System

### Sound Handler

**File:** `lib/plugins/audio/sound-handler.js`

The sound handler wraps Howler.js for audio management.

**Architecture:**

```javascript
ig.SoundHandler = ig.Class.extend({
    bgmPlayer: null,           // Background music player
    sfxPlayer: null,           // Sound effects player
    soundInfo: null,           // Sound registry

    init: function() {
        Howler.autoSuspend = false;

        this.soundInfo = new SoundInfo();
        this.sfxPlayer = new HowlerPlayer(this.soundInfo.sfx);
        this.bgmPlayer = new HowlerPlayer(this.soundInfo.bgm);
        this.bgmPlayer.playerName = 'bgm';
    }
});
```

### Howler Player

**File:** `lib/plugins/audio/howler-player.js`

```javascript
HowlerPlayer = ig.Class.extend({
    soundList: {},          // Active Howl instances
    soundInfo: {},          // Sound metadata
    volume: 1,              // Volume 0-1
    muted: false,           // Mute state
    playerName: 'sfx',      // Player type

    // Add sound data
    addAudioData: function(soundData, soundName) {
        this.soundInfo[soundName] = soundData;
    },

    // Load sound
    loadSound: function(soundName) {
        var data = this.soundInfo[soundName];

        this.soundList[soundName] = new Howl({
            src: [data.path + '.mp3', data.path + '.ogg'],
            loop: data.loop || false,
            volume: this.volume
        });

        return this.soundList[soundName];
    },

    // Play sound
    play: function(soundName) {
        if(!this.soundList[soundName]) {
            this.loadSound(soundName);
        }

        this.soundList[soundName].play();
    },

    // Stop sound
    stop: function(soundName) {
        if(this.soundList[soundName]) {
            this.soundList[soundName].stop();
        }
    },

    // Set volume (0-12 scale)
    setVolume: function(level) {
        this.volume = level / 12;

        // Update all active sounds
        for(var name in this.soundList) {
            this.soundList[name].volume(this.volume);
        }
    },

    // Mute
    mute: function() {
        this.muted = true;
        for(var name in this.soundList) {
            this.soundList[name].mute(true);
        }
    },

    // Unmute
    unmute: function() {
        this.muted = false;
        for(var name in this.soundList) {
            this.soundList[name].mute(false);
        }
    }
});
```

### Sound Handler API

```javascript
// BGM control
ig.soundHandler.bgmPlayer.play("calm_morning");
ig.soundHandler.bgmPlayer.stop("calm_morning");
ig.soundHandler.bgmPlayer.setVolume(6);  // 0-12 scale

// SFX control
ig.soundHandler.sfxPlayer.play("phone_ring");
ig.soundHandler.sfxPlayer.stop("phone_ring");

// Mute all
ig.soundHandler.muteAll();
ig.soundHandler.unmuteAll();

// Pause/Resume (for page visibility)
ig.soundHandler.onSystemPause();
ig.soundHandler.onSystemResume();

// Unlock Web Audio (iOS fix)
ig.soundHandler.unlockWebAudio();
```

### Audio in Scenes

```javascript
// Scene with BGM
{
    "sceneID": 1,
    "charTalk": "none",
    "text": "",
    "bgm": {
        "name": "calm_morning",
        "fadeIn": 2,          // Fade in duration (seconds)
        "loop": true
    }
}

// Scene with SFX
{
    "sceneID": 5,
    "charTalk": "Amy",
    "text": "The phone is ringing!",
    "sfx": {
        "name": "phone_ring",
        "delay": 0.5,         // Delay before playing
        "loop": false
    }
}

// Stop BGM
{
    "sceneID": 10,
    "charTalk": "none",
    "text": "",
    "bgm": {
        "name": "default",    // Special: stop current BGM
        "fadeOut": 1
    }
}
```

---

## Save/Load System

### Storage Manager

**File:** `lib/plugins/io/storage-manager.js`

The storage manager uses encrypted localStorage for save data.

**Setup:**

```javascript
ig.Game.inject({
    setupStorageManager: function() {
        if(!this.io) {
            this.io = new IoManager();
        }

        this.storage = this.io.storage;
        this.storageName = this.hash(this.name + "-v" + this.version)
            .replace("-", "s");
        this.loadAll();
    }
});
```

### Encryption

**File:** `lib/plugins/secure-ls.js`

Uses SecureLS with AES encryption:

```javascript
ig.secure = new SecureLS({
    encodingType: 'aes',
    encryptionSecret: 'your-secret-key'
});
```

### Session Data Structure

```javascript
sessionData: {
    // Audio settings
    sfx: 1,                    // SFX volume (0-12)
    bgm: 1,                    // BGM volume (0-12)

    // Progress
    level: 1,
    score: 0,
    unlockChapter: 0,
    currentChapter: 0,
    currentSceneID: 0,

    // Currency
    virtualCurrency1: 0,
    virtualCurrency2: 0,
    virtualCurrency3: 0,

    // Variables
    gameVariables: {},         // Custom game variables
    characterAffection: {},    // Character relationship values
    choiceHistory: []          // Player choices
}
```

### Storage API

```javascript
// Initialize
ig.game.setupStorageManager();

// Load all data
ig.game.loadAll();

// Save all data
ig.game.saveAll();

// Load single key
var chapter = ig.game.load("currentChapter");

// Save single key
ig.game.save("currentChapter", 3);

// Reset all data
ig.game.resetStorageAll();

// Check if key exists
var hasData = ig.game.storageHas("currentChapter");
```

### Save/Load Flow

```
SAVE:
1. Player triggers save (button click)
   ↓
2. Update sessionData object
   ↓
3. Serialize to JSON
   ↓
4. Encrypt with AES
   ↓
5. Store in localStorage
   ↓
6. Show confirmation toast

LOAD:
1. Game initialization
   ↓
2. Read from localStorage
   ↓
3. Decrypt with AES
   ↓
4. Parse JSON
   ↓
5. Populate sessionData
   ↓
6. Restore game state
```

---

## Game Controllers

### Menu Controller

**File:** `lib/game/entities/controller/menu-controller.js`

Manages the main menu screen.

**Responsibilities:**
- Chapter selection
- Settings UI
- Shop access
- Language selection
- Play button

**Initialization:**

```javascript
EntityMenuController = ig.Entity.extend({
    init: function(x, y, settings) {
        this.parent(x, y, settings);

        // Load menu background
        this.bgMenu = ig.game.spawnEntity(EntityBackground, 0, 0, {
            placeName: _GAMESETTING._RESOURCESINFO.image.bgMenu
        });

        // Spawn play button
        this.btnPlay = ig.game.spawnEntity(EntityButtonPlay,
            ig.game.midX, ig.game.midY, {});

        // Spawn settings button
        this.btnSetting = ig.game.spawnEntity(EntityButtonSetting,
            50, 50, {});

        // Spawn language selector (if enabled)
        if(_GAMESETTING._DATAGAME.enableLanguage) {
            this.slButton = ig.game.spawnEntity(EntityButtonLanguage,
                ig.game.midX, 100, {});
        }

        // Spawn shop button (if enabled)
        if(_GAMESETTING._DATAGAME.enableShop) {
            this.btnShop = ig.game.spawnEntity(EntityButtonShop,
                ig.game.midX, ig.game.midY + 100, {});
        }

        // Spawn chapter UI
        this.uiChapter = ig.game.spawnEntity(EntityUIChapter,
            0, 0, {});
    }
});
```

### Game Controller

**File:** `lib/game/entities/controller/game-controller.js`

Manages game play and scene execution.

**Key Properties:**

```javascript
EntityGameController = ig.Entity.extend({
    numChapter: 1,              // Current chapter
    numChat: 0,                 // Current scene index

    arrChar: [],                // Character entities
    chatBubble: null,           // Active chat bubble

    text: '',                   // Current dialogue
    fullSentence: [],           // Parsed text
    currentWord: 0,             // Text progress

    isAutoScroll: false,        // Auto-advance
    isAnimChar: false,          // Character animating

    buttons: {},                // UI buttons
    entities: {}                // Scene entities
});
```

**Scene Execution:**

```javascript
executeScene: function(sceneID) {
    // Get scene object
    var scene = _LANG[currentLang]["Chapter" + this.numChapter][sceneID];

    // Update background
    if(scene.bg) {
        this.setBackground(scene.bg.name, scene.bg.pos);
    }

    // Update characters
    if(scene.char) {
        for(var i=0; i<scene.char.length; i++) {
            this.updateCharacter(scene.char[i]);
        }
    }

    // Spawn objects
    if(scene.object) {
        for(var i=0; i<scene.object.length; i++) {
            this.spawnObject(scene.object[i]);
        }
    }

    // Play BGM
    if(scene.bgm) {
        ig.soundHandler.bgmPlayer.play(scene.bgm.name);
    }

    // Play SFX
    if(scene.sfx) {
        ig.soundHandler.sfxPlayer.play(scene.sfx.name);
    }

    // Apply animation effects
    if(scene.animEffect) {
        this.applyAnimEffect(scene.animEffect);
    }

    // Display dialogue
    if(scene.text) {
        this.displayDialogue(scene.charTalk, scene.text);
    }

    // Show options (if any)
    if(scene.option) {
        this.showOptions(scene.option);
    }
}
```

### Preview Controller

**File:** `lib/game/entities/controller/preview-controller.js`

Character preview and dress-up system.

```javascript
EntityPreviewController = ig.Entity.extend({
    init: function(x, y, settings) {
        this.parent(x, y, settings);

        // Spawn background
        this.bgPreview = ig.game.spawnEntity(EntityBackground, 0, 0, {
            placeName: "office"
        });

        // Spawn girl character
        this.girlPreview = ig.game.spawnEntity(SpriterGirl, 0, 0, {
            charName: "amy",
            zIndex: 10
        });
        this.girlPreview.spriter.pos.x = ig.game.midX;
        this.girlPreview.spriter.pos.y = ig.game.midY + 500;

        // Spawn boy character
        this.boyPreview = ig.game.spawnEntity(SpriterBoy, 0, 0, {
            charName: "jack",
            zIndex: 10
        });
        this.boyPreview.spriter.pos.x = ig.game.midX;
        this.boyPreview.spriter.pos.y = ig.game.midY + 500;

        // Set animation
        this.girlPreview.changePose("ANIM_IDLE");
        this.boyPreview.changePose("ANIM_IDLE");
    }
});
```

---

## API Reference

### Global Objects

```javascript
// Game instance
ig.game                         // Current MyGame instance

// Core systems
ig.system                       // System manager
ig.input                        // Input manager
ig.soundManager                 // Impact sound manager (deprecated, use ig.soundHandler)
ig.music                        // Impact music manager (deprecated)

// Custom systems
ig.soundHandler                 // Custom sound handler (Howler.js)
ig.director                     // Level/scene director
ig.secure                       // Encrypted storage

// Configuration
_GAMESETTING                    // Game configuration
_DATAGAME                       // Game data
_STRINGS                        // UI strings
_LANG                           // Language translations
_CUSTOMLOAD                     // Asset manifest
_BASEPATH                       // Asset paths
```

### Game Methods

```javascript
// Entity management
ig.game.spawnEntity(EntityClass, x, y, settings)
ig.game.getEntityByName(name)
ig.game.getEntitiesByType(EntityClass)
ig.game.removeEntity(entity)
ig.game.sortEntities()

// Level management
ig.game.loadLevel(levelData)
ig.game.loadLevelDeferred(levelData)

// Storage
ig.game.save(key, value)
ig.game.load(key)
ig.game.saveAll()
ig.game.loadAll()
ig.game.resetStorageAll()

// Chat bubbles
ig.game.spawnChatBubble(parentEntity, configs)
```

### Director Methods

```javascript
// Level navigation
ig.director.loadLevel(index)
ig.director.nextLevel()
ig.director.previousLevel()
ig.director.jumpTo(levelObject)
ig.director.firstLevel()
ig.director.lastLevel()
ig.director.reloadLevel()

// Level management
ig.director.append(levelArray)
```

### Sound Handler Methods

```javascript
// BGM
ig.soundHandler.bgmPlayer.play(name)
ig.soundHandler.bgmPlayer.stop(name)
ig.soundHandler.bgmPlayer.setVolume(level)  // 0-12
ig.soundHandler.bgmPlayer.mute()
ig.soundHandler.bgmPlayer.unmute()

// SFX
ig.soundHandler.sfxPlayer.play(name)
ig.soundHandler.sfxPlayer.stop(name)
ig.soundHandler.sfxPlayer.setVolume(level)

// All audio
ig.soundHandler.muteAll()
ig.soundHandler.unmuteAll()
ig.soundHandler.onSystemPause()
ig.soundHandler.onSystemResume()
ig.soundHandler.unlockWebAudio()
```

### Character Methods

```javascript
// Animation
character.changePose(animName)
character.spriter.setAnimationByName(name)
character.spriter.setAnimationSpeed(percent)

// Appearance
character.changeDU(outfitName)

// Position
character.spriter.pos.x = x
character.spriter.pos.y = y
character.spriter.scale.x = scaleX
character.spriter.scale.y = scaleY

// Custom attachments
character.spriter.attachImage(bone, image, offsetX, offsetY, hide)
character.spriter.detachImage(bone)
```

---

## Extending the Engine

### Creating Custom Entities

```javascript
// File: lib/game/entities/custom/my-entity.js
ig.module('game.entities.custom.my-entity')
    .requires(
        'impact.entity'
    )
    .defines(function() {

        EntityMyEntity = ig.Entity.extend({
            size: {x: 64, y: 64},
            zIndex: 50,

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                console.log('MyEntity created at', x, y);
            },

            update: function() {
                this.parent();
                // Custom update logic
            },

            draw: function() {
                this.parent();
                // Custom drawing
            }
        });
    });
```

**Register in main.js:**

```javascript
ig.module('game.main')
    .requires(
        'impact.game',
        // ... other requires
        'game.entities.custom.my-entity'
    )
    .defines(function() {
        // Game code
    });
```

**Spawn in game:**

```javascript
var myEntity = ig.game.spawnEntity(EntityMyEntity, 100, 100, {
    customProperty: "value"
});
```

### Creating Custom Plugins

```javascript
// File: lib/plugins/my-custom-plugin.js
ig.module('plugins.my-custom-plugin')
    .requires(
        'impact.game'
    )
    .defines(function() {

        // Extend ig.Game
        ig.Game.inject({
            myPluginInit: function() {
                console.log('Plugin initialized');
                this.myPluginData = {};
            },

            init: function() {
                this.parent();
                this.myPluginInit();
            },

            myCustomMethod: function(param) {
                // Your logic
                return param * 2;
            }
        });

        // Extend ig.Entity
        ig.Entity.inject({
            myEntityProperty: null,

            init: function(x, y, settings) {
                this.parent(x, y, settings);
                this.myEntityProperty = settings.myEntityProperty || null;
            }
        });
    });
```

### Adding Custom Scene Commands

To add custom scene object properties that the engine processes:

**1. Extend GameController:**

```javascript
// In game-controller.js or custom plugin
EntityGameController.inject({
    executeScene: function(sceneID) {
        var scene = this.getCurrentScene(sceneID);

        // Process your custom property
        if(scene.myCustomProperty) {
            this.handleMyCustomProperty(scene.myCustomProperty);
        }

        this.parent(sceneID);
    },

    handleMyCustomProperty: function(data) {
        // Your custom logic
        console.log('Custom property:', data);
    }
});
```

**2. Use in scene objects:**

```javascript
{
    "sceneID": 10,
    "charTalk": "Amy",
    "text": "Hello!",
    "myCustomProperty": {
        "value": "custom data"
    }
}
```

---

**End of Engine Documentation**
