# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Visual Novel Engine** framework built on top of ImpactJS game engine. It provides a complete system for creating interactive visual novels with characters, dialog, choices, animations, save/load functionality, and multi-language support.

**Current Version**: Framework 2.0.2 (see `readme.txt` for detailed patch history)

## Core Architecture

### Engine Foundation: ImpactJS Module System

The codebase uses ImpactJS's module dependency system (`ig.module().requires().defines()`). All modules are defined in the `lib/` directory and follow this pattern:

```javascript
ig.module('game.entities.object.char')
.requires('impact.entity', 'plugins.spriter.spriter')
.defines(function() {
    EntityChar = ig.Entity.extend({...});
});
```

### Three-Tier Architecture

1. **ImpactJS Core** (`lib/impact/`): Game engine fundamentals (entity system, input, rendering, collision, animation)
2. **Plugin Layer** (`lib/plugins/`): Reusable framework components
3. **Game Layer** (`lib/game/`): Visual novel-specific implementation

### Key Architectural Components

#### Main Game Controller (`lib/game/main.js`)
- Entry point that initializes the entire game
- Manages global state: session data, window management, chapter progression
- Handles save/load via localStorage using `_GAMESETTING._LOCALSTORAGE_KEY`
- Controls volume, language, fullscreen, and game settings

#### Game Controller (`lib/game/entities/controller/game-controller.js`)
- Core visual novel orchestrator - manages the entire story flow
- Processes chapter scripts (dialogs, animations, character positioning, choices)
- Controls character entities (walk in/out, emotions, animations, outfit changes)
- Manages dialog bubbles, backgrounds, particle effects, overlay objects
- Handles user input for advancing dialogs and making choices
- **Critical**: This is the heart of the VN engine - most story-related features connect here

#### Data Configuration (`lib/game/entities/game-setting/datagame.js`)
- Centralized configuration for UI themes, z-index layers, character outfits (spriterData)
- Defines available backgrounds, animations, emotions, handheld objects
- Contains mappings for character types: neutral_boy, neutral_girl, dynamic_name
- **Important**: Character outfit definitions here must match Spriter SCML files

#### Settings (`settings.js`)
- Game-specific configuration loaded at runtime
- Defines base paths for assets (text, voiceover, thumbnails, avatars)
- Configures chapters, UI themes, dialog styles, virtual currency
- Contains character sprite data (spriterData) with skin/face/hair/outfit combinations
- Loads translation scripts for all chapters and languages

### Plugin System Architecture

**Spriter Integration** (`lib/plugins/spriter/`):
- Full skeletal animation system for characters
- Bone hierarchy, timeline interpolation, animation blending
- Character customization via part swapping (skin, hair, clothes, accessories)
- Character entities: `EntityBoy` and `EntityGirl` use this extensively

**Chat Bubble System** (`lib/plugins/chat-bubble/`):
- Factory pattern for dialog rendering (text, bubble, avatar)
- Supports multiple bubble types: default, think, none
- Text effects, word wrapping, multi-language font handling
- Position anchoring relative to characters

**Audio System** (`lib/plugins/audio/`):
- Howler.js-based sound manager
- Separate BGM and SFX channels with volume control
- Voice-over support with delay parameters
- Sound info registry in `sound-info.js`

**Save/Load System** (`lib/plugins/io/`):
- Web storage abstraction (localStorage/sessionStorage)
- Encrypted storage option via `secure-ls.js`
- Auto-save and manual save slots
- Stores: chapter progress, choices, character states, settings

**Freeze Frame** (`lib/plugins/freezeframe/`):
- Captures game state as static images
- Used for save thumbnails and flashback sequences
- Multiple freeze frame implementations for different use cases

**Multi-Language** (`lib/plugins/multilang.js`):
- Runtime language switching
- Font handling per language (iOS-specific fonts, CJK support)
- Text files loaded dynamically from `translate/` directory

### Entity Structure

**Entity Hierarchy** (`lib/game/entities/`):
- `buttons/`: All UI buttons (save, load, skip, auto, settings, options, etc.)
- `controller/`: Game controller, menu controller, preview controller
- `object/`: Characters (boy/girl), backgrounds, UI panels (shop, log, saveload, chapter selection), special objects (phone, email, letter, flashback)
- `particle/`: Visual effects (snow, rain, fireworks, dust, blood, etc.)
- `topoverlay/`: Camera effects (vignette, window boxing)

