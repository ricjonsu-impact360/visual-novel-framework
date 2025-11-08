#!/bin/bash

#
# VNScript Linter
#
# Wrapper script for easy validation of .vnscript files
#
# Usage:
#   ./vnscript-lint.sh <file.vnscript> [options]
#   ./vnscript-lint.sh --all                    # Lint all scripts
#   ./vnscript-lint.sh --watch <file.vnscript>  # Watch mode
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VALIDATOR="$SCRIPT_DIR/script-validator.js"

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Check if script-validator.js exists
if [ ! -f "$VALIDATOR" ]; then
    echo -e "${RED}Error: script-validator.js not found${NC}"
    exit 1
fi

# Function to lint a single file
lint_file() {
    local file="$1"
    shift
    local options="$@"

    echo -e "${GREEN}Validating:${NC} $file"
    node "$VALIDATOR" "$file" $options
    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✓ Validation passed${NC}"
    else
        echo -e "${RED}✗ Validation failed${NC}"
    fi

    return $exit_code
}

# Function to lint all .vnscript files
lint_all() {
    local scripts_dir="$SCRIPT_DIR/../media/text/scripts"
    local failed=0
    local passed=0

    echo "Linting all .vnscript files in $scripts_dir..."
    echo ""

    for file in "$scripts_dir"/*.vnscript; do
        if [ -f "$file" ]; then
            lint_file "$file" "$@"
            if [ $? -eq 0 ]; then
                ((passed++))
            else
                ((failed++))
            fi
            echo ""
        fi
    done

    echo "================================"
    echo -e "${GREEN}Passed:${NC} $passed"
    echo -e "${RED}Failed:${NC} $failed"
    echo "================================"

    return $failed
}

# Function for watch mode
watch_file() {
    local file="$1"
    shift
    local options="$@"

    echo "Watching $file for changes..."
    echo "Press Ctrl+C to stop"
    echo ""

    # Initial validation
    lint_file "$file" $options

    # Watch for changes (requires inotify-tools on Linux)
    if command -v inotifywait &> /dev/null; then
        while inotifywait -e modify "$file" 2>/dev/null; do
            clear
            echo "File changed, re-validating..."
            lint_file "$file" $options
        done
    else
        echo -e "${YELLOW}Warning: inotifywait not found. Install inotify-tools for watch mode.${NC}"
        echo "Falling back to polling mode..."

        local last_mod=$(stat -c %Y "$file")
        while true; do
            sleep 2
            local current_mod=$(stat -c %Y "$file")
            if [ "$current_mod" != "$last_mod" ]; then
                clear
                echo "File changed, re-validating..."
                lint_file "$file" $options
                last_mod=$current_mod
            fi
        done
    fi
}

# Parse arguments
if [ $# -eq 0 ]; then
    echo "Usage: $0 <file.vnscript> [options]"
    echo ""
    echo "Options:"
    echo "  --all              Lint all .vnscript files"
    echo "  --watch <file>     Watch file for changes and re-validate"
    echo "  --no-assets        Skip asset validation"
    echo "  --strict           Enable strict mode"
    echo ""
    echo "Examples:"
    echo "  $0 chapter1.en.vnscript"
    echo "  $0 chapter1.en.vnscript --no-assets"
    echo "  $0 --all"
    echo "  $0 --watch chapter1.en.vnscript"
    exit 1
fi

# Handle special modes
case "$1" in
    --all)
        shift
        lint_all "$@"
        exit $?
        ;;
    --watch)
        shift
        if [ $# -eq 0 ]; then
            echo -e "${RED}Error: --watch requires a file argument${NC}"
            exit 1
        fi
        file="$1"
        shift
        watch_file "$file" "$@"
        exit $?
        ;;
    *)
        lint_file "$@"
        exit $?
        ;;
esac
