console.log(_ENGINE_VERSION+" asd");
var _LOADSCRIPTS2=[
	"../"+_ENGINE_VERSION+"/engine.js",
	_GAMESETTING._BASEPATH.text+"customload.js",
	_GAMESETTING._BASEPATH.text+"strings.en.js",
    _GAMESETTING._BASEPATH.text+"translate/chapter_list.en.js",
	_GAMESETTING._BASEPATH.text+"translate/dynamic_character.en.js",
	_GAMESETTING._BASEPATH.text+"translate/chapter1.en.js",
];

var arrLanguage = [  ]; //'jp', 'cn', 'tw', 'ru', 'kr' 
var totalChapter = 3;
var objChapterID = { 'chat1':2, 'chat2':2, 'email1':1, 'letter1':1 };

for(var j=0;j<arrLanguage.length;j++){
    // console.log(arrLanguage[j]);
    // _LOADSCRIPTS2.push(_GAMESETTING._BASEPATH.text+"strings."+arrLanguage[j]+".js");
    _LOADSCRIPTS2.push(_GAMESETTING._BASEPATH.text+"translate/dynamic_character."+arrLanguage[j]+".js");
    for(var i=1;i<=totalChapter;i++){
        _LOADSCRIPTS2.push(_GAMESETTING._BASEPATH.text+"translate/chapter"+i+"."+arrLanguage[j]+".js");

        if(objChapterID['chat' + i] != null) {
            for(var k=1;k<=objChapterID['chapter' + i];k++){
                _LOADSCRIPTS2.push(_GAMESETTING._BASEPATH.text+"translate/chapter"+i+ "_id" + k +"."+arrLanguage[j]+".js");
            }
        }

        if(objChapterID['email' + i] != null) {
            for(var l=1;l<=objChapterID['email' + i];l++){
                _LOADSCRIPTS2.push(_GAMESETTING._BASEPATH.text+"translate/chapter"+i+ "_email" + l +"."+arrLanguage[j]+".js");
            }
        }

        if(objChapterID['letter' + i] != null) {
            for(var m=1;m<=objChapterID['letter' + i];m++){
                _LOADSCRIPTS2.push(_GAMESETTING._BASEPATH.text+"translate/chapter"+i+ "_letter" + m +"."+arrLanguage[j]+".js");
            }
        }
    }
}

//ONLY FOR RUNNING ENGINE INDEX.HTML
function loadScriptsSynchronously(arr) {
    if (!arr || !arr.length) return;
    var i;
    var loadFunctions = [];
    for (i = arr.length - 1; i >= 0; --i) {
        if (i == arr.length - 1) {
            loadFunctions[i] = (function (idx) { return function () { jQuery.getScript(arr[idx], function () { }); }; })(i);
        } else {
            loadFunctions[i] = (function (idx) { return function () { jQuery.getScript(arr[idx], loadFunctions[idx + 1]); }; })(i);
        }        
    }
    console.log("loadScriptsSynchronously");
    loadFunctions[0]();
}

loadScriptsSynchronously(_LOADSCRIPTS2);


var link = document.createElement("link");
link.type = "text/css";
link.rel = "stylesheet";
link.href = "../"+_ENGINE_VERSION+"/engine.css";
document.head.appendChild(link);