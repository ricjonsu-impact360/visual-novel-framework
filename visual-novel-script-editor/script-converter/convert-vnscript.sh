#!/bin/bash

#
# VNScript Conversion Script with Preprocessing
#
# This script handles the complete conversion pipeline:
# 1. Preprocess .vnscript files (expand macros, convert improved branching)
# 2. Parse expanded files to .en.js (existing parser)
#
# Usage:
#   ./convert-vnscript.sh              # Convert all scripts with preprocessing
#   ./convert-vnscript.sh -s           # Skip preprocessing (old behavior)
#   ./convert-vnscript.sh -v           # Verbose mode
#   ./convert-vnscript.sh -c chapter1  # Convert specific chapter only
#

# Configuration
SCRIPTS_DIR="../media/text/scripts"
TRANSLATE_DIR="../media/text/translate"
OUTPUT_DIR="../media/text"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Options
SKIP_PREPROCESSING=false
VERBOSE=false
SPECIFIC_CHAPTER=""

# Parse arguments
while getopts "svc:h" opt; do
    case $opt in
        s)
            SKIP_PREPROCESSING=true
            echo -e "${YELLOW}Skipping preprocessing step${NC}"
            ;;
        v)
            VERBOSE=true
            echo -e "${BLUE}Verbose mode enabled${NC}"
            ;;
        c)
            SPECIFIC_CHAPTER="$OPTARG"
            echo -e "${BLUE}Converting specific chapter: $SPECIFIC_CHAPTER${NC}"
            ;;
        h)
            echo "Usage: $0 [-s] [-v] [-c chapter_name]"
            echo ""
            echo "Options:"
            echo "  -s    Skip preprocessing (macros and branching)"
            echo "  -v    Verbose output"
            echo "  -c    Convert specific chapter only (e.g., -c chapter1)"
            echo "  -h    Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                    # Convert all with preprocessing"
            echo "  $0 -s                 # Convert all, skip preprocessing"
            echo "  $0 -v                 # Convert all with verbose output"
            echo "  $0 -c chapter1        # Convert chapter1 only"
            echo "  $0 -c chapter1 -v     # Convert chapter1 with verbose output"
            exit 0
            ;;
        \?)
            echo -e "${RED}Invalid option: -$OPTARG${NC}" >&2
            exit 1
            ;;
    esac
done

echo -e "${GREEN}=== VNScript Conversion Pipeline ===${NC}"
echo ""

# Step 1: Preprocessing (unless skipped)
if [ "$SKIP_PREPROCESSING" = false ]; then
    echo -e "${BLUE}Step 1: Preprocessing scripts...${NC}"

    # Find all .vnscript files
    if [ -n "$SPECIFIC_CHAPTER" ]; then
        VNSCRIPT_FILES="$SCRIPTS_DIR/${SPECIFIC_CHAPTER}.en.vnscript"
        if [ ! -f "$VNSCRIPT_FILES" ]; then
            echo -e "${RED}Error: File not found: $VNSCRIPT_FILES${NC}"
            exit 1
        fi
    else
        VNSCRIPT_FILES="$SCRIPTS_DIR/*.vnscript"
    fi

    PREPROCESS_COUNT=0
    PREPROCESS_ERRORS=0

    for file in $VNSCRIPT_FILES; do
        # Skip if file doesn't exist (no .vnscript files)
        [ -e "$file" ] || continue

        # Skip .expanded.vnscript files
        if [[ "$file" == *".expanded.vnscript" ]]; then
            continue
        fi

        filename=$(basename "$file")
        echo -n "  Processing: $filename ... "

        if [ "$VERBOSE" = true ]; then
            echo ""
            node script-preprocessor.js "$file" --output --verbose
            RESULT=$?
        else
            node script-preprocessor.js "$file" --output > /dev/null 2>&1
            RESULT=$?
        fi

        if [ $RESULT -eq 0 ]; then
            echo -e "${GREEN}✓${NC}"
            ((PREPROCESS_COUNT++))
        else
            echo -e "${RED}✗ Failed${NC}"
            ((PREPROCESS_ERRORS++))

            # Show error details
            if [ "$VERBOSE" = false ]; then
                echo -e "${YELLOW}  Run with -v flag to see details${NC}"
            fi
        fi
    done

    echo ""
    echo -e "Preprocessed: ${GREEN}$PREPROCESS_COUNT${NC} file(s)"
    if [ $PREPROCESS_ERRORS -gt 0 ]; then
        echo -e "Errors: ${RED}$PREPROCESS_ERRORS${NC} file(s)"
    fi
    echo ""
else
    echo -e "${YELLOW}Step 1: Preprocessing skipped (-s flag)${NC}"
    echo ""
fi

# Step 2: Parse to .en.js
echo -e "${BLUE}Step 2: Parsing to JavaScript...${NC}"

if [ "$VERBOSE" = true ]; then
    node script-editor.js "processScript" "$SCRIPTS_DIR/" "$TRANSLATE_DIR/" "$OUTPUT_DIR/"
else
    node script-editor.js "processScript" "$SCRIPTS_DIR/" "$TRANSLATE_DIR/" "$OUTPUT_DIR/" > /dev/null 2>&1
fi

PARSE_RESULT=$?

if [ $PARSE_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ Parsing completed successfully${NC}"
else
    echo -e "${RED}✗ Parsing failed${NC}"
    echo -e "${YELLOW}Run with -v flag to see error details${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}=== Conversion Complete ===${NC}"

# Optional: Clean up .expanded.vnscript files
read -p "Delete .expanded.vnscript files? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f "$SCRIPTS_DIR"/*.expanded.vnscript
    echo -e "${GREEN}Cleaned up temporary files${NC}"
fi

echo ""
echo -e "${BLUE}Output files are in: $OUTPUT_DIR${NC}"
