/**
 * VNScript Validator
 *
 * Standalone validation module for .vnscript files
 * Provides enhanced error detection, type checking, and helpful suggestions
 *
 * Version: 1.0.0
 * Date: 2025-11-08
 */

const fs = require('fs');
const path = require('path');

class VNScriptValidator {
    constructor(options = {}) {
        this.errors = [];
        this.warnings = [];
        this.info = [];
        this.currentFile = null;
        this.currentLine = 0;

        // Configuration
        this.options = {
            checkAssets: options.checkAssets !== false, // Default true
            checkReferences: options.checkReferences !== false,
            strictMode: options.strictMode || false,
            assetPaths: options.assetPaths || this.getDefaultAssetPaths(),
            ...options
        };

        // Validation rules
        this.commandRules = this.initializeCommandRules();
        this.propertyRules = this.initializePropertyRules();

        // Tracking
        this.definedBranches = new Set();
        this.referencedBranches = new Set();
        this.definedVariables = new Set();
        this.referencedVariables = new Set();
        this.definedCharacters = new Set();
        this.usedAssets = {
            backgrounds: new Set(),
            characters: new Set(),
            objects: new Set(),
            sfx: new Set(),
            bgm: new Set()
        };
    }

    getDefaultAssetPaths() {
        return {
            backgrounds: '../media/graphics/backgrounds/',
            characters: '../media/graphics/sprites/',
            objects: '../media/graphics/objects/',
            sfx: '../media/audio/',
            bgm: '../media/audio/'
        };
    }

