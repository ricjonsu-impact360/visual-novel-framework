# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a visual novel script editor and converter system that processes script files from a custom format into JSON-based language files for a visual novel engine. The project includes tools for script conversion, character management, translation workflows, and a Sublime Text plugin for script authoring.

## Core Architecture

### Script Processing Pipeline

The system follows a two-stage processing model:

1. **Script Conversion** (`script-converter/script-editor.js`): Converts raw script files (`.en.js`) from `media/text/scripts/` into structured JSON format stored in `media/text/translate/`
2. **Settings Integration** (`script-converter/script-export.js`): Generates `customload.js` and updates `lib/settings.js` with character sprite data

Key file: `script-converter/script-editor.js` (v1.0.65) - This 30,000+ line file contains the core `convertFiles` object that parses script syntax and converts it to JSON scene data.

### Script Format

Scripts use a custom domain-specific language with commands like:
- Character display: `ANIM`, `BACKGROUND`, `SFX`, `BGM`
- Dialog and scene control commands
- Text formatting with `|format|` syntax
- Dynamic character references with `{character_name}` syntax

The Sublime Text plugin (`code-completion-plugin/script-completion.py`) provides autocomplete for these commands but only works on files with `.en.js` extension.

### Character Data System

Character sprite data is managed through:
- `script-converter/characters-data.js`: Empty by default; populated by character preview tool
- `character-preview.html`: Visual tool for configuring character outfits/sprites
- Data flows into `lib/settings.js` between `//CODE_GENERATED` and `//END_GENERATED` markers

**Critical**: The `//CODE_GENERATED` markers in `lib/settings.js` must never be removed - the system uses these to inject sprite data.

### Translation Workflow

Two translation systems exist:

1. **LMStudio-based** (`chatgpt-translate.js`): Uses local LLM via @lmstudio/sdk
   - Preserves text formatting (`|format|`) by replacing with `@2` placeholders
   - Preserves character names by replacing with `*&index&*` placeholders
   - Preserves dynamic character references in `{curly braces}`
   - Processes in batches of 1 scene at a time

2. **Export-based** (`translate-export.js`): Pre-translated data export (hardcoded Chinese translations)

Translation targets are configured in the translation scripts via `arrLanguage` and `arrLanguageCode` arrays.

## Common Commands

### Script Conversion

```bash
# Convert all scripts to JSON format
cd script-converter
node convert-script.sh -b

# Alternative: Process via Node.js directly
node script-editor.js "processScript" ../media/text/scripts/ ../media/text/translate/ ../media/text/
```

### Translation

```bash
# Translate all files using LMStudio
cd script-converter
node translate.sh -a

# Translate specific file
node translate.sh -t chapter1.en.js
```

### Character Data Management

1. Open `character-preview.html` in browser
2. Configure character sprites visually
3. System updates `lib/settings.js` automatically

### Web-based Script Export

For browser-based workflows:
1. Open `script-converter/script-editor.html`
2. Requires PHP backend (`script-editor.php`) for file operations
3. Exports all scripts or individual chapters

## Development Notes

### File Organization

- `script-converter/`: Main processing scripts and web-based editor
- `code-completion-plugin/`: Sublime Text 3 plugin for script authoring
- `media/text/scripts/`: Source script files (`chapter*.en.js`)
- `media/text/translate/`: Converted JSON output files
- `lib/settings.js`: Game settings with generated sprite data

### Script Version Management

The script editor version is tracked at line 1 of `script-editor.js`. Current version: 1.0.65

### Node.js vs Browser Environments

`script-editor.js` and `script-export.js` run in both Node.js (for CLI conversion) and browser (for web UI). They detect environment via `typeof(window)` checks.

### Dependencies

Required npm packages:
- `@lmstudio/sdk`: Local LLM integration for translation
- `@vitalets/google-translate-api`: Google Translate API wrapper
- `translatte`: Alternative translation library

### Translation Preservation Logic

When translating, the system:
1. Extracts text formatting markers (`|color|`, `|big|`, etc.) and replaces with `@2`
2. Extracts character names from settings and replaces with indexed placeholders
3. Sends sanitized text to LLM
4. Restores original formatting and names in translated output

This prevents LLMs from translating UI formatting codes or character names.

### Critical Path Dependencies

The conversion process requires:
1. `lib/settings.js` with `_ENGINE_VERSION` and `_GAMESETTING` variables
2. `characters-data.js` for sprite data (can be empty object)
3. Script files following naming convention: `chapter*.en.js` or similar

### Shell Scripts

- `push.sh`: Git workflow automation
- `update-script-editor.sh`: Updates script editor components
- `update-vsix.sh`: Updates VSCode extension (if applicable)

## Testing

No formal test suite exists. Test workflows by:
1. Processing a single chapter script
2. Verifying JSON output in `media/text/translate/`
3. Checking `customload.js` for proper scene data
4. Validating `lib/settings.js` contains sprite data between markers
