compile_test_game (){
    # Function: compile engine.js
    echo "Compiling script.js ..."
     java -jar compiler.jar \
    --warning_level=QUIET \
    --js media/text/customload.js \
    --js media/text/strings.js \
    --js media/text/strings.en.js \
    --js media/text/translate/*.js \
    --js_output_file=script.js \
    --language_in=ECMASCRIPT5
    echo "Done!"
}

secure_regular (){    
    # domainlock breakout attempt info
    echo ""
    echo "Injecting Domainlock Breakout Attempt info"
    echo ""
    python inject_domainlock_breakout_info.py 'script.js'

    # global obfuscation
    echo ""
    echo "Securing by obscuring ..."
    echo ""

    javascript-obfuscator 'script.js' -o 'script.js' --config 'tools/javascript-obfuscator-dev.json'
    sed -i.bak 's/{data;}else{return;}/{}else{return;}/g' script.js
    rm *.bak

    echo ""
    echo "Securing Done!"
    echo ""
}

compile_test_game
secure_regular