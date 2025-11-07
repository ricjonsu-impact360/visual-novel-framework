#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script to copy assets from v2-visual-novel-assets folder to the current project
based on the customload.js configuration file.
Compatible with Python 2.7+
"""

import os
import shutil
import json
import re

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CUSTOMLOAD_PATH = os.path.join(SCRIPT_DIR, "media", "text", "customload.js")
ASSETS_SOURCE = os.path.join(os.path.dirname(SCRIPT_DIR), "v2-visual-novel-assets")

# Asset mappings: (customload key -> (source folder, destination folder, file extensions))
ASSET_MAPPINGS = {
    "bg": (
        os.path.join("graphics", "backgrounds"),
        os.path.join(SCRIPT_DIR, "media", "graphics", "backgrounds"),
        [".png", ".jpg", ".jpeg", ".webp"]
    ),
    "object": (
        os.path.join("graphics", "object"),
        os.path.join(SCRIPT_DIR, "media", "graphics", "object"),
        [".png", ".jpg", ".jpeg", ".webp"]
    ),
    "sfx": (
        os.path.join("audio", "sfx"),
        os.path.join(SCRIPT_DIR, "media", "audio", "sfx"),
        [".mp3", ".wav", ".ogg"]
    ),
    "bgm": (
        os.path.join("audio", "bgm"),
        os.path.join(SCRIPT_DIR, "media", "audio", "bgm"),
        [".mp3", ".wav", ".ogg"]
    )
}


def parse_customload_js(file_path):
    """Parse the customload.js file and extract asset lists."""
    import codecs
    with codecs.open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Collect all assets from all chapters
    all_assets = {
        "bg": set(),
        "object": set(),
        "sfx": set(),
        "bgm": set()
    }

    # Use regex to find arrays for each asset type
    for asset_type in all_assets.keys():
        # Find all occurrences of "asset_type": [...]
        pattern = r'"{}":\s*\[(.*?)\]'.format(asset_type)
        matches = re.findall(pattern, content, re.DOTALL)

        for match in matches:
            # Extract quoted strings from the array
            items = re.findall(r'"([^"]+)"', match)
            all_assets[asset_type].update(items)

    return all_assets


def add_hardcoded_resources(all_assets):
    """Add hardcoded resources from _RESOURCESINFO in settings.js"""
    # Hardcoded assets from _RESOURCESINFO
    # bgm: 'bgm-photo'
    all_assets["bgm"].add("bgm-photo")

    # bgMenu: 'wardrobe.png' - this is a background
    all_assets["bg"].add("wardrobe")
    all_assets["bg"].add("home")

    print("\nAdded hardcoded assets from _RESOURCESINFO:")
    print("  bgm: bgm-photo")
    print("  bg: wardrobe")

    return all_assets


def find_asset_file(asset_name, source_folder, extensions):
    """Find an asset file with any of the given extensions."""
    if not os.path.exists(source_folder):
        return None

    # Try each extension
    for ext in extensions:
        file_path = os.path.join(source_folder, asset_name + ext)
        if os.path.exists(file_path):
            return file_path

    return None


def copy_assets(assets_dict):
    """Copy assets from source to destination folders."""
    stats = {
        "copied": 0,
        "skipped": 0,
        "missing": 0
    }

    for asset_type, asset_names in assets_dict.items():
        if asset_type not in ASSET_MAPPINGS:
            continue

        source_folder_name, dest_folder, extensions = ASSET_MAPPINGS[asset_type]
        source_folder = os.path.join(ASSETS_SOURCE, source_folder_name)

        print("\n=== Processing {} assets ===".format(asset_type.upper()))
        print("Source: {}".format(source_folder))
        print("Destination: {}".format(dest_folder))

        # Create destination folder if it doesn't exist
        if not os.path.exists(dest_folder):
            os.makedirs(dest_folder)

        for asset_name in sorted(asset_names):
            if not asset_name:  # Skip empty strings
                continue

            # Find the source file
            source_file = find_asset_file(asset_name, source_folder, extensions)

            if source_file is None:
                print("  Warning Missing: {} (not found in {})".format(asset_name, source_folder))
                stats["missing"] += 1
                continue

            # Destination file path
            dest_file = os.path.join(dest_folder, os.path.basename(source_file))

            # Check if file already exists and is identical
            if os.path.exists(dest_file):
                if os.path.getsize(dest_file) == os.path.getsize(source_file):
                    print("  OK Skipped: {} (already exists)".format(os.path.basename(source_file)))
                    stats["skipped"] += 1
                    continue

            # Copy the file
            try:
                shutil.copy2(source_file, dest_file)
                print("  OK Copied: {}".format(os.path.basename(source_file)))
                stats["copied"] += 1
            except Exception as e:
                print("  ERROR copying {}: {}".format(os.path.basename(source_file), e))

    return stats


def main():
    """Main execution function."""
    print("=" * 70)
    print("Asset Copy Script")
    print("=" * 70)

    # Check if customload.js exists
    if not os.path.exists(CUSTOMLOAD_PATH):
        print("Error: customload.js not found at {}".format(CUSTOMLOAD_PATH))
        return 1

    # Check if assets source folder exists
    if not os.path.exists(ASSETS_SOURCE):
        print("Error: v2-visual-novel-assets folder not found at {}".format(ASSETS_SOURCE))
        return 1

    print("\nReading: {}".format(CUSTOMLOAD_PATH))

    # Parse customload.js
    try:
        assets = parse_customload_js(CUSTOMLOAD_PATH)
    except Exception as e:
        print("Error parsing customload.js: {}".format(e))
        return 1

    # Add hardcoded resources from _RESOURCESINFO
    assets = add_hardcoded_resources(assets)

    # Print summary
    print("\nAssets to copy:")
    for asset_type, asset_list in assets.items():
        print("  {}: {} files".format(asset_type, len(asset_list)))

    # Copy assets
    stats = copy_assets(assets)

    # Print final statistics
    print("\n" + "=" * 70)
    print("Summary:")
    print("  Copied: {}".format(stats['copied']))
    print("  Skipped: {} (already exist)".format(stats['skipped']))
    print("  Missing: {} (not found in source)".format(stats['missing']))
    print("=" * 70)

    return 0


if __name__ == "__main__":
    exit(main())
