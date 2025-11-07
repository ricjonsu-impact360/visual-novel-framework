compile_test_game (){
    # Function: compile engine.js
    echo "Compiling settings.js ..."
    java -jar compiler.jar \
    --warning_level=QUIET \
    --js=lib/settings.js \
    --js_output_file=settings.js \
    --language_in=ECMASCRIPT5
    echo "Done!"
}

secure_regular (){    
    # domainlock breakout attempt info
    echo ""
    echo "Injecting Domainlock Breakout Attempt info"
    echo ""
    python inject_domainlock_breakout_info.py 'settings.js'

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

compile_test_game
secure_regular