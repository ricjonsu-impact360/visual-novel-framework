/**
 * VNScript Preprocessor
 *
 * Handles macro expansion and include files for .vnscript
 * Runs before the main parser to expand macros and includes
 *
 * Version: 1.0.0
 * Date: 2025-11-08
 */

const fs = require('fs');
const path = require('path');

class VNScriptPreprocessor {
    constructor(options = {}) {
        this.macros = new Map();
        this.errors = [];
        this.warnings = [];
        this.currentFile = null;
        this.currentLine = 0;
        this.processedFiles = new Set(); // Track includes to prevent circular dependencies

        // Configuration
        this.options = {
            verbose: options.verbose || false,
            outputExpanded: options.outputExpanded || false,
            maxIncludeDepth: options.maxIncludeDepth || 10,
            ...options
        };

        this.includeDepth = 0;
    }

    /**
     * Main preprocessing entry point
     */
    preprocessFile(filePath) {
        this.currentFile = filePath;
        this.errors = [];
        this.warnings = [];
        this.processedFiles.clear();
        this.macros.clear();

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const expanded = this.preprocessContent(content, filePath);

            if (this.options.outputExpanded) {
                const expandedPath = filePath.replace('.vnscript', '.expanded.vnscript');
                fs.writeFileSync(expandedPath, expanded, 'utf-8');
                if (this.options.verbose) {
                    console.log(`Expanded script written to: ${expandedPath}`);
                }
            }

            return {
                success: this.errors.length === 0,
                content: expanded,
                errors: this.errors,
                warnings: this.warnings,
                macros: Array.from(this.macros.keys())
            };
        } catch (error) {
            this.addError(0, `Failed to read file: ${error.message}`);
            return {
                success: false,
                content: '',
                errors: this.errors,
                warnings: this.warnings,
                macros: []
            };
        }
    }

    /**
     * Preprocess content string
     */
    preprocessContent(content, filePath) {
        this.processedFiles.add(filePath);
        const lines = content.split('\n');

        // First pass: collect macro definitions and process includes
        const linesAfterFirstPass = this.firstPass(lines, filePath);

        // Second pass: expand macro usage
        const linesAfterSecondPass = this.secondPass(linesAfterFirstPass);

        // Third pass: convert improved branching syntax
        const expandedLines = this.thirdPass(linesAfterSecondPass);

        return expandedLines.join('\n');
    }

    /**
     * First pass: Collect macro definitions, process includes
     */
    firstPass(lines, filePath) {
        const result = [];
        let i = 0;

        while (i < lines.length) {
            this.currentLine = i;
            const line = lines[i];
            const trimmed = line.trim();

            // Skip comments
            if (trimmed.startsWith('//') || trimmed.startsWith('/*')) {
                result.push(line);
                i++;
                continue;
            }

            // Handle INCLUDE
            if (trimmed.startsWith('INCLUDE.')) {
                const includeResult = this.processInclude(trimmed, filePath);
                if (includeResult.success) {
                    // Add included content
                    result.push(`// --- BEGIN INCLUDE: ${includeResult.file} ---`);
                    result.push(...includeResult.lines);
                    result.push(`// --- END INCLUDE: ${includeResult.file} ---`);
                }
                i++;
                continue;
            }

            // Handle MACRO definition
            if (trimmed.startsWith('MACRO.')) {
                const macroResult = this.parseMacroDefinition(lines, i);
                if (macroResult.success) {
                    // Store macro, don't add to output
                    this.macros.set(macroResult.name, macroResult);
                    i = macroResult.endLine + 1;

                    if (this.options.verbose) {
                        console.log(`Defined macro: ${macroResult.name} with ${macroResult.params.length} parameter(s)`);
                    }
                    continue;
                } else {
                    // Macro definition failed, keep lines as-is
                    result.push(line);
                    i++;
                    continue;
                }
            }

            // Regular line
            result.push(line);
            i++;
        }

        return result;
    }

    /**
     * Process INCLUDE statement
     */
    processInclude(line, currentFilePath) {
        const parts = line.split(/\s+/);
        if (parts.length < 2) {
            this.addError(this.currentLine, 'INCLUDE. requires a file path');
            return { success: false };
        }

        const includeFile = parts[1];
        const basePath = path.dirname(currentFilePath);
        const includePath = path.resolve(basePath, includeFile);

        // Check for circular dependencies
        if (this.processedFiles.has(includePath)) {
            this.addWarning(this.currentLine, `Circular include detected: ${includeFile} (skipping)`);
            return { success: false };
        }

        // Check include depth
        this.includeDepth++;
        if (this.includeDepth > this.options.maxIncludeDepth) {
            this.addError(this.currentLine, `Maximum include depth (${this.options.maxIncludeDepth}) exceeded`);
            this.includeDepth--;
            return { success: false };
        }

        // Read include file
        try {
            const includeContent = fs.readFileSync(includePath, 'utf-8');
            const includeLines = includeContent.split('\n');

            // Recursively preprocess included file (for nested includes and macros)
            const processed = this.firstPass(includeLines, includePath);

            this.includeDepth--;

            return {
                success: true,
                file: includeFile,
                lines: processed
            };
        } catch (error) {
            this.addError(this.currentLine, `Failed to include file ${includeFile}: ${error.message}`);
            this.includeDepth--;
            return { success: false };
        }
    }

    /**
     * Parse macro definition
     */
    parseMacroDefinition(lines, startLine) {
        const firstLine = lines[startLine].trim();
        const parts = firstLine.split(/\s+/);

        if (parts.length < 2) {
            this.addError(startLine, 'MACRO. requires a name');
            return { success: false };
        }

        const macroName = parts[1];
        const params = parts.slice(2); // Optional parameters

        // Find END_MACRO
        let endLine = -1;
        for (let i = startLine + 1; i < lines.length; i++) {
            const trimmed = lines[i].trim();
            if (trimmed === 'END_MACRO.') {
                endLine = i;
                break;
            }
        }

        if (endLine === -1) {
            this.addError(startLine, `MACRO. ${macroName} has no matching END_MACRO.`);
            return { success: false };
        }

        // Extract macro body
        const body = lines.slice(startLine + 1, endLine);

        // Validate parameter usage in body
        const usedParams = new Set();
        body.forEach(line => {
            const matches = line.matchAll(/\{(\w+)\}/g);
            for (const match of matches) {
                usedParams.add(match[1]);
            }
        });

        // Warn about unused parameters
        params.forEach(param => {
            if (!usedParams.has(param)) {
                this.addWarning(startLine, `Macro parameter "${param}" is defined but never used`);
            }
        });

        // Warn about undefined parameters
        usedParams.forEach(param => {
            if (!params.includes(param)) {
                this.addWarning(startLine, `Macro uses parameter "{${param}}" which is not defined`);
            }
        });

        return {
            success: true,
            name: macroName,
            params: params,
            body: body,
            startLine: startLine,
            endLine: endLine
        };
    }

    /**
     * Second pass: Expand macro usage
     */
    secondPass(lines) {
        const result = [];

        for (let i = 0; i < lines.length; i++) {
            this.currentLine = i;
            const line = lines[i];
            const trimmed = line.trim();

            // Check for USE_MACRO
            if (trimmed.startsWith('USE_MACRO.')) {
                const expanded = this.expandMacro(trimmed, i);
                if (expanded.success) {
                    result.push(`// --- BEGIN MACRO: ${expanded.name} ---`);
                    result.push(...expanded.lines);
                    result.push(`// --- END MACRO: ${expanded.name} ---`);
                } else {
                    // Failed to expand, keep original line
                    result.push(line);
                }
            } else {
                result.push(line);
            }
        }

        return result;
    }

    /**
     * Expand a macro usage
     */
    expandMacro(line, lineNumber) {
        const parts = line.split(/\s+/);

        if (parts.length < 2) {
            this.addError(lineNumber, 'USE_MACRO. requires a macro name');
            return { success: false };
        }

        const macroName = parts[1];
        const args = parts.slice(2);

        // Check if macro exists
        if (!this.macros.has(macroName)) {
            this.addError(lineNumber, `Macro "${macroName}" is not defined`);
            return { success: false };
        }

        const macro = this.macros.get(macroName);

        // Check argument count
        if (args.length !== macro.params.length) {
            this.addError(
                lineNumber,
                `Macro "${macroName}" expects ${macro.params.length} argument(s), got ${args.length}`
            );
            return { success: false };
        }

        // Create parameter substitution map
        const substitutions = new Map();
        macro.params.forEach((param, index) => {
            substitutions.set(param, args[index]);
        });

        // Expand macro body with parameter substitution
        const expandedLines = macro.body.map(bodyLine => {
            let expanded = bodyLine;
            substitutions.forEach((value, param) => {
                // Replace {param} with value
                const regex = new RegExp(`\\{${param}\\}`, 'g');
                expanded = expanded.replace(regex, value);
            });
            return expanded;
        });

        return {
            success: true,
            name: macroName,
            lines: expandedLines
        };
    }

    /**
     * Third pass: Convert improved branching syntax to old syntax
     */
    thirdPass(lines) {
        const result = [];
        let i = 0;
        let inChoice = false;

        while (i < lines.length) {
            this.currentLine = i;
            const line = lines[i];
            const trimmed = line.trim();

            // Detect CHOICE. with new syntax (look ahead for OPTION.)
            if (trimmed === 'CHOICE.' || trimmed.startsWith('CHOICE.')) {
                // Check if next non-empty/non-comment line is OPTION.
                let j = i + 1;
                let isNewSyntax = false;
                while (j < lines.length) {
                    const nextTrimmed = lines[j].trim();
                    if (nextTrimmed === '' || nextTrimmed.startsWith('//')) {
                        j++;
                        continue;
                    }
                    if (nextTrimmed.startsWith('OPTION.') || nextTrimmed.startsWith('OPTION[')) {
                        isNewSyntax = true;
                    }
                    break;
                }

                if (isNewSyntax) {
                    // Convert new CHOICE syntax
                    result.push(line); // Keep CHOICE. line
                    i++;
                    i = this.convertChoiceBlock(lines, i, result);
                    continue;
                }
            }

            // Default: keep line as-is
            result.push(line);
            i++;
        }

        return result;
    }

    /**
     * Convert a CHOICE block with OPTION syntax to old { } syntax
     */
    convertChoiceBlock(lines, startIndex, result) {
        let i = startIndex;

        while (i < lines.length) {
            const line = lines[i];
            const trimmed = line.trim();

            // Skip empty lines and comments
            if (trimmed === '' || trimmed.startsWith('//')) {
                result.push(line);
                i++;
                continue;
            }

            // End of choice block
            if (trimmed === 'END_CHOICE.' || trimmed.startsWith('END_CHOICE.')) {
                // Don't add END_CHOICE. to output (not part of old syntax)
                i++;
                break;
            }

            // Handle OPTION
            if (trimmed.startsWith('OPTION.') || trimmed.startsWith('OPTION[')) {
                const optionResult = this.convertOption(lines, i);
                result.push(...optionResult.lines);
                i = optionResult.endLine + 1;
                continue;
            }

            // Unexpected line in CHOICE block
            result.push(line);
            i++;
        }

        return i;
    }

    /**
     * Convert a single OPTION block
     */
    convertOption(lines, startLine) {
        const firstLine = lines[startLine].trim();
        const converted = [];

        // Parse OPTION line
        let optionText = '';
        let modifiers = {}; // cost, reward, requires, etc.

        // Check for modifiers in brackets: OPTION[cost=coins:100]
        if (firstLine.startsWith('OPTION[')) {
            const bracketEnd = firstLine.indexOf(']');
            if (bracketEnd > 0) {
                const modifierPart = firstLine.substring(7, bracketEnd); // After "OPTION["
                optionText = firstLine.substring(bracketEnd + 1).trim();

                // Parse modifiers
                modifiers = this.parseOptionModifiers(modifierPart);
            }
        } else if (firstLine.startsWith('OPTION.')) {
            optionText = firstLine.substring(7).trim(); // After "OPTION."
        }

        // Find END_OPTION
        let endLine = -1;
        for (let i = startLine + 1; i < lines.length; i++) {
            const trimmed = lines[i].trim();
            if (trimmed === 'END_OPTION.' || trimmed.startsWith('END_OPTION.')) {
                endLine = i;
                break;
            }
        }

        if (endLine === -1) {
            this.addError(startLine, 'OPTION. has no matching END_OPTION.');
            return { lines: [lines[startLine]], endLine: startLine };
        }

        // Extract option body
        const body = lines.slice(startLine + 1, endLine);

        // Generate old syntax
        // Determine character name (use @none for now, can be improved)
        const charName = '@none';
        converted.push(`${charName} ${optionText}`);

        // Generate opening brace with modifiers
        let braceContent = '{';
        if (modifiers.cost) {
            braceContent += ` COST. ${modifiers.cost.currency} ${modifiers.cost.amount}`;
        }
        if (modifiers.reward) {
            braceContent += ` REWARD. ${modifiers.reward.currency} ${modifiers.reward.amount}`;
        }
        if (modifiers.requires) {
            // This is more complex, may need CHECK_BOOLEAN or CHECK_INTEGER
            // For now, add as comment
            braceContent += ` // requires: ${modifiers.requires}`;
        }
        converted.push(braceContent);

        // Add option body with proper indentation
        body.forEach(line => {
            converted.push(line);
        });

        // Closing brace
        converted.push('}');

        return {
            lines: converted,
            endLine: endLine
        };
    }

    /**
     * Parse option modifiers from bracket notation
     */
    parseOptionModifiers(modifierString) {
        const modifiers = {};

        // Split by commas (but respect nested structures)
        const parts = modifierString.split(',').map(s => s.trim());

        parts.forEach(part => {
            // cost=coins:100
            if (part.startsWith('cost=')) {
                const value = part.substring(5); // After "cost="
                const [currency, amount] = value.split(':');
                modifiers.cost = { currency, amount: parseInt(amount) };
            }
            // reward=points:50
            else if (part.startsWith('reward=')) {
                const value = part.substring(7); // After "reward="
                const [currency, amount] = value.split(':');
                modifiers.reward = { currency, amount: parseInt(amount) };
            }
            // requires=flag_name
            else if (part.startsWith('requires=')) {
                modifiers.requires = part.substring(9); // After "requires="
            }
        });

        return modifiers;
    }

    /**
     * Error/Warning management
     */
    addError(line, message) {
        this.errors.push({
            line: line + 1,
            file: this.currentFile,
            message: message
        });
    }

    addWarning(line, message) {
        this.warnings.push({
            line: line + 1,
            file: this.currentFile,
            message: message
        });
    }

    /**
     * Print preprocessing report
     */
    printReport(result) {
        console.log('\n=== VNScript Preprocessing Report ===\n');

        if (result.success) {
            console.log('✓ Preprocessing successful\n');

            if (result.macros.length > 0) {
                console.log(`Macros defined: ${result.macros.length}`);
                result.macros.forEach(name => {
                    const macro = this.macros.get(name);
                    console.log(`  - ${name}(${macro.params.join(', ')})`);
                });
                console.log('');
            }

            if (result.warnings.length > 0) {
                console.log(`⚠ ${result.warnings.length} WARNING(S):\n`);
                result.warnings.forEach((warning, index) => {
                    console.log(`${index + 1}. Line ${warning.line}: ${warning.message}`);
                });
                console.log('');
            }
        } else {
            console.log('✗ Preprocessing failed\n');

            if (result.errors.length > 0) {
                console.log(`✗ ${result.errors.length} ERROR(S):\n`);
                result.errors.forEach((error, index) => {
                    console.log(`${index + 1}. Line ${error.line}: ${error.message}`);
                });
                console.log('');
            }
        }

        console.log('=== Summary ===');
        console.log(`Errors: ${result.errors.length}`);
        console.log(`Warnings: ${result.warnings.length}`);
        console.log(`Macros: ${result.macros.length}`);
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node script-preprocessor.js <file.vnscript> [options]');
        console.log('Options:');
        console.log('  --output         Write expanded script to .expanded.vnscript file');
        console.log('  --verbose        Print detailed processing information');
        console.log('');
        console.log('Examples:');
        console.log('  node script-preprocessor.js chapter1.en.vnscript');
        console.log('  node script-preprocessor.js chapter1.en.vnscript --output');
        process.exit(1);
    }

    const filePath = args[0];
    const options = {
        outputExpanded: args.includes('--output'),
        verbose: args.includes('--verbose')
    };

    const preprocessor = new VNScriptPreprocessor(options);
    const result = preprocessor.preprocessFile(filePath);
    preprocessor.printReport(result);

    // Exit with error code if preprocessing failed
    process.exit(result.success ? 0 : 1);
}

module.exports = VNScriptPreprocessor;