    /**
     * Main validation entry point
     */
    validateFile(filePath) {
        this.currentFile = filePath;
        this.errors = [];
        this.warnings = [];
        this.info = [];

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n');

            // First pass: collect definitions
            this.firstPass(lines);

            // Second pass: validate usage
            this.secondPass(lines);

            // Final checks
            this.validateReferences();

            return this.getReport();
        } catch (error) {
            this.addError('file_error', 0, `Failed to read file: ${error.message}`);
            return this.getReport();
        }
    }

    /**
     * First pass: collect branch definitions, variable definitions
     */
    firstPass(lines) {
        let inChoice = false;

        lines.forEach((line, index) => {
            this.currentLine = index;
            const trimmed = line.trim();

            // Skip comments
            if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
                return;
            }

            // Collect branch definitions
            if (trimmed.startsWith('CONTINUE.')) {
                const parts = trimmed.split(/\s+/);
                if (parts.length >= 2) {
                    this.definedBranches.add(parts[1]);
                }
            }

            // Collect variable definitions
            if (trimmed.startsWith('SET_BOOLEAN.') || trimmed.startsWith('SET_INTEGER.')) {
                const parts = trimmed.split(/\s+/);
                if (parts.length >= 2) {
                    this.definedVariables.add(parts[1]);
                }
            }

            // Track character definitions
            if (trimmed.startsWith('CHARACTERS.') || trimmed.includes('@')) {
                const charMatch = trimmed.match(/@(\w+)/g);
                if (charMatch) {
                    charMatch.forEach(match => {
                        const charName = match.substring(1).toLowerCase();
                        if (charName !== 'none') {
                            this.definedCharacters.add(this.capitalizeFirstLetter(charName));
                        }
                    });
                }
            }
        });
    }

    /**
     * Second pass: validate each line
     */
    secondPass(lines) {
        let inChoice = false;
        let inComment = false;
        let braceDepth = 0;

        lines.forEach((line, index) => {
            this.currentLine = index;
            const trimmed = line.trim();

            // Handle multi-line comments
            if (trimmed.startsWith('/*')) inComment = true;
            if (trimmed.includes('*/')) {
                inComment = false;
                return;
            }
            if (inComment) return;

            // Skip single-line comments
            if (trimmed.startsWith('//')) return;

            // Skip empty lines
            if (trimmed === '') return;

            // Track choice blocks
            if (trimmed.startsWith('CHOICE.')) {
                inChoice = true;
            }
            if (trimmed === '{') braceDepth++;
            if (trimmed === '}') {
                braceDepth--;
                if (braceDepth === 0) inChoice = false;
            }

            // Validate the line
            this.validateLine(trimmed, line);
        });
    }

    /**
     * Validate a single line
     */
    validateLine(trimmed, fullLine) {
        // Determine command type
        const firstWord = this.getFirstWord(trimmed);

        // Check if it's a known command
        if (firstWord.endsWith('.')) {
            const commandName = firstWord.slice(0, -1);
            this.validateCommand(commandName, trimmed);
        } else if (firstWord.startsWith('@')) {
            this.validateDialogue(trimmed);
        } else if (trimmed === '{' || trimmed === '}') {
            // Brace validation handled separately
        } else if (!trimmed.startsWith('//')) {
            // Unknown syntax
            this.addWarning(
                'unknown_syntax',
                this.currentLine,
                `Unrecognized syntax: ${firstWord}`,
                `Check if this is a valid command. Commands should end with a period (e.g., BACKGROUND.)`
            );
        }
    }

    /**
     * Validate a command
     */
    validateCommand(commandName, line) {
        const commandUpper = commandName.toUpperCase();
        const rule = this.commandRules[commandUpper];

        if (!rule) {
            this.addWarning(
                'unknown_command',
                this.currentLine,
                `Unknown command: ${commandName}`,
                `Did you mean one of: ${this.getSimilarCommands(commandName).join(', ')}?`
            );
            return;
        }

        // Validate required parameters
        const parts = line.split(/\s+/);
        if (rule.minParams && parts.length - 1 < rule.minParams) {
            this.addError(
                'missing_param',
                this.currentLine,
                `${commandName} requires at least ${rule.minParams} parameter(s), got ${parts.length - 1}`,
                rule.usage
            );
        }

        // Run command-specific validation
        if (rule.validate) {
            rule.validate.call(this, parts, line);
        }
    }

    /**
     * Validate dialogue line
     */
    validateDialogue(line) {
        const parts = line.split(/\s+/);
        const charName = parts[0].substring(1); // Remove @

        // Validate character is defined
        if (charName.toLowerCase() !== 'none') {
            const capitalizedName = this.capitalizeFirstLetter(charName.replace('_', ' '));
            if (!this.definedCharacters.has(capitalizedName)) {
                this.addWarning(
                    'undefined_character',
                    this.currentLine,
                    `Character "@${charName}" used but not defined with CHARACTERS. command`,
                    `Add: CHARACTERS. @${charName} position center`
                );
            }
        }

        // Validate properties in dialogue
        this.validateDialogueProperties(parts);
    }

    /**
     * Validate dialogue properties
     */
    validateDialogueProperties(parts) {
        const knownProps = [
            'text_delay', 'textDelay', 'bubble', 'bubble_offset_y', 'bubbleOffsetY',
            'text_font_size', 'textFontSize', 'nameTag', 'sfxText', 'tweenIn', 'tweenOut',
            'anim', 'emo', 'faceTo', 'tint', 'handheld', 'position', 'anim_delay',
            'animDelay', 'animSpeed', 'outfit', 'shadow', 'voice_over', 'voiceover'
        ];

        for (let i = 1; i < parts.length - 1; i += 2) {
            const prop = parts[i];
            if (knownProps.includes(prop)) {
                const value = parts[i + 1];
                this.validatePropertyValue(prop, value);
            }
        }
    }

    /**
     * Validate property value type
     */
    validatePropertyValue(propName, value) {
        const rule = this.propertyRules[propName];
        if (!rule) return;

        if (rule.type === 'number') {
            if (isNaN(parseFloat(value))) {
                this.addError(
                    'type_mismatch',
                    this.currentLine,
                    `Property "${propName}" expects a number, got "${value}"`,
                    `Use a numeric value, e.g., ${propName} 1.5`
                );
            }
        } else if (rule.type === 'boolean') {
            if (value !== 'true' && value !== 'false') {
                this.addError(
                    'type_mismatch',
                    this.currentLine,
                    `Property "${propName}" expects true or false, got "${value}"`,
                    `Use: ${propName} true or ${propName} false`
                );
            }
        } else if (rule.type === 'enum' && rule.values) {
            if (!rule.values.includes(value.toLowerCase())) {
                this.addError(
                    'invalid_value',
                    this.currentLine,
                    `Property "${propName}" has invalid value "${value}"`,
                    `Valid values: ${rule.values.join(', ')}`
                );
            }
        }
    }

    /**
     * Validate asset exists
     */
    validateAsset(assetType, assetName) {
        if (!this.options.checkAssets) return;
        if (assetName.startsWith('#')) return; // Color code, not an asset

        const assetPath = this.options.assetPaths[assetType];
        if (!assetPath) return;

        // Try common extensions
        const extensions = assetType === 'backgrounds' ? ['.jpg', '.png'] :
                          assetType === 'objects' ? ['.png'] :
                          (assetType === 'sfx' || assetType === 'bgm') ? ['.mp3', '.ogg'] :
                          [''];

        let found = false;
        for (const ext of extensions) {
            const fullPath = path.join(assetPath, assetName + ext);
            if (fs.existsSync(fullPath)) {
                found = true;
                break;
            }
        }

        if (!found) {
            this.addWarning(
                'asset_missing',
                this.currentLine,
                `${assetType} asset not found: ${assetName}`,
                `Check that file exists in ${assetPath}`
            );
        }
    }

    /**
     * Validate references (branches, variables)
     */
    validateReferences() {
        // Check for undefined branch references
        this.referencedBranches.forEach(branch => {
            if (!this.definedBranches.has(branch)) {
                this.addError(
                    'reference_error',
                    0,
                    `Branch "${branch}" is referenced but never defined`,
                    `Add: CONTINUE. ${branch}`
                );
            }
        });

        // Check for unused variables (info only)
        this.definedVariables.forEach(variable => {
            if (!this.referencedVariables.has(variable)) {
                this.addInfo(
                    this.currentLine,
                    `Variable "${variable}" is defined but never used`
                );
            }
        });
    }

    /**
     * Initialize command validation rules
     */
    initializeCommandRules() {
        return {
            'BACKGROUND': {
                minParams: 1,
                usage: 'BACKGROUND. <name> [position]',
                validate: function(parts) {
                    const bgName = parts[1];
                    this.validateAsset('backgrounds', bgName);
                    if (parts.length >= 3) {
                        const validPositions = ['left', 'center', 'right'];
                        if (!validPositions.includes(parts[2].toLowerCase())) {
                            this.addWarning(
                                'invalid_value',
                                this.currentLine,
                                `Invalid background position: ${parts[2]}`,
                                `Valid positions: ${validPositions.join(', ')}`
                            );
                        }
                    }
                }
            },
            'CHARACTERS': {
                minParams: 1,
                usage: 'CHARACTERS. @CharName [properties]',
                validate: function(parts) {
                    // Extract character names
                    parts.slice(1).forEach(part => {
                        if (part.startsWith('@')) {
                            const charName = this.capitalizeFirstLetter(part.substring(1).replace('_', ' '));
                            this.definedCharacters.add(charName);
                        }
                    });
                }
            },
            'BGM': {
                minParams: 1,
                usage: 'BGM. <music_name>',
                validate: function(parts) {
                    const bgmName = parts[1];
                    if (bgmName !== 'default' && bgmName !== '') {
                        this.validateAsset('bgm', bgmName);
                    }
                }
            },
            'SFX': {
                minParams: 1,
                usage: 'SFX. <sound_name> [loop|stop]',
                validate: function(parts) {
                    const sfxName = parts[1];
                    if (sfxName !== 'stop') {
                        const actualName = parts[1] === 'loop' ? parts[2] : parts[1];
                        if (actualName) {
                            this.validateAsset('sfx', actualName);
                        }
                    }
                }
            },
            'JUMPTO': {
                minParams: 1,
                usage: 'JUMPTO. <branch_name>',
                validate: function(parts) {
                    const branchName = parts[1];
                    this.referencedBranches.add(branchName);
                }
            },
            'CONTINUE': {
                minParams: 1,
                usage: 'CONTINUE. <branch_name>',
                validate: function(parts) {
                    const branchName = parts[1];
                    if (this.definedBranches.has(branchName)) {
                        this.addError(
                            'duplicate_definition',
                            this.currentLine,
                            `Branch "${branchName}" is already defined`,
                            'Use a unique branch name'
                        );
                    }
                }
            },
            'OBJECT': {
                minParams: 3,
                usage: 'OBJECT. <objectID> <source> from { x, y } [properties]',
                validate: function(parts, line) {
                    const objectID = parts[1];
                    const source = parts[2];
                    this.validateAsset('objects', source);

                    // Check for 'from' keyword
                    if (!line.includes('from')) {
                        this.addError(
                            'missing_param',
                            this.currentLine,
                            'OBJECT. command requires "from" position',
                            'Add: from { x:<number>, y:<number> }'
                        );
                    }

                    // Check for object syntax
                    if (!line.includes('{') || !line.includes('}')) {
                        this.addError(
                            'syntax_error',
                            this.currentLine,
                            'OBJECT. position must use object syntax { x, y }',
                            'Example: from { x:100, y:200 }'
                        );
                    }
                }
            },
            'CHOICE': {
                minParams: 0,
                usage: 'CHOICE.',
                validate: function(parts) {
                    // Choice validation is complex, handled separately
                }
            },
            'SET_BOOLEAN': {
                minParams: 2,
                usage: 'SET_BOOLEAN. <var_name> <true|false>',
                validate: function(parts) {
                    const varName = parts[1];
                    const value = parts[2];
                    this.definedVariables.add(varName);

                    if (value && value !== 'true' && value !== 'false') {
                        this.addError(
                            'invalid_value',
                            this.currentLine,
                            `SET_BOOLEAN. value must be true or false, got "${value}"`,
                            `Use: SET_BOOLEAN. ${varName} true`
                        );
                    }
                }
            },
            'SET_INTEGER': {
                minParams: 3,
                usage: 'SET_INTEGER. <var_name> <operator> <value>',
                validate: function(parts) {
                    const varName = parts[1];
                    const operator = parts[2];
                    const value = parts[3];
                    this.definedVariables.add(varName);

                    const validOperators = ['=', '+=', '-='];
                    if (!validOperators.includes(operator)) {
                        this.addError(
                            'invalid_value',
                            this.currentLine,
                            `Invalid operator "${operator}"`,
                            `Valid operators: ${validOperators.join(', ')}`
                        );
                    }

                    if (value && value !== 'min' && value !== 'max' && isNaN(parseInt(value))) {
                        this.addError(
                            'type_mismatch',
                            this.currentLine,
                            `SET_INTEGER. value must be a number, got "${value}"`,
                            'Use a numeric value or: min <n> max <n>'
                        );
                    }
                }
            },
            'ANIMEFFECT': {
                minParams: 1,
                usage: 'ANIMEFFECT. <effect_type> [properties]',
                validate: function(parts) {
                    const effectType = parts[1];
                    const validEffects = [
                        'trans0', 'trans1', 'zoom_in', 'zoom_out', 'zoom_pan', 'pan',
                        'freeze_frame', 'heartbeat', 'pulse', 'hover', 'flashback',
                        'flashback_end', 'flashbackEnd', 'love_gender', 'loveGender',
                        'love_gender_end', 'loveGenderEnd', 'input_name', 'inputName',
                        'dress_up', 'dressUp', 'text_chat', 'textChat', 'zoomIn',
                        'zoomOut', 'zoomPan', 'freezeFrame'
                    ];

                    if (!validEffects.includes(effectType)) {
                        this.addWarning(
                            'unknown_effect',
                            this.currentLine,
                            `Unknown ANIMEFFECT type: ${effectType}`,
                            `Valid types: ${validEffects.slice(0, 10).join(', ')}, ...`
                        );
                    }
                }
            },
            'END': {
                minParams: 0,
                usage: 'END. [color]',
                validate: function(parts) {
                    // END command validation
                }
            },
            'WALK_IN': {
                minParams: 1,
                usage: 'WALK_IN. @CharName [from <dir>] [to <pos>]',
                validate: function(parts) {
                    // Walk in validation
                }
            },
            'WALK_OUT': {
                minParams: 1,
                usage: 'WALK_OUT. @CharName [from <pos>]',
                validate: function(parts) {
                    // Walk out validation
                }
            },
            'FADE_IN': {
                minParams: 1,
                usage: 'FADE_IN. @CharName [properties]',
                validate: function(parts) {}
            },
            'FADE_OUT': {
                minParams: 1,
                usage: 'FADE_OUT. @CharName [properties]',
                validate: function(parts) {}
            },
            'RUN_IN': {
                minParams: 1,
                usage: 'RUN_IN. @CharName [properties]',
                validate: function(parts) {}
            },
            'RUN_OUT': {
                minParams: 1,
                usage: 'RUN_OUT. @CharName [properties]',
                validate: function(parts) {}
            },
            'STUMBLE_IN': {
                minParams: 1,
                usage: 'STUMBLE_IN. @CharName [properties]',
                validate: function(parts) {}
            },
            'STUMBLE_OUT': {
                minParams: 1,
                usage: 'STUMBLE_OUT. @CharName [properties]',
                validate: function(parts) {}
            },
            'SETCHAR': {
                minParams: 1,
                usage: 'SETCHAR. @CharName [properties]',
                validate: function(parts) {
                    // SETCHAR validation
                }
            },
            'OVERLAY': {
                minParams: 1,
                usage: 'OVERLAY. <type>',
                validate: function(parts) {
                    const validTypes = ['flashback', 'dream', 'none'];
                    if (parts.length >= 2 && !validTypes.includes(parts[1].toLowerCase())) {
                        this.addWarning(
                            'invalid_value',
                            this.currentLine,
                            `Unknown overlay type: ${parts[1]}`,
                            `Valid types: ${validTypes.join(', ')}`
                        );
                    }
                }
            },
            'REWARD': {
                minParams: 2,
                usage: 'REWARD. <currency> <amount>',
                validate: function(parts) {
                    const amount = parts[2];
                    if (amount && isNaN(parseInt(amount))) {
                        this.addError(
                            'type_mismatch',
                            this.currentLine,
                            `REWARD amount must be a number, got "${amount}"`,
                            'Use a numeric value'
                        );
                    }
                }
            },
            'COST': {
                minParams: 2,
                usage: 'COST. <currency> <amount>',
                validate: function(parts) {
                    const amount = parts[2];
                    if (amount && isNaN(parseInt(amount))) {
                        this.addError(
                            'type_mismatch',
                            this.currentLine,
                            `COST amount must be a number, got "${amount}"`,
                            'Use a numeric value'
                        );
                    }
                }
            },
            'DRESSUP': {
                minParams: 1,
                usage: 'DRESSUP. <outfit_name> [COST. currency amount]',
                validate: function(parts) {
                    // DRESSUP validation
                }
            },
            'PARTICLE': {
                minParams: 2,
                usage: 'PARTICLE. type <type> [properties]',
                validate: function(parts) {
                    const validTypes = ['rain', 'snow', 'meteor', 'matrix', 'fireworks'];
                    // Check if 'type' keyword is present
                    const typeIndex = parts.indexOf('type');
                    if (typeIndex >= 0 && parts.length > typeIndex + 1) {
                        const particleType = parts[typeIndex + 1];
                        if (!validTypes.includes(particleType.toLowerCase())) {
                            this.addWarning(
                                'invalid_value',
                                this.currentLine,
                                `Unknown particle type: ${particleType}`,
                                `Valid types: ${validTypes.join(', ')}`
                            );
                        }
                    }
                }
            },
            'BACKGROUND_PARTICLE': {
                minParams: 2,
                usage: 'BACKGROUND_PARTICLE. type <type> [properties]',
                validate: function(parts) {
                    // Same as PARTICLE
                }
            },
            'SINGLE_PARTICLE': {
                minParams: 4,
                usage: 'SINGLE_PARTICLE. <id> <type> posX <x> posY <y>',
                validate: function(parts) {
                    // Single particle validation
                }
            },
            'PROGRESS_BAR': {
                minParams: 1,
                usage: 'PROGRESS_BAR. <progressID> [properties]',
                validate: function(parts) {
                    // Progress bar validation
                }
            },
            'WINDOWBOXING': {
                minParams: 1,
                usage: 'WINDOWBOXING. <position> [properties]',
                validate: function(parts) {
                    const validPositions = ['top', 'bottom', 'left', 'right'];
                    if (parts.length >= 2 && !validPositions.includes(parts[1].toLowerCase())) {
                        this.addWarning(
                            'invalid_value',
                            this.currentLine,
                            `Unknown windowboxing position: ${parts[1]}`,
                            `Valid positions: ${validPositions.join(', ')}`
                        );
                    }
                }
            },
            'TOASTBOX': {
                minParams: 1,
                usage: 'TOASTBOX. [time <seconds>] [sfx <sound>] message text',
                validate: function(parts) {
                    // Toast box validation
                }
            },
            'SETTINGS': {
                minParams: 1,
                usage: 'SETTINGS. <setting> [value]',
                validate: function(parts) {
                    // Settings validation
                }
            },
            'SWITCH': {
                minParams: 2,
                usage: 'SWITCH. <operator> <variable>',
                validate: function(parts) {
                    const validOperators = ['==', '!=', '>', '<', '>=', '<='];
                    if (parts.length >= 2 && !validOperators.includes(parts[1])) {
                        this.addWarning(
                            'invalid_value',
                            this.currentLine,
                            `Unknown operator: ${parts[1]}`,
                            `Valid operators: ${validOperators.join(', ')}`
                        );
                    }
                }
            },
            'CASE': {
                minParams: 1,
                usage: 'CASE. <value>',
                validate: function(parts) {
                    // Case validation
                }
            },
            'CHECK_BOOLEAN': {
                minParams: 2,
                usage: 'CHECK_BOOLEAN. <var> <true|false>',
                validate: function(parts) {
                    for (let i = 1; i < parts.length; i += 2) {
                        const varName = parts[i];
                        this.referencedVariables.add(varName);
                    }
                }
            },
            'CHECK_INTEGER': {
                minParams: 3,
                usage: 'CHECK_INTEGER. <var> <operator> <value>',
                validate: function(parts) {
                    if (parts.length >= 2) {
                        this.referencedVariables.add(parts[1]);
                    }
                }
            },
            'CHECK_VIRTUAL_CURRENCY': {
                minParams: 3,
                usage: 'CHECK_VIRTUAL_CURRENCY. <currency> <operator> <amount>',
                validate: function(parts) {
                    // Currency check validation
                }
            },
            'ELSE': {
                minParams: 0,
                usage: 'ELSE.',
                validate: function(parts) {
                    // Else validation
                }
            }
        };
    }

    /**
     * Initialize property validation rules
     */
    initializePropertyRules() {
        return {
            'text_delay': { type: 'number' },
            'textDelay': { type: 'number' },
            'bubble_offset_y': { type: 'number' },
            'bubbleOffsetY': { type: 'number' },
            'text_font_size': { type: 'number' },
            'textFontSize': { type: 'number' },
            'anim_delay': { type: 'number' },
            'animDelay': { type: 'number' },
            'animSpeed': { type: 'number' },
            'scale': { type: 'number' },
            'shadow': { type: 'boolean' },
            'tweenIn': { type: 'boolean' },
            'tweenOut': { type: 'boolean' },
            'bubble': { type: 'enum', values: ['normal', 'think', 'none'] },
            'position': { type: 'enum', values: ['left', 'center', 'right'] },
            'faceTo': { type: 'enum', values: ['left', 'right'] }
        };
    }

    /**
     * Error/Warning/Info management
     */
    addError(type, line, message, suggestion = '') {
        this.errors.push({
            type,
            severity: 'error',
            line: line + 1,
            file: this.currentFile,
            message,
            suggestion
        });
    }

    addWarning(type, line, message, suggestion = '') {
        this.warnings.push({
            type,
            severity: 'warning',
            line: line + 1,
            file: this.currentFile,
            message,
            suggestion
        });
    }

    addInfo(line, message) {
        this.info.push({
            severity: 'info',
            line: line + 1,
            file: this.currentFile,
            message
        });
    }

    /**
     * Generate validation report
     */
    getReport() {
        const hasErrors = this.errors.length > 0;
        const hasWarnings = this.warnings.length > 0;

        return {
            valid: !hasErrors,
            errors: this.errors,
            warnings: this.warnings,
            info: this.info,
            summary: {
                errorCount: this.errors.length,
                warningCount: this.warnings.length,
                infoCount: this.info.length
            }
        };
    }

    /**
     * Print report to console
     */
    printReport(report) {
        console.log('\n=== VNScript Validation Report ===\n');

        if (report.valid && report.warnings.length === 0) {
            console.log('✓ No issues found!');
            return;
        }

        // Print errors
        if (report.errors.length > 0) {
            console.log(`✗ ${report.errors.length} ERROR(S):\n`);
            report.errors.forEach((error, index) => {
                console.log(`${index + 1}. Line ${error.line}: ${error.message}`);
                if (error.suggestion) {
                    console.log(`   Suggestion: ${error.suggestion}`);
                }
                console.log('');
            });
        }

        // Print warnings
        if (report.warnings.length > 0) {
            console.log(`⚠ ${report.warnings.length} WARNING(S):\n`);
            report.warnings.forEach((warning, index) => {
                console.log(`${index + 1}. Line ${warning.line}: ${warning.message}`);
                if (warning.suggestion) {
                    console.log(`   Suggestion: ${warning.suggestion}`);
                }
                console.log('');
            });
        }

        // Print summary
        console.log('=== Summary ===');
        console.log(`Errors: ${report.summary.errorCount}`);
        console.log(`Warnings: ${report.summary.warningCount}`);
        console.log(`Info: ${report.summary.infoCount}`);

        if (report.valid) {
            console.log('\n✓ Validation passed (with warnings)');
        } else {
            console.log('\n✗ Validation failed');
        }
    }

    /**
     * Helper: Get similar commands for suggestions
     */
    getSimilarCommands(input) {
        const allCommands = Object.keys(this.commandRules);
        const similar = allCommands.filter(cmd => {
            return this.levenshteinDistance(input.toUpperCase(), cmd) <= 3;
        });
        return similar.length > 0 ? similar : allCommands.slice(0, 5);
    }

    /**
     * Helper: Levenshtein distance for typo detection
     */
    levenshteinDistance(a, b) {
        const matrix = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }

    /**
     * Helper: Get first word from line
     */
    getFirstWord(line) {
        const match = line.match(/^\S+/);
        return match ? match[0] : '';
    }

    /**
     * Helper: Capitalize first letter
     */
    capitalizeFirstLetter(string) {
        if (!string) return '';
        if (string.split(' ').length > 1) {
            return string.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        }
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node script-validator.js <file.vnscript> [options]');
        console.log('Options:');
        console.log('  --no-assets    Skip asset validation');
        console.log('  --strict       Enable strict mode');
        process.exit(1);
    }

    const filePath = args[0];
    const options = {
        checkAssets: !args.includes('--no-assets'),
        strictMode: args.includes('--strict')
    };

    const validator = new VNScriptValidator(options);
    const report = validator.validateFile(filePath);
    validator.printReport(report);

    // Exit with error code if validation failed
    process.exit(report.valid ? 0 : 1);
}

module.exports = VNScriptValidator;