**Character System**:
- Characters are Spriter-based entities with bone animations
- Support 100+ animations (idle, walk, talk, emotions, actions)
- Customizable via outfit parts: skin, face, hair, top, bottom, shoes, accessories
- Emotion system: eye animations, expressions (happy, sad, angry, etc.)
- Handheld objects dynamically attached to hands

### Story Script Format

Scripts are stored in `media/text/translate/` as JavaScript files defining dialog arrays. Each dialog entry can contain:
- `speaker`: Character identifier
- `dialog`: Text content (supports formatting: `{b}`, `{i}`, `{color}`)
- `animChar`: Character animations and positioning
- `animEffect`: Scene effects (transitions, zoom/pan, particles)
- `bgm`: Background music changes
- `sfx`: Sound effects
- `option`: Player choices (branching narrative)
- `goTo`: Jump to different dialog IDs
- Conditional logic based on variables, currency, choices

**Example Dialog Structure**:
```javascript
{
  speaker: "amy",
  dialog: "Hello! {b}How are you?{/b}",
  animChar: [{ name: "amy", anim: "ANIM_WAVE" }],
  bgm: "bgm-happy",
  sfx: "laugh_girl"
}
```

## Development Workflow

### Building the Engine

**Development Build** (unminified):
```bash
# Build engine.js from lib/ directory
./push.sh
```

**Production Build** (minified + obfuscated):
```bash
./push-production.sh
```

### Build Process Details

The build scripts (`push.sh`, `push-production.sh`) perform:
1. **ImpactJS compilation**: Combines all `ig.module()` files into `engine.js`
2. **CSS processing**: Concatenates and minifies CSS via `css-minify.sh`
3. **JavaScript minification**: Uses Google Closure Compiler (`compiler.jar`)
4. **Obfuscation** (production only): Uses `javascript-obfuscator` with config from `tools/`
5. **Versioning**: Python scripts update version numbers
6. **Asset upload**: S3 upload via boto3 scripts (if configured)
7. **CloudFront invalidation**: Cache clearing for CDN

### Running Locally

1. Open `index.html` in a browser (requires local web server for asset loading)
2. Alternatively use `dev.html` for development with specific configurations
3. Enable URL parameters in `settings.js` (`enableURLParam: true`) for testing:
   - `?chapter=2` - Load specific chapter
   - `?openAllChapter=1` - Unlock all chapters
   - `?directLoadChapter=2` - Skip splash and load chapter directly

### Asset Management

**Asset Organization**:
- `media/graphics/`: UI elements, sprites, backgrounds, particles
- `media/text/`: Story scripts and translations
- `media/audio/`: BGM, SFX, voiceovers
- `media/fonts/`: Font files for different languages

**External Assets** (referenced via `_BASEPATH` in `datagame.js`):
- Character sprites: `../v2-visual-novel-assets/graphics/characters/`
- Backgrounds: `../v2-visual-novel-assets/graphics/backgrounds/`
- Common UI: `../v2-visual-novel-assets/graphics/ui/theme/`
- Audio: `../v2-visual-novel-assets/audio/`

**Important**: The engine expects assets in `../v2-visual-novel-assets/` directory at the same level as the engine folder.

### Spriter Character Workflow

1. Edit character SCML files in `v2-visual-novel-assets/graphics/characters/boy/` or `girl/`
2. Update outfit definitions in `settings.js` under `spriterData`
3. Add new animations to character animation lists in `datagame.js`
4. Reference in story scripts via `animChar` commands

### Adding New Content

**New Character**:
1. Define outfit in `settings.js` → `spriterData`
2. Classify as neutral_boy/neutral_girl/dynamic_name
3. Create translation entries in `translate/dynamic_character.en.js`

**New Animation**:
1. Add to Spriter SCML file (boy.scml / girl.scml)
2. Register in `datagame.js` animation list
3. Reference by constant name (e.g., `ANIM_WAVE`) in scripts

**New Chapter**:
1. Create `translate/chapterX.en.js` with dialog array
2. Add chapter entry to `translate/chapter_list.en.js`
3. Update `totalChapter` in `settings.js`
4. Add chapter loading in `_LOADSCRIPTS` array

**New UI Theme**:
1. Add theme assets to `v2-visual-novel-assets/graphics/ui/theme/[themename]/`
2. Define theme colors/properties in `datagame.js` → `themeColor`
3. Set in `settings.js` → `uiTheme`

### Testing & Debugging

**Enable Debug Mode**:
- Set `enableConsoleLog: true` in `settings.js` → `_DATAGAME`
- Set `enableURLParam: true` for URL testing parameters

**Console Logging**:
- Game controller logs dialog progression with chat IDs
- Character animation states logged when debug enabled
- Save/load operations logged to console

