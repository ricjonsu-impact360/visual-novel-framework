#
# MarketJS Deployment System
# -----------------------------------------------------------------------
# Copyright (c) 2012 MarketJS Limited. Certain portions may come from 3rd parties and
# carry their own licensing terms and are referenced where applicable.
# -----------------------------------------------------------------------

#! /bin/bash
# Usage: bash push.sh [options]
# Example: bash push.sh -b -d (bake, then deploy)
SCRIPT_VERSION="1.1.2"
# Configurations
GIT_BRANCH="master"
LANGUAGE="en"
ENABLE_FRAMEBREAKER=false
ENABLE_COPYRIGHT=true
ENABLE_CACHE_BURST=true
ENABLE_CLOUDFRONT_INVALIDATION=false
INCLUDE_VCONSOLE=false
REMOVE_TEST_AD=true
ENGINE_VERSION=$(grep 'var _ENGINE_VERSION' lib/settings.js | sed -E 's/.*var[[:space:]]+_ENGINE_VERSION[[:space:]]*=[[:space:]]*"([^"]*)".*/\1/')

# Check if format is valid: digits.digits.digits
if [[ ! "$ENGINE_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo " Version '$ENGINE_VERSION' is not valid. Using fallback: 2.0.0"
  ENGINE_VERSION="2.0.0"
fi

echo "Engine version: $ENGINE_VERSION"

# Variables
CURRENT_DIRECTORY=${PWD}/

# # Methods
# preqa_checker(){
#     echo ""
#     echo "Running Pre-QA Checker..."
#     python ./tools/preqa_checker.py -p .
#     echo ""

#     echo ""
#     echo "Pre-QA Done!"
#     echo ""
# }

bake (){
    # Function: bake game.min.js
    echo ""
    echo "Baking ..."
    echo ""

    python build-versioning.py

    cd tools
    chmod +x bake.sh
    bash bake.sh
    cd ..

    echo ""
    echo "Baking Done!"
    echo ""
}

secure_regular (){    
    # Function: protect javascript files with regular security options (no framebreaker or copyright)
    # echo ""
    # echo "Preparing domainlock ..."
    # echo ""
    # rm domainlock.js
    # python prep_domainlock.py 'lib/game/main.js' 'domainlock.js' 'this.START_OBFUSCATION;' 'this.END_OBFUSCATION;'

    # domainlock breakout attempt info
    echo ""
    echo "Injecting Domainlock Breakout Attempt info"
    echo ""
    python inject_domainlock_breakout_info.py 'settings.js'
    python inject_domainlock_breakout_info.py 'script.js'
    
    # echo ""
    # echo "Preparing factory domainlock ..."
    # echo ""
    # prep_factory_domainlock

    # echo ""
    # echo "Injecting domainlock ..."
    # echo ""
    # python inject_domainlock.py 'domainlock.js' 'game.js' 'this.START_OBFUSCATION;' 'this.END_OBFUSCATION'

    # echo ""
    # echo "Cleaning up domainlock ..."
    # echo ""
    # rm domainlock.js

    # global obfuscation
    echo ""
    echo "Securing by obscuring ..."
    echo ""
    javascript-obfuscator 'settings.js' -o 'settings.js' --config 'tools/javascript-obfuscator-dev.json'
    sed -i.bak 's/{data;}else{return;}/{}else{return;}/g' settings.js
    rm *.bak

    javascript-obfuscator 'script.js' -o 'script.js' --config 'tools/javascript-obfuscator-dev.json'
    sed -i.bak 's/{data;}else{return;}/{}else{return;}/g' script.js
    rm *.bak

    echo ""
    echo "Securing Done!"
    echo ""
}

secure_strong (){    
    # Function: protect javascript files with strong security options
    # echo ""
    # echo "Preparing domainlock ..."
    # echo ""
    # rm domainlock.js
    # python prep_domainlock.py 'game.js' 'domainlock.js' 'this.START_OBFUSCATION;' 'this.END_OBFUSCATION;'

    if [ "$ENABLE_FRAMEBREAKER" = true ] ; 
    then
        # Inject framebreaker
        echo ""
        echo "Injecting framebreaker ..."
        echo ""
        python inject_framebreaker.py 'settings.js'
        echo ""
    fi

    if [ "$ENABLE_COPYRIGHT" = true ] ; 
    then
        # copyright info
        echo ""
        echo "Injecting Copyright info"
        echo ""
        python inject_copyright_info.py 'settings.js'
    fi

    # domainlock breakout attempt info
    echo ""
    echo "Injecting Domainlock Breakout Attempt info"
    echo ""
    python inject_domainlock_breakout_info.py 'settings.js'
    
    # echo ""
    # echo "Preparing factory domainlock ..."
    # echo ""
    # prep_factory_domainlock

    # echo ""
    # echo "Injecting domainlock ..."
    # echo ""
    # python inject_domainlock.py 'domainlock.js' 'game.js' 'this.START_OBFUSCATION;' 'this.END_OBFUSCATION'

    # echo ""
    # echo "Cleaning up domainlock ..."
    # echo ""
    # rm domainlock.js

    # global obfuscation
    echo ""
    echo "Securing by obscuring ..."
    echo ""
    javascript-obfuscator 'settings.js' -o 'settings.js' --config 'tools/javascript-obfuscator-dev.json'
    sed -i.bak 's/{data;}else{return;}/{}else{return;}/g' settings.js
    rm *.bak

    echo ""
    echo "Securing Done!"
    echo ""
}

prep_factory_domainlock(){
    # Function: prepare domainlock file for injection
    cp domainlock.js _factory/domainlock/raw.js
}

compile_test_game (){
    # Function: compile engine.js
    echo "Compiling script.js ..."
     java -jar compiler.jar \
    --warning_level=QUIET \
    --js media/text/customload.js \
    --js media/text/strings.js \
    --js media/text/strings.en.js \
    --js media/text/strings.es.js \
    --js media/text/strings.jp.js \
    --js media/text/strings.cn.js \
    --js media/text/strings.kr.js \
    --js media/text/strings.ru.js \
    --js media/text/strings.de.js \
    --js media/text/strings.nl.js \
    --js media/text/strings.zh.js \
    --js media/text/translate/*.js \
    --js_output_file=script.js \
    --language_in=ECMASCRIPT5
    echo "Done!"

    java -jar compiler.jar \
    --warning_level=QUIET \
    --js=lib/settings.js \
    --js_output_file=settings.js \
    --language_in=ECMASCRIPT5
    echo "Done!"

    # echo "Compiling engine.css for testing ..."
    # bash css-append.sh
    # bash css-minify.sh temp.css game.css
    # sed -i.bak 's/..\/..\/..\/..\/..\/..\///g' game.css
    # rm temp.css
    # rm *.bak

    echo "Done!"
}


prep_production (){
    # Function: prepare files for production
    echo "Zipping up media files for target language ..."

    bash zip-media-folder.sh $1
    echo "Done ..."

    echo "Create basic index.html ..."
    cp dev.html index.html
    echo "Done ..."

    echo "Cleaning up paths ..."
    # Clean CSS paths   
    # sed -i.bak 's/..\/1.0.0\/engine.css/game.css/g' index.html

    # Clean JS paths
    sed -n '/lib\/settings.js/!p' index.html > temp && mv temp index.html    
    sed -n '/glue\/jquery\/jquery-3.2.1.min.js/!p' index.html > temp && mv temp index.html    
    sed -i.bak 's/glue\/load\/load.js/settings.js/g' index.html    
    sed -i.bak 's/<!-- load css -->/<link rel="stylesheet" type="text\/css" href="..\/'$ENGINE_VERSION'\/engine.css">/g' index.html
    sed -i.bak 's/<!-- load script   -->/<script type="text\/javascript" src="script.js"><\/script>/g' index.html
    sed -i.bak 's/<!-- load engine   -->/<script type="text\/javascript" src="..\/'$ENGINE_VERSION'\/engine.js"><\/script>/g' index.html

    # Remove temp files
    echo "Removing temp files ..."
    rm *.bak
    rm temp
    echo "Done!"

    # Transfer to _factory
    # Make 2 versions of index.html (raw and customized)
    # Raw
    sed '/<!-- SECTION GENERATED BY CODE -->/,/<!-- END OF SECTION GENERATED BY CODE -->/d' index.html > _factory/index/raw.html
    # Customized
    cp index.html _factory/index/custom.html
    
    if [ "$REMOVE_TEST_AD" = true ] ; 
    then
        sed '/<!-- AdTest-MobileAdInGamePreroll -->/,/<!-- EndOfAdTest-MobileAdInGamePreroll -->/d' index.html > index.html.temp
        mv index.html.temp index.html
    fi

    # Remove temp files
    echo "Removing game.min.js ..."
    rm game.min.js
    echo "Done!"
}

deploy (){
    # Function: deploy to S3
    echo ""
    echo "Deploying $1..."
    echo "Language: $2"
    echo ""

    python boto-s3-upload.py -l $2 $1

    echo ""
    echo "Deploying Done!"
    echo ""

    if [ "$ENABLE_CLOUDFRONT_INVALIDATION" = true ] ; 
    then
        echo ""
        echo "Clearing cloudfront cache ..."
        echo ""
        python cloudfront_invalidate_cache.py $2
    fi
}

gitpush (){
    # Function: push commits via git
    git add --all
    git commit -m "$*"
    git push origin $GIT_BRANCH
}

compress_build (){
    # Function: Compress build
    echo "Compressing build ..."
    echo ""
    bash compress.sh
    echo "Compressing Done!"
    echo ""
}

inject_burst_cache_version_tag(){
    # Function: inject version tag to burst cache in index.html
    if [ "$ENABLE_CACHE_BURST" = true ] ; 
    then
        # Inject cache burst versioning tag
        echo ""
        echo "Injecting cache burst versioning tag ..."
        echo ""
        CACHE_BURST_VERSION_TAG="v=$(date +%s)"
        echo "Injecting the version into index.html ..."
        sed -i.bak 's/settings.js/settings.js?'$CACHE_BURST_VERSION_TAG'/g' index.html
        # sed -i.bak 's/game.css/game.css?'$CACHE_BURST_VERSION_TAG'/g' index.html
        rm *.bak
        echo "Done!"
        echo ""
    fi
}

print_version_numbers(){
    # Function: Prints the version numbers of the push script and the compiled build
    echo ""
    echo "Push script version: v$SCRIPT_VERSION"
    python build-versioning.py print
    echo "Done!"
    echo ""
}

update_version_number() {
    # Function: Update the version number via the build-versioning.py script
    echo ""
    echo "Updating version number ..."
    python build-versioning.py $*
    echo "Done!"
    echo ""
}

usage() {
    # Function: Print a help message.
    echo "Usage: bash $0 [options]" 1>&2 
    
    echo "Options"
    echo -e "\t -p \t \t Pre-QA to check for errors and warnings"
    echo -e "\t -b \t \t Bake and make compiled build files"
    echo -e "\t -l [option] \t Select a build language by code"
        echo -e "\t \t \t Option - language code: en, jp, kr, zh, de, es, etc..."
        echo -e "\t \t \t Example: bash $0 -l en" 
        echo
    echo -e "\t -a \t \t Upload all files"
    echo -e "\t -n \t \t Upload new (recent) files up to 12 hours"
    echo -e "\t -g \t \t Add, commit, and push to remote repo (origin $GIT_BRANCH)"
    echo -e "\t -c \t \t Compress build files"
    echo -e "\t -v \t \t Print version number of this build script and the version number of the compiled build"
    echo -e "\t -u [option] \t Update build version number"
        echo -e "\t \t \t Option - update type: major, minor, patch, or reset"
        echo -e "\t \t \t \t major - Update major version number, e.g. from 1.0.0 to 2.0.0 for significant changes that break backward compatibility"
        echo -e "\t \t \t \t minor - Update minor version number, e.g. from 1.0.0 to 1.1.0 for backward compatible new features"
        echo -e "\t \t \t \t patch - Update patch version number, e.g. from 1.0.0 to 1.0.1 for backward compatible bug fixes"
        echo -e "\t \t \t \t reset - Reset version number to 1.0.0"
        echo -e "\t \t \t Example: bash $0 -u patch"
        echo
    echo -e "\t -h \t \t Print this help message"
    echo "Working example (copy paste directly): bash $0 -b -l en -a -g 'somefix'"
}

exit_abnormal() {
    # Function: Exit with error.
    usage
    exit 1
}

# Options lists
optstring=":l:u:hbnag:cvp"

# No arguments given
if [ $# -eq 0 ]
then
    usage
fi

# Execute Prioritized Options
while getopts "$optstring" opt
do
   case $opt in
    u)
        update_version_number ${OPTARG}
        ;;
    l)
        LANGUAGE=${OPTARG}
        echo "language to use:" ${LANGUAGE}
        ;;
    :)
        echo "Error: -${OPTARG} requires an argument."
        exit_abnormal
        ;;
    \?)
        echo "Invalid option: -$OPTARG" >&2
        exit_abnormal
        ;;
   esac
done

# Execute other options
OPTIND=1 # Reset as getopts has been used previously in the shell.
while getopts "$optstring" opt
do
  case $opt in
    h)
        usage
      ;;
    
    b)
        # preqa_checker
        bake
        prep_production ${LANGUAGE}
        compile_test_game
        # bash packerplugin_run.sh $3
        secure_regular
        # secure_strong
        # inject_burst_cache_version_tag
      ;;
    p)
        # preqa_checker
      ;;
    n)
        deploy --new ${LANGUAGE}
      ;;
    a)
        deploy --all ${LANGUAGE}
      ;;
    g)
        gitpush ${OPTARG}
      ;;
    c)
        compress_build
      ;;
    v)
        print_version_numbers
      ;;
    :)
        echo "Error: -${OPTARG} requires an argument."
        exit_abnormal
      ;;
    \?)
        echo "Invalid option: -$OPTARG" >&2
        exit_abnormal
      ;;
  esac
done