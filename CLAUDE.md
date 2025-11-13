# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Visual Novel Framework** consisting of three integrated components for creating browser-based visual novel games. The framework uses ImpactJS as the core engine, a custom Domain-Specific Language (DSL) for writing stories, and a compilation pipeline for converting human-readable scripts into optimized game data.

**Framework Version**: 2.0.0

## Repository Structure

This repository contains three main directories, each serving a distinct purpose:

```
_claude-vn-framework/
├── visual-novel-engine/        # Core runtime engine (~20MB)
├── visual-novel-script-editor/ # Script compilation tools (~297KB)
├── first-world-problems/       # Example game project (~25MB)
└── docs/                       # Comprehensive documentation
```

### Component Relationships

- **visual-novel-engine/**: The reusable game engine that renders visual novels in a browser. Contains ImpactJS framework + 114 plugin files.
- **visual-novel-script-editor/**: Development tools for converting `.vnscript` human-readable scripts into compiled JavaScript chapter files.
- **first-world-problems/**: A complete game project demonstrating how to use the engine. Game projects reference engine files via relative paths.

Each component has its own `CLAUDE.md` with component-specific details. Consult those for deep implementation work.

## Key Commands

### Engine Development (visual-novel-engine/)

```bash
cd visual-novel-engine

# Build engine from source (development, unminified)
./push.sh

# Build for production (minified + obfuscated)
./push-production.sh
```

**Note**: The engine contains extensive build scripts for production deployment including S3 upload, CloudFront invalidation, and domain locking. Most development work won't require rebuilding the engine.

### Script Editor Tools (visual-novel-script-editor/)

```bash
cd visual-novel-script-editor/script-converter

# Convert all vnscript files to JavaScript
bash convert-script.sh -b
# Or: node script-editor.js processScript ../media/text/scripts/ ../media/text/translate/ ../media/text/

# Translate scripts using LMStudio AI
bash translate.sh -a                    # Translate all chapters
bash translate.sh -t chapter1.en.js     # Translate specific chapter
```

### Game Project Development (first-world-problems/)

```bash
cd first-world-problems

# Convert story scripts to JavaScript
cd script-converter && bash convert-script.sh -b && cd ..

# Build final game script (compile + obfuscate)
bash build_script.sh

# Copy assets from shared asset library
python copy_assets.py
# or: bash copy_assets.sh

# Full workflow after editing chapters:
cd script-converter && bash convert-script.sh -b && cd .. && bash build_script.sh
```

**Testing**:
- Open `dev.html` in browser for development mode with console logging
- Use URL parameters: `dev.html?chapter=2&scene=10&debug=1`
- Open `character-preview.html` to visually edit character outfits

## Architecture Overview

### Three-Tier System

1. **ImpactJS Core** (`visual-novel-engine/lib/impact/`): Base game engine providing entity system, rendering, input, and game loop
2. **Plugin Layer** (`visual-novel-engine/lib/plugins/`): 114 plugins providing VN-specific features (Spriter animation, chat bubbles, audio, save/load, etc.)
3. **Game Layer** (`visual-novel-engine/lib/game/`): Visual novel implementation including game controller, UI entities, and scene management

### Script Processing Pipeline

```
Story Writer creates .vnscript file
        ↓
Script Editor parses DSL commands
        ↓
Generates .en.js JavaScript scene arrays
        ↓
customload.js manifest updated with asset list
        ↓
Game Engine loads and executes scenes at runtime
```

### Key Technologies

- **ImpactJS**: 2D game engine with module/class system (`ig.module().requires().defines()`)
- **Spriter**: Skeletal animation for customizable characters (13 parts: skin, face, hair, top, bottom, shoes, accessories)
- **Howler.js**: Cross-browser audio playback
- **jQuery 3.2.1**: DOM manipulation and script loading
- **Node.js**: Script compilation tools
- **Google Closure Compiler**: JavaScript minification
- **javascript-obfuscator**: Code obfuscation for production

## Critical Files Across Components

### Configuration Files

**Engine Configuration** (`visual-novel-engine/settings.js`):
- Base paths for assets, audio, backgrounds
- Character sprite definitions (spriterData)
- UI themes and color schemes
- Animation/emotion constants

**Game Configuration** (`first-world-problems/lib/settings.js`):
- Game-specific character outfits
- Chapter count and game behavior settings
- Storage keys and UI preferences
- Inherits structure from engine template

**Asset Manifest** (`first-world-problems/media/text/customload.js`):
- Auto-generated list of assets per chapter
- Backgrounds, characters, objects, SFX, BGM
- Used by asset loader for preloading

### Story Script Format

Scripts use a custom DSL with line-based commands:

```vnscript
BACKGROUND. office_interior center
BGM. calm_music fadeIn 2
CHARACTERS. @Amy position center anim ANIM_IDLE
@Amy emo EMO_HAPPY "Good morning!"
CHOICE. Help { REWARD. karma 10 } { JUMPTO. help_scene } ; Ignore { JUMPTO. ignore_scene }
```

**Key Commands**:
- `BACKGROUND.` - Set scene background
- `CHARACTERS.` - Position and animate characters
- `BGM.`, `SFX.` - Audio control
- `@CharacterName` - Dialogue line
- `CHOICE.` - Player choices with branching
- `SETCHAR.` - Update character animation/emotion
- `ANIMEFFECT.` - Screen transitions
- `WALK_IN.`, `WALK_OUT.` - Character movement
- `OBJECT.` - Place props in scene
- `SET_INTEGER.`, `CHECK_INTEGER.` - Variables and conditionals
- `JUMPTO.` - Scene branching

### Core Engine Files

**Game Controller** (`visual-novel-engine/lib/game/entities/controller/game-controller.js` - 2000+ lines):
- Orchestrates entire story flow
- Processes scene objects (dialog, animations, effects)
- Manages character entities and UI elements
- Handles user input and save/load
- **Critical**: Most VN features connect through this file

**Main Entry Point** (`visual-novel-engine/lib/game/main.js`):
- Initializes game and loads configuration
- Manages global session data and window state
- Controls volume, language, fullscreen

**Data Configuration** (`visual-novel-engine/lib/game/entities/game-setting/datagame.js`):
- Centralized registry of animations, backgrounds, emotions
- Z-index layer definitions
- Character type classifications (neutral_boy, neutral_girl, dynamic_name)

## Development Workflows

### Adding a New Chapter to a Game

1. Create `media/text/scripts/chapterN.en.vnscript`
2. Write story using DSL commands
3. Run `cd script-converter && bash convert-script.sh -b`
4. Update `totalChapter` in `lib/settings.js`
5. Ensure assets exist (backgrounds, audio, etc.)
6. Run `bash build_script.sh` to compile
7. Test with `dev.html?chapter=N`

### Modifying Character Outfits

1. Open `character-preview.html` in browser
2. Select character and adjust outfit parts using UI
3. Export updates to `lib/settings.js` (spriterData section)
4. Character sprites must exist in `media/graphics/sprites/{character}/`
5. Ensure all 13 parts defined (skin, face, hair, top, bottom, shoes, glasses, earrings, hat, beard, anklet, bracelet, necklace)

### Creating a New Game Project

1. Copy `first-world-problems/` as template
2. Update `lib/settings.js` with game-specific config
3. Create story scripts in `media/text/scripts/`
4. Replace assets in `media/` directories
5. Update `customload.js` with asset lists
6. Compile scripts and test

### Translating Content

Scripts can be automatically translated using LMStudio-based AI:

```bash
cd script-converter
node chatgpt-translate.js chapter1 es  # Translate to Spanish
```

The system preserves:
- Text formatting markers (`|color|`, `|big|`, etc.)
- Character names (replaced with placeholders during translation)
- Dynamic character references in `{curly braces}`

### Testing and Debugging

**Development Mode**:
- Use `dev.html` with `enableConsoleLog: true` in settings
- URL parameters: `?chapter=2&scene=10&debug=1&openAllChapter=1`
- Browser console shows scene progression and chat IDs

**Common Debug Commands** (browser console):
```javascript
ig.game.numChat = 20;           // Jump to scene
console.log(ig.game.sessionData); // Check game state
console.log(_LANG["en"]["Chapter1"]); // View chapter data
```

## Important Development Notes

### Asset Path Configuration

All asset paths configured in `_BASEPATH` (settings.js):
- Images: `_BASEPATH.image + 'filename.png'`
- Backgrounds: `_BASEPATH.background + 'bg_name.jpg'`
- Audio: `_BASEPATH.sfx + 'sound.mp3'`

The engine expects a shared asset library at `../v2-visual-novel-assets/` containing common resources.

### Code Markers and Generated Sections

**CRITICAL**: In `lib/settings.js`, the following markers must NEVER be removed:
```javascript
//CODE_GENERATED
// Character sprite data injected here by character-preview.html
//END_GENERATED
```

The character preview tool uses these markers to inject spriterData. Removing them breaks character management.

### Engine Module System

All engine code uses ImpactJS's module pattern:
```javascript
ig.module('game.entities.controller.game-controller')
.requires('impact.entity', 'plugins.spriter.spriter')
.defines(function() {
    GameController = ig.Entity.extend({
        // Implementation
    });
});
```

When modifying engine code, maintain this pattern and declare all dependencies in `.requires()`.

### Resolution and Scaling

- Base resolution: 1080x1920 (portrait mode)
- Responsive plugin handles scaling to different devices
- UI coordinates use `_DATAGAME.ratioRes` multiplier
- Z-index layers defined in datagame.js (background: 0-399, characters: 499-500, UI: 1000+)

### Save/Load System

- Uses browser localStorage with key from `_LOCALSTORAGE_KEY`
- Optional encryption via `secure-ls.js`
- Stores: chapter progress, choices, character states, settings
- Auto-save and manual save slot support

## Documentation Structure

Comprehensive documentation in `docs/`:
- **ARCHITECTURE_OVERVIEW.md**: Complete system architecture, data flow, technology stack
- **ENGINE_DOCUMENTATION.md**: Engine internals and API reference (46KB)
- **SCRIPT_EDITOR_DOCUMENTATION.md**: Script writing guide and DSL reference (30KB)
- **PROJECT_SETUP_GUIDE.md**: Step-by-step game creation guide (32KB)
- **CHAPTER_FILE_SCHEMA.md**: Scene object schema and examples (46KB)

Consult these for detailed implementation guidance.

## Common Pitfalls

1. **Editing obfuscated files**: Always edit source files (`lib/settings.js`, `.vnscript` files), not generated/obfuscated files (`settings.js`, `script.js`)
2. **Missing asset references**: Scripts reference assets by name; ensure files exist in `media/` directories and are listed in `customload.js`
3. **Character sprite mismatch**: Character outfit definitions in settings must match actual Spriter SCML file structure
4. **Build order**: After editing `.vnscript` files, must run script converter BEFORE build script
5. **Path references**: Game projects reference engine via relative paths; breaking directory structure breaks games
6. **Module dependencies**: When adding engine features, declare all dependencies in `ig.module().requires()` chain

## Version Management

- Engine Version: Check `readme.txt` for patch notes (currently 2.0.0, Patch 44)
- Script Editor Version: Line 1 of `script-editor.js` (currently 1.0.65)
- Game Version: `_VERSION` object in game's `settings.js`

## Security Features

Production builds include:
- JavaScript obfuscation via javascript-obfuscator
- Domain lock injection (optional)
- Frame breaker protection
- Encrypted localStorage for saves
- Copyright and protection injection scripts

## Asset Organization Best Practices

**Image Formats**:
- Backgrounds: JPG (1920x1080, <500KB optimized)
- Objects/Sprites: PNG with transparency
- UI elements: PNG

**Audio Formats**:
- BGM: MP3 (128-192kbps, 1-3 min loopable)
- SFX: MP3 (96kbps, 0.5-3 sec)
- Voiceover: MP3 (128kbps)

## Multi-Language Support

The framework has built-in support for 9+ languages:
- English (en), Spanish (es), German (de), Chinese (cn/zh)
- Japanese (jp), Korean (kr), Russian (ru), Dutch (nl)

Language switching handled via `_LANG` object and runtime language selector in UI.

## Getting Started Checklist

For new developers:
1. Read `docs/ARCHITECTURE_OVERVIEW.md` for big picture
2. Examine `first-world-problems/` as reference implementation
3. Review script examples in `first-world-problems/media/text/scripts/`
4. Test workflow: edit `.vnscript` → compile → view in browser
5. Open `character-preview.html` to understand character system
6. Check browser console for debug output during testing

## Additional Context

- The engine is based on ImpactJS but heavily extended with visual novel-specific features
- Character animation uses Spriter's bone-based system for memory-efficient customization
- The DSL is designed for writers, not programmers - simple line-based syntax
- Build process is optimized for web deployment with CDN support (S3 + CloudFront)
- Framework supports virtual currency, shop systems, and achievement tracking
- Branching narratives with variable tracking and conditional scene flow built-in
