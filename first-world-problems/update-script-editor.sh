(cd ../visual-novel-script-editor && git pull origin master)

# Ensure scripts folder exists
mkdir -p ./script-converter

# Copy everything except character.js
cp ../visual-novel-script-editor/character-preview.html ./character-preview.html
find ../visual-novel-script-editor/script-converter/ -type f ! -name 'characters-data.js' -exec cp {} ./script-converter/ \;

echo "✅ script-editor files copied successfully from updated visual-novel-script-editor repo"

sh update-vsix.sh

# Clean up
# rm -rf temp-repo