**Common Issues**:
- **Missing assets**: Check `_BASEPATH` configurations match directory structure
- **Character not showing**: Verify spriterData matches SCML file structure
- **Dialog not advancing**: Check for script errors in browser console
- **Save/load broken**: Clear localStorage and check `_LOCALSTORAGE_KEY`

## File Modification Guidelines

### When Editing Game Controller (`game-controller.js`)
- This file is 2000+ lines - understand the dialog state machine before modifying
- Key methods: `processDialog()`, `updateCharacters()`, `handleInput()`
- Changes here affect ALL story playback

### When Editing Settings (`settings.js`)
- This is the main configuration file loaded at runtime
- Changes require page refresh (no hot reload)
- Character spriterData must be valid JSON
- Base paths must match actual directory structure

### When Editing Data Game (`datagame.js`)
- Central registry for animations, objects, backgrounds, themes
- Adding entries here makes them available to scripts
- Z-index values control rendering order (higher = on top)

### When Adding Plugins
- Follow ImpactJS module pattern
- Add to `lib/plugins/`
- Require in `main.js` dependencies
- Register globally if needed for game entities

## Important Constants & Conventions

**Resolution**: Base resolution is 1080x1920 (portrait mode)
- Scaling handled by responsive plugin
- UI coordinates use `_DATAGAME.ratioRes` multiplier

**Z-Index Layers** (defined in `datagame.js`):
- Background: 0-399
- Characters: 499-500
- Dialog/UI: 1000-2000
- Overlays: 9000+
- Debug/Top: 10000+

**Character Naming**:
- Use lowercase in code: "amy", "jack", "carl"
- Display names from translation files
- Dynamic names replaced at runtime (e.g., {MC})

**Animation Constants**:
- Prefix: `ANIM_` (e.g., `ANIM_IDLE`, `ANIM_WAVE`)
- Defined in `datagame.js` animation arrays
- Must match Spriter animation names exactly

**Emotion Constants**:
- Prefix: `EMO_` (e.g., `EMO_HAPPY`, `EMO_SAD`)
- Control facial expressions
- Some have eye animations

## Version History Notes

The `readme.txt` contains detailed patch notes from version 1.0.0 to 2.0.0 (Patch 44). Key version milestones:
- **2.0.0**: Major framework restructure, character customization system
- **Patch 28+**: Accessory system (anklet, bracelet, necklace)
- **Patch 30+**: Mini-buttons, dialog customization
- **Patch 36+**: Window boxing, freeze frame enhancements
- **Recent**: New animations, backgrounds, UI themes

Always check patch notes when troubleshooting - many features were added incrementally.

## Common Patterns

**Tween Animations** (via `lib/plugins/tween.js`):
- Character walk in/out uses tweens for smooth movement
- Dialog fade effects
- Background zoom/pan
- All tweens respect pause state

**Event Chain** (`lib/plugins/event-chain.js`):
- Sequential action execution
- Used for complex animation sequences
- Ensures proper timing between dialog/animation/effects

**Factory Pattern**:
- Chat bubbles created via factory
- UI panels instantiated on demand
- Promotes reusability and consistency

## External Dependencies

- **ImpactJS**: Core game engine (proprietary, included)
- **jQuery 3.2.1**: DOM manipulation, script loading
- **Howler.js**: Audio playback
- **Spriter**: Skeletal animation format
- **Google Closure Compiler**: Build minification
- **javascript-obfuscator**: Production code obfuscation

## Asset Paths Reference

When referencing assets in code:
- Images: `_BASEPATH.image + 'filename.png'`
- Backgrounds: `_BASEPATH.background + 'bg_name.jpg'`
- UI: `_BASEPATH.ui + themeName + '/button.png'`
- Sounds: `_BASEPATH.sfx + 'sound.mp3'` or `.ogg`
- BGM: `_BASEPATH.bgm + 'music.mp3'` or `.ogg`
- Scripts: `_GAMESETTING._BASEPATH.text + 'translate/chapter1.en.js'`

## Performance Considerations

- Character sprites use bone-based animation (memory efficient)
- Image atlas/packing via packer plugin reduces HTTP requests
- Audio preloading defined in `sound-info.js`
- Lazy loading for chapter scripts (loaded on demand)
- Entity pooling for particles and effects

## Security Features

- Domain lock injection available (`inject_domainlock.py`)
- Frame breaker protection (`inject_framebreaker.py`)
- Encrypted local storage option (`secure-ls.js`)
- Code obfuscation in production builds
