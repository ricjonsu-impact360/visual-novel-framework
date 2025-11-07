//script editor version 1.0.65
var cacheCounter=1;
var baseURL="http://localhost:8888/";
var pageName="dev.html";
if(typeof(window)==="undefined"){
    const path = require('path');
    const fullPath=__dirname;
    var dirPath = path.dirname(fullPath);    
    var arrPath=dirPath.toString().split('\\');    

    // If arrPath is forward slash based (i.e mac based)
    if(dirPath.indexOf("/")!=-1){
        // console.log("we are most likely Mac")
        arrPath = dirPath.toString().split('/');
    }

    const gameName =arrPath[arrPath.length-1];
    
    var fs = require('fs');
    // Get the file paths (assuming arguments are passed)
    const typeProcess = process.argv[2];
    const inputFilePath = process.argv[3];
    const outputFilePath = process.argv[4];
    const outputFilePathCustomLoad = process.argv[5];

    readFile("../lib/settings.js","_ENGINE_VERSION",function(obj,data){
        convertFiles.engineVersion=obj;
    });

    if (typeProcess=="processScript") {
         fs.mkdir("../media/text/translate", { recursive: true }, (err) => {
            if (err) throw err;
          });
        processScript(inputFilePath, outputFilePath);
    }
    else if(typeProcess=="processSpriterData") {
        processSpriterData(inputFilePath, outputFilePath);
    }
    else {
        console.error('Please provide input and output file paths.');
    }

    function exportFile(path,data){        
        var outputStream = fs.createWriteStream(path);
        outputStream.write(data);
        outputStream.end();
    }
    function readFile(path,varName,functComplete, isCache=true){    
        var inputStreamCharacterData=null;
        if(isCache==true){
            inputStreamCharacterData = fs.createReadStream(path+"?"+cacheCounter);
        }else inputStreamCharacterData = fs.createReadStream(path);
       
       cacheCounter++;

       var dataRead="";
       inputStreamCharacterData.on('error', function(err) {        
        if(functComplete)functComplete(null);
          return;
        });
       inputStreamCharacterData.on('data',function(chunkCharData){
          dataRead=dataRead.concat(chunkCharData.toString());      
          
       });
       inputStreamCharacterData.on('end',function(){
          if(varName!=null){
             var dataStr=dataRead;            
             var getObject = new Function(dataStr + "; return "+varName+";");
             var obj=getObject();
             if(functComplete)functComplete(obj,dataStr);
          }else if(functComplete)functComplete(dataRead);
          
       });
    }

    function processSpriterData(inputFilePath, outputFilePath){
        readFile("characters-data.js","charData",function(obj,data){
            var spriterData=convertFiles.createSpriterData(obj);
            var data2=JSON.stringify(spriterData,null,1); 
            // removing {} at first char and the end 
            data2=data2.substr(1).substr(0,data2.length-2);  
            readFile("../lib/settings.js","_GAMESETTING",function(dataSetting,dataAll){  
                var merge=convertFiles.merge(dataSetting["_DATAGAME"],spriterData);                
                var data1=dataAll.split("//CODE_GENERATED");
                var data3=dataAll.split("//END_GENERATED");
                var dataFinal=data1[0].concat("//CODE_GENERATED \n",data2,"\n //END_GENERATED",data3[1]);
                
                exportFile('../lib/settings.js',dataFinal);
            });
        });
    }

    function logGTL(){
        console.log("*** Generated Test Links (GTLs) ***");
        convertFiles.arrGTLSceneID.sort((a, b) => a.seq - b.seq);

        for(var i=0;i<convertFiles.arrGTLSceneID.length;i++){
            var numChapter = convertFiles.arrGTLSceneID[i].chapter.match(/\d+(\.\d+)?/g).map(Number);
            var gtl=baseURL+gameName+"/"+pageName+"?nocache&directLoadChapter="+numChapter+"&startFromSceneID="+(convertFiles.arrGTLSceneID[i].sceneID+1);
            console.log(convertFiles.arrGTLSceneID[i].seq+" : "+convertFiles.arrGTLSceneID[i].text);
            console.log(gtl);            
            console.log("=========================");
        }
    }

    // Function to read a file line by line and output to a new file
    function processScript(inputFilePath, outputFilePath) {
        fs.readdir(inputFilePath, (err, files) => {   
            if(files == null||(files!=null&&files.length==0)){
                console.warn("There's no .vnscript file. Please create the file in media/text/scripts")
            }
            else{          
                var totalFiles=files.length;  
                var totalScriptProcessed=0;  
                files.forEach(file => {    
                    //revert                       
                    // if(file!="chapter41.en.vnscript")return;

                    var inputStreamCharacterData = fs.createReadStream("characters-data.js");
                    var splitFileName=file.split(".")[0];
                    
                    var inputStream = fs.createReadStream(inputFilePath+file);
                    var outputStream = fs.createWriteStream(outputFilePath+splitFileName+".en.js");
                    var completeText="";
                    inputStream.on('data', function (chunk) {
                        completeText+=chunk;
                    });
                    inputStream.on('end', function () {
                        // var arrPath=inputStream.path.split("/");
                        // var fileName=arrPath[arrPath.length-1];
                        outputStream.write(convertFiles.init(file,completeText.toString()));                    
                        totalScriptProcessed++;
                        if(totalScriptProcessed==totalFiles){                        
                            //export media/text/customload.js
                            var dataCustomLoad=convertFiles.exportCustomLoad();  
                            exportFile(outputFilePathCustomLoad+"customload.js",dataCustomLoad);   

                            logGTL();
                            //export characters-data.js
                            // readFile("characters-data.js",null,function(data){                            

                            //     var dataChar=convertFiles.exportCharData(data.toString());                                                        
                            //     exportFile("characters-data.js",dataChar);
                            // }); 

                            //export media/text/translate/dynamic_characters.en.js                       
                            readFile("../media/text/translate/dynamic_character.en.js",null,function(data){      

                                var _LANG={en:{}};
                                if(data!=null)eval(data);
                                else{
                                    _LANG["en"]["dynamic_character"]={};
                                }
                                var dataObj=_LANG["en"]["dynamic_character"];        
                                
                                // var data1=data.split('_LANG["en"]["dynamic_character"]={');
                                var data3=convertFiles.createDynamicCharacter(dataObj);    
                                var dataFinal="".concat('_LANG["en"]["dynamic_character"]=',JSON.stringify(data3,null,1),';');            
                                exportFile('../media/text/translate/dynamic_character.en.js',dataFinal);
                            }.bind(this),false);      
                        }
                    });
                });     
            }       
        });
    }
}

var convertFiles={
    engineVersion:"0",
    charactersData:{},
    charactersDataBeforeChoice:{},
    sceneDataBeforeChoice:{},
    objectData:[],
    singleParticleData:[],
    particleData:null,
    currentBG:{name:""},
    currentBGM:{name:"default"},
    currentOverlay:"none",
    splitScript:[],
    sceneData:[],
    charName:[],
    currentScene:{sceneID:0, char:[],charTalk:"none",text:""},
    bolEmptyLine:false,
    languageCode:"en",
    arrFiles:[],
    phpFile:"script-editor.php",
    //var for choices
    numSceneChoice:0, //sceneID where the option show up
    dataOption:{}, //saving option sceneID and cost
    numSceneEndChoices:[], //mark sceneID on the end of choice to insert linkSceneID
    dataJumpTo:{},
    dataVariable:[],
    charWalkOut:[],
    dynamicWords:[],
    scenePropertiesSettings:[],

    customLoadData:{},
    progressBarData:{},
    tempObject:[],
    defaultOutfit:{
        girl:{
            "skin":"skin-fair",
            "face":"face-doe-brown-eye",
            "hair":"hair-bob-bangs-brown",
            "top":"top-bellsleeve-yellow",
            "bottom":"bottom-aline-skirt-white",
            "shoes":"shoes-boot-heel-white"            
        },
        boy:{
            "skin":"skin-fair",
            "face":"face-almond-brown-eye",
            "hair":"hair-buzz-cut-black",
            "top":"top-none",
            "bottom":"bottom-cropped-jeans-blue",
            "shoes":"shoes-boots-black"
        }
    },
    noneNameTag:"",

    arrGTLSceneID:[],

    lastSceneFormat:"",
    lastAnimEffect:"",
    isComments:false,
    
    //if scene is inside option/check any function {}. used for reset scene when going back to main branch or determine lastSceneFormat in particle/object
    // set to false case "}"
    inOption:false, 

    //if scene is inside option/check any function {}. used to determine when it's the first choice or {} to set linkSceneID
    // set to false on next scene after } when inOption = false
    inCheck:false, 

    checkDoubleSlash:false,
    bolGTL:false,
    currentLine:1,

    isTesting:false, //to enable/disable the log on build. false will show all dialog, true will limit it based on var testLine
    testLine:{min:220,max:250, chapter:-1}, //min-max are the lines number in vnscript. e.g min 200 max 300 chapter 3, the log will only show line 200-300 in chapter 3

    init:function(filename,data){  
        var str=filename.split(".")[0];
        return this.doneLoadScript(data,str); 
    },

    updateObjectInArray:function(arr,key,value,objUpdate){
        var idxObj=-1;
        for(i=0;i<key.length;i++){
            var idxK=this.findIndexArrayObject(arr,key[i],value[i]);            
            if(idxObj>=0){
                if(idxObj!=idxK){
                    idxObj=-1;
                    break;
                }
                else idxObj=idxK;
            }else if(idxK>=0)idxObj=idxK;
        }
        if(idxObj==-1){
            arr.push(objUpdate);
        }else{
            arr[idxObj]=this.merge(arr[idxObj],objUpdate);
        }
    },

    merge: function( original, extended ) {
        for( var key in extended ) {
            var ext = extended[key];
            if(
                typeof(ext) != 'object' ||
                ext === null
            ) {
                original[key] = ext;
            }
            else {
                if( !original[key] || typeof(original[key]) != 'object' ) {
                    original[key] = (ext instanceof Array) ? [] : {};
                }
                this.merge( original[key], ext );
            }
        }
        return original;
    },

    findIndexArrayObject:function(arr,key,value,isLowerCase){
        if(isLowerCase==true)
            return arr.findIndex(obj => obj[key].toLowerCase() === value.toLowerCase());
        else 
            return arr.findIndex(obj => obj[key] === value);
    },

    copy: function( object ) {
        if(
            !object || typeof(object) != 'object'       
            ) {
            return object;
        }
        else if( object instanceof Array ) {
             var c = [];
             for( var i = 0, l = object.length; i < l; i++) {
                c[i] = this.copy(object[i]);
            }
            return c;
        }
        else {
         var c = {};
         for( var i in object ) {
            c[i] = this.copy(object[i]);            
        }
        return c;
        }
    },

    exportCharData:function(data){
        // eval(data);
        // console.log(charData);
        var getObject = new Function(data + "; return charData;");
        var obj=getObject();
        var data3=convertFiles.createCharactersData(obj);                                
        var dataVar='var charData='.concat(JSON.stringify(data3,null,1),';');
        return dataVar;        
    },
    exportScript:function(jsonData, name, dialog,space,varName){
        var dataStr = JSON.stringify(jsonData, null, space);  
        var data='_LANG["en"]["'.concat(varName,'"]=',dataStr,';');
        return data;        
    },
    exportMultipleScript:function(result){
        //result=[{obj:JSON_DATA,title:chapter}];
        var arrFiles=[];
        var space=1;
        
        for(var a=0;a<result.length;a++){    
           var jsonData=result[a].obj;
           let dataStr = JSON.stringify(jsonData, null, space);   
           var name=result[a].title;
           var str='_LANG["'.concat(this.languageCode,'"]["',name,'"]=',dataStr,';');

           let exportFileDefaultName = name.toLowerCase().concat('.',this.languageCode, '.js');
            // var decodedData = Utilities.base64Decode(Utilities.base64Encode(str));
            var blob=Utilities.newBlob(str, 'text/javascript', exportFileDefaultName);  
            arrFiles.push(blob);

        }
        var zipBlob = Utilities.zip(arrFiles, "download.zip");
        var bytes = zipBlob.getBytes();
        var base64String = Utilities.base64Encode(bytes);
        var dataURL = 'data:' + zipBlob.getContentType() + ';base64,' + base64String;

        var linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataURL);
        linkElement.setAttribute('download', "download.zip");
        linkElement.click();
    },
    doneLoadScript:function(text,nameFile){
        
       this.script=text;              

       this.splitScript=this.script.split(/(?:\r\n|\r|\n)/g);
        // console.log(text);
        // console.log(this.splitScript);
        var testScript=0;
        // var endTestScript=133;
        var endTestScript=this.splitScript.length;
        for(var i=testScript;i<endTestScript;i++){
            this.readScene(this.splitScript[i],i,nameFile);
        }

        this.setLinkSceneID();
        // jsonData, name, dialog,space,varName
        
        var data=this.exportScript(this.sceneData,nameFile,"download",1,this.capitalizeFirstLetter(nameFile));
        this.resetAllSceneData();        
        return data;
    },

    exportCustomLoad:function(){        
        var space=1;
        var dataStr = JSON.stringify(this.arrCustomLoad, null, space);  
        var data='var _CUSTOMLOAD={Chapter:'.concat(dataStr,'};');
        return data;
    },
    arrCustomLoad:[{}],
    resetAllSceneData:function(){             
        if(this.customLoadData.duTheme==null)this.customLoadData.duTheme=["Amy"];
        this.arrCustomLoad.push(this.customLoadData);
        
        this.animEffect=null;
        this.particleData=null;
        this.singleParticleData=[];
        this.tempObject=[];
         this.sceneData=[];
         this.charactersData={};
         this.currentBG={name:""};
         this.currentBGM={name:"default"};
         this.splitScript=[];        
         this.charName=[];
         this.scenePropertiesSettings=[];
         this.dataJumpTo={};
         this.dataVariable=[];    
         this.progressBarData={};     
         this.currentScene={sceneID:0, char:[],charTalk:"none",text:""};
         this.customLoadData={
            bg:[],
            char:[],
            object:[],
            sfx:[],
            bgm:[],
            duTheme:["Amy"],
            outfit:[],
            voiceover:[]
         };
    },

    resetCustomLoad:function(){
         this.arrCustomLoad=[{}];
    },

    createSpriterData:function(oriObj){
        
        var neutral_boy=[];
        var neutral_girl=[];
        var dynamic_name=[];
        var objSpriterData=[];
        for (key in oriObj){
            var obj=oriObj[key];
            if(obj.type=="neutral_girl"||obj.type=="neutral_boy"||obj.type=="dynamic_character"){
                var isGirl=null;
                var isBoy=null;
                if(obj.hasOwnProperty("girl")&&(typeof(obj.girl)==="string"||(typeof(obj.girl)==="object"&&obj.girl.hasOwnProperty("skin")&&obj.girl["skin"]!="INSERT_ITEM"))){
                    isGirl=true;
                }
                if(obj.hasOwnProperty("boy")&&(typeof(obj.boy)==="string"||(typeof(obj.boy)==="object"&&obj.boy.hasOwnProperty("skin")&&obj.boy["skin"]!="INSERT_ITEM"))){
                    isBoy=true;
                }
                
                if(isGirl==null&&isBoy==null){
                    this.showError(key+" need spriterData",null);
                }else if(obj.type=="dynamic_character"){
                    dynamic_name.push(this.capitalizeFirstLetter(key.replace("_"," ")));
                }else if(obj.type=="neutral_girl"){
                    neutral_girl.push(this.capitalizeFirstLetter(key.replace("_"," ")))
                    if(oriObj[key].hasOwnProperty("boy")){
                        delete oriObj[key].boy;
                    }
                }else if(obj.type=="neutral_boy"){
                    neutral_boy.push(this.capitalizeFirstLetter(key.replace("_"," ")));
                    if(oriObj[key].hasOwnProperty("girl")){
                        delete oriObj[key].girl;
                    }
                }
            }else{
                //outfit
                if(obj.hasOwnProperty("boy")&&(typeof(obj.boy)==="string"||(typeof(obj.boy)==="object"&&obj.boy.hasOwnProperty("skin")&&obj.boy["skin"]=="INSERT_ITEM"))){
                    if(typeof(obj.boy)==="object"&&obj.boy["skin"]=="INSERT_ITEM"){
                         delete oriObj[key].boy;
                    }else if(typeof(obj.boy)==="string"&&obj.boy=="INSERT_NAME"){
                        delete oriObj[key].boy;
                    }
                }
                else if(obj.hasOwnProperty("girl")&&(typeof(obj.girl)==="string"||(typeof(obj.girl)==="object"&&obj.girl.hasOwnProperty("skin")&&obj.girl["skin"]=="INSERT_ITEM"))){
                    if(typeof(obj.girl)==="object"&&obj.girl["skin"]=="INSERT_ITEM"){
                         delete oriObj[key].girl;
                    }else if(typeof(obj.girl)==="string"&&obj.girl=="INSERT_NAME"){
                        delete oriObj[key].girl;
                    }
                }
            }
        };

        Object.keys(oriObj).forEach(key => { 
            delete oriObj[key].type; 
            if(key.indexOf("_")>=0){
                var cp=this.copy(oriObj[key]);
                delete oriObj[key];

                oriObj[key.replace("_","")]=cp;
            }
        });

        var obj={"spriterData":oriObj,"neutral_boy":neutral_boy,"neutral_girl":neutral_girl,"dynamic_name":dynamic_name};

        if(JSON.stringify(obj).indexOf("INSERT_ITEM")>=0)    {
            this.showError("new character, please check script-converter/characters-data.js and change INSERT_ITEM",null);
        }else if(JSON.stringify(obj).indexOf("INSERT_NAME")>=0)    {
            this.showError("new character, please check script-converter/characters-data.js and change INSERT_NAME",null);
        }   
        return obj;
    },
    //create characters-data.js
    createCharactersData:function(oriObj){
        var spriterData=[];
        var dataExport={};
        
        for(i=1;i<this.arrCustomLoad.length;i++){            
            if(!this.arrCustomLoad[i].character||(this.arrCustomLoad[i].character&&this.arrCustomLoad[i].character.length<1))this.showError("There's no character detected.",null);

            var arr=(this.arrCustomLoad[i].character)?this.arrCustomLoad[i].character:[];
            var arrDressup=(this.arrCustomLoad[i].duTheme)?this.arrCustomLoad[i].duTheme:["Amy"];
            var arrOutfit=(this.arrCustomLoad[i].outfit)?this.arrCustomLoad[i].outfit:[];
            var maxIdx=(arr.length>arrDressup.length)?arr.length:arrDressup.length;
            if(arrOutfit.length>maxIdx)maxIdx=arrOutfit.length;
            
            for(j=0;j<maxIdx;j++){     

                if(j<arr.length&&spriterData.indexOf(arr[j])==-1){                    
                    spriterData.push(arr[j]);
                    var lowerName=arr[j].toLowerCase().replace(" ","_");                    
                    if(parseInt(this.engineVersion.substr(0,1))>=2){
                        dataExport[lowerName]={type:"dynamic_character",bgName:"#ffffff",textName:"#000000",outlineName:"#000000",girl:this.copy(this.defaultOutfit.girl),
                            boy:this.copy(this.defaultOutfit.boy)
                        }; 
                    }else if(this.engineVersion.substr(0,1)=="1"){
                        dataExport[lowerName]={type:"dynamic_character",bgName:"#ffffff",textName:"#000000",outlineName:"#000000",girl:"INSERT_NAME",boy:"INSERT_NAME"}; 
                    }
                }

                if(j<arrDressup.length&&spriterData.indexOf(arrDressup[j])==-1){                    
                    spriterData.push(arrDressup[j]);
                    var lowerName=arrDressup[j].toLowerCase().replace(" ","");
                    if(parseInt(this.engineVersion.substr(0,1))>=2){
                        dataExport[lowerName]={type:"outfit",bgName:"#ffffff",textName:"#000000",outlineName:"#000000",girl:this.copy(this.defaultOutfit.girl),
                            boy:this.copy(this.defaultOutfit.boy)};  
                    }else if(this.engineVersion.substr(0,1)=="1"){
                        dataExport[lowerName]={type:"outfit",bgName:"#ffffff",textName:"#000000",outlineName:"#000000",girl:"INSERT_NAME",boy:"INSERT_NAME"}; 
                    }                  
                }

                if(j<arrOutfit.length&&spriterData.indexOf(arrOutfit[j])==-1){                    
                    spriterData.push(arrOutfit[j]);
                    var lowerName=arrOutfit[j].toLowerCase().replace(" ","");
                    if(parseInt(this.engineVersion.substr(0,1))>=2){
                        dataExport[lowerName]={type:"outfit",bgName:"#ffffff",textName:"#000000",outlineName:"#000000",girl:this.copy(this.defaultOutfit.girl),
                            boy:this.copy(this.defaultOutfit.boy)};  
                    }
                    //1.0.5 can't change outfit
                    // else if(this.engineVersion.substr(0,1)=="1"){
                    //     dataExport[lowerName]={type:"outfit",bgName:"#000000",girl:"INSERT_NAME",boy:"INSERT_NAME"}; 
                    // }                  
                }
            }
        }               
        
        dataExport=this.merge(dataExport,oriObj);  
        //add checking new data

        // if(JSON.stringify(dataExport).indexOf("INSERT_ITEM")>=0)    {
        //     this.showError("new character, please check script-converter/characters-data.js and change INSERT_ITEM",null);
        // }else if(JSON.stringify(dataExport).indexOf("INSERT_NAME")>=0)    {
        //     this.showError("new character, please check script-converter/characters-data.js and change INSERT_NAME",null);
        // }     
        return dataExport;         
    },

    //create dynamic_character
    createDynamicCharacter:function(oriObj){
        var spriterData=[];
        var dataExport={};
        for(i=0;i<this.dynamicWords.length;i++){   
            if(!dataExport[this.dynamicWords[i]]){
                dataExport[this.dynamicWords[i]]={
                    boy:this.dynamicWords[i],
                    girl:"INSERT_WORD"
                };         
            }          
        }               
        // dynamicWords
        dataExport=this.merge(dataExport,oriObj);    
        if(JSON.stringify(dataExport).indexOf("INSERT_WORD")>=0)    {
            this.showError("new dynamic words, please check media/text/translate/dynamic_character.en.js and change INSERT_WORD",null);
        }
        
        return dataExport;         
    },

    changeCharProp:function (charName,prop,value) {         
        for(var i=0;i<this.currentScene.char.length;i++){
            if(this.currentScene.char[i].name==charName){
                this.currentScene.char[i][prop]=this.setPropertiesValue(value);                                
                break;                
            }
        }
    },
    setDefaultScene:function(isForce=false){
        if(this.currentScene.char==null||this.currentScene.char.length==0||isForce==true)      {
            this.currentScene.char=[];
            
            // if((this.inOption==false&&this.lastSceneFormat=="choice")||this.isFirstSceneOnBranch==true){                
            //     for(var i in this.sceneDataBeforeChoice.char){
            //         var checkChar=this.sceneDataBeforeChoice.char[i];

            //         if (checkChar!=null&&checkChar.hasOwnProperty("anim_delay")) {  
            //             delete checkChar["anim_delay"];
            //         }
            //         if (checkChar!=null&&checkChar.hasOwnProperty("animSpeed")) {  
            //             delete checkChar["animSpeed"];
            //         }
            //         this.currentScene.char.push(this.copy(checkChar));   
            //     }      
            //     this.charactersData=this.copy(this.sceneDataBeforeChoice.char);                                      

            //     this.currentScene.bg=this.copy(this.sceneDataBeforeChoice.bg);                

            //     this.currentBGM=this.copy(this.sceneDataBeforeChoice.bgm);
            //     this.currentScene.bgm=this.copy(this.currentBGM);                
            //     this.isFirstSceneOnBranch=false;
            // }else{
                
            for(var i in this.charactersData){
                if (this.charactersData!=null&&this.charactersData[i].hasOwnProperty("anim_delay")) {  
                    delete this.charactersData[i]["anim_delay"];
                }
                if (this.charactersData!=null&&this.charactersData[i].hasOwnProperty("animSpeed")) {  
                    delete this.charactersData[i]["animSpeed"];
                }
                
                this.currentScene.char.push(this.copy(this.charactersData[i]));   
            }     
            // }       
        }
        if(this.currentScene.charTalk==null||isForce==true){
            this.currentScene.charTalk="none";            
        }
        if(this.currentScene.bg==null||isForce==true){
            this.currentScene.bg=this.copy(this.currentBG);            
        }
        if(this.currentScene.bgm==null||isForce==true){
            this.currentScene.bgm=this.copy(this.currentBGM);            
        }
        if(this.currentScene.overlayType==null&&this.currentOverlay!=null&&this.currentOverlay.toLowerCase()!="none"){
            this.currentScene.overlayType=this.copy(this.currentOverlay);            
        }
        if(this.currentScene.text==null){
            this.currentScene.text="";            
        }
    },
    createNewScene:function(fillDefault){        
        
        // console.log(this.currentScene);          
        if(this.animEffect&&this.currentScene.hasOwnProperty("animEffect")==false&&this.currentScene.hasOwnProperty("linkSceneID")==false){            
            this.currentScene.animEffect=this.copy(this.animEffect);            
        }

        if(this.progressBarData){
            
            for(progressBar in this.progressBarData){
                var obj=this.progressBarData[progressBar];
                if(obj.show==true){
                    if(this.currentScene.progressBar==null)this.currentScene.progressBar=[];
                    var objCopy=this.copy(obj);
                    delete objCopy.show;
                    this.currentScene.progressBar.push(objCopy);                    
                }
            }
        }

        if(this.tempObject&&this.tempObject.length>0){
            if(this.currentScene.object==null)this.currentScene.object=[];
            for(var j=0;j<this.tempObject.length;j++){
                var idxObjectID=this.findIndexArrayObject(this.currentScene.object,"objectID",this.tempObject[j].objectID,false);
                var copyTempObject=this.copy(this.tempObject[j]);
                if(idxObjectID==-1)//new object
                {
                    //update id number
                    copyTempObject.id=this.currentScene.object.length;
                    this.currentScene.object.push(copyTempObject);
                }
                else //found same object in scene, merge properties
                {
                    for(objK in this.currentScene.object[idxObjectID]){
                        if(copyTempObject[objK]==null)copyTempObject[objK]=this.currentScene.object[idxObjectID][objK];                        
                    }
                    copyTempObject.id=idxObjectID;
                    this.currentScene.object[idxObjectID]=copyTempObject; //fill with the mergedCopy
                }
            }
            // console.log("merge",this.currentScene.sceneID,this.tempObject);
            // this.currentScene.object=this.merge(this.copy(this.tempObject),this.currentScene.object);
            // console.log("hasilmerge",this.currentScene.sceneID,this.currentScene.object);
        }

        if(this.particleData&&this.currentScene.particle==null){
            this.currentScene.particle=this.copy(this.particleData);            
        }
              
        if(this.singleParticleData.length>0){
            
            for(i=0;i<this.singleParticleData.length;i++){
                
                if(this.singleParticleData[i].persist=="true"){
                    if(this.currentScene.singleParticle==null)this.currentScene.singleParticle=[];
                    var idxObj=this.findIndexArrayObject(this.currentScene.singleParticle,"objectID",this.singleParticleData[i].objectID);   
                    if(idxObj==-1){                        
                        var objSingle=this.copy(this.singleParticleData[i]);
                        delete objSingle.persist;
                        this.currentScene.singleParticle.push(objSingle);
                    }
                }
            }
            
        }

        this.currentScene=this.sortSceneData(this.currentScene);
        this.sceneData.push(this.copy(this.currentScene));
        this.currentScene={char:[],charTalk:"none",text:""};
        this.currentScene.sceneID=this.sceneData.length;
        this.bolEmptyLine=true;  
       
        if(fillDefault==true){
            this.setDefaultScene();        
           
        }
        
    },

    sortSceneData:function(obj){        
        var arr=["sceneID","charTalk","nameTag","text","bubbleType","tweenIn","tweenOut","bubbleOffsetY","textFontSize","voice_over","text_delay","progressBar","windowBoxing","toastBox","reward","option","variable","linkSceneID","char","bg","bgm","sfx","sfxText","object","animEffect","particle","singleParticle","overlayType"];
        var sortedA={};
        arr.forEach(function(key) {
            if (obj.hasOwnProperty(key)) {  // Check if 'a' has the key
                sortedA[key] = obj[key];
            }
        });
        return sortedA;
     },
    showError:function(text,line){
         console.error(line+1,text);
    },
    counterTest:0,
    testingLog:function(lineID,text){
        
        if(this.currentLine>=lineID-1&&this.currentLine<=lineID+1){
            this.counterTest++;
            console.log(this.currentScene.sceneID,"counter",this.counterTest,text);
        }

    },
    setLinkSceneID:function(){
        //check dataJumpTo
        for(obj in this.dataJumpTo){
            var data=this.dataJumpTo[obj];
            console.log(data);
            if(data.to==-1){
                this.showError("Branch "+obj+" not found. Please add: CONTINUE. "+obj,null);
            }else{
                for(i=0;i<data.from.length;i++){
                    var sceneID=data.from[i];
                    this.sceneData[sceneID].linkSceneID=data.to;                    
                }
            }
        }
        for(obj in this.dataVariable){
            var data=this.dataVariable[obj];            
            var sceneID=data.sceneID;
            var objVar=this.copy(data);
            delete objVar.sceneID;
            if(this.sceneData[sceneID].variable==null)this.sceneData[sceneID].variable=[];
            this.sceneData[sceneID].variable.push(objVar);    
        }
    },
   
    readScene:function (sceneText,line,nameFile) {     
        this.currentLine=line;
        this.fileName=nameFile;
        if(this.customLoadData.chapterID==null)this.customLoadData.chapterID=this.capitalizeFirstLetter(nameFile);
        
        sceneText=sceneText.replace(/^\s+/, "");
        
        var firstWord=(sceneText.indexOf(" ")>0)?sceneText.substr(0, sceneText.indexOf(" ")):sceneText;
         if(firstWord=="//"||firstWord.substr(0,2)=="//"){
            if(sceneText.toLowerCase().indexOf("gtl")>=0){    
                var seq=0;
                if(firstWord.length>5)seq=parseInt(firstWord.substr(5));

                this.arrGTLSceneID.push({chapter:nameFile,sceneID:this.currentScene.sceneID,seq:seq});
                this.bolGTL=true;
            }
            else if(firstWord=="//")return;
         }
         //remove comment line
        sceneText = sceneText.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").trim();
        if(this.lastSceneFormat==""&&sceneText==""){
            return;
        }        
        // if(this.currentScene.sceneID==0&&sceneText==""&&(this.lastSceneFormat!="animeffect"&&this.lastSceneFormat!="walk_in"&&this.lastSceneFormat!="walk_out")){            
            
        //     return;
        // }

        firstWord=(sceneText.indexOf(" ")>0)?sceneText.substr(0, sceneText.indexOf(" ")):sceneText;
        firstWord=firstWord.replace("\t","");
        var splitSpace=sceneText.split(" ");    
        splitSpace[0]=splitSpace[0].replace("\t","");
        
        if(firstWord=="//"||firstWord.substr(0,2)=="//"){            
            this.isComments=true;
            this.checkDoubleSlash=true;
        }
        else if(firstWord=="/*"||firstWord.substr(0,2)=="/*")this.isComments=true;
        
        if(this.isComments==false){
            if(this.isTesting==false||(this.isTesting==true&&line<this.testLine.max&&line>this.testLine.min&&nameFile=="chapter"+this.testLine.chapter))console.log(nameFile+", line: "+(line+1)+", sceneID: "+this.currentScene.sceneID+", "+sceneText);                   
        }
        if (this.isComments==true){                    
            if(this.checkDoubleSlash==true){
                if(firstWord!="//"&&firstWord.substr(0,2)!="//"){
                    this.isComments=false;
                    this.checkDoubleSlash=false;
                    console.log(nameFile+", line: "+(line+1)+", sceneID: "+this.currentScene.sceneID+", "+sceneText);    
                }else{                                    
                    return;
                }
            }else{
                if(splitSpace.indexOf("*/")>=0){
                    this.isComments=false;
                }                
                return;
            }
           
        }
        
        //after } 
        if(this.inOption==false&&(this.lastSceneFormat=="choice"||this.lastSceneFormat=="check_vn"||this.lastSceneFormat=="check_bool"||this.lastSceneFormat=="switch"))//pushing linkSceneID into options
        {
            for(var i=0;i<this.numSceneEndChoices.length;i++){                           
                this.sceneData[this.numSceneEndChoices[i]].linkSceneID=this.currentScene.sceneID;                       
            }
            
            //should be called at the end of switch. so avoid CASE. and {
            if(splitSpace[0]!="CASE."&&splitSpace[0]!="{"&&this.sceneData[this.numSceneChoice]&&this.sceneData[this.numSceneChoice].linkSceneID&&this.sceneData[this.numSceneChoice].linkSceneID[0].type=="switch"){
                var objLinkSceneID={
                    linkID:this.currentScene.sceneID,
                    condition:"default"
                };
                this.sceneData[this.numSceneChoice].linkSceneID.push(this.copy(objLinkSceneID));                                                
            }
            this.inCheck=false; 
        }  

         //fill in default scene with scenebeforechoice
        if(this.isFirstSceneOnBranch==true){  
            this.charactersData={};            
            for(var i=0;i<this.sceneDataBeforeChoice.char.length;i++){
                var charName=this.sceneDataBeforeChoice.char[i].name;
                this.charactersData[charName]=this.copy(this.sceneDataBeforeChoice.char[i]);                
            }                                   
            
            this.currentBG=this.copy(this.sceneDataBeforeChoice.bg);                    
            this.currentBGM=this.copy(this.sceneDataBeforeChoice.bgm);                
            
            if(this.bolEmptyLine==false)this.setDefaultScene(true);
            else {
                this.createNewScene();
            }
            
            this.isFirstSceneOnBranch=false;               
        }
        
        if(firstWord==""&&this.bolEmptyLine==false){    
                //end of a scene                                  
                if(this.lastSceneFormat!="choice"&&this.lastSceneFormat!="check_vn"&&this.lastSceneFormat!="check_bool"&&this.lastSceneFormat!="switch")
                    this.createNewScene(true);      

                if(this.lastSceneFormat=="walk_out"){//delet char   
                                  
                    this.charWalkOut.forEach(function(key){
                        if (this.charactersData!=null&&this.charactersData.hasOwnProperty(key)) {  // Check if 'a' has the key                            
                            delete this.charactersData[key];
                        }
                    }.bind(this));
                    
                    this.charWalkOut=[];
                    
                    this.currentScene={char:[],charTalk:"none",text:"",sceneID:this.sceneData.length};                    
                    this.setDefaultScene();
                    
                }                
                this.lastSceneFormat="empty";  
                   
        }
        else if(firstWord=="END."){
            if(this.bolEmptyLine==false)this.createNewScene(true);            

            this.currentScene.animEffect={type:"end"};            
            if(splitSpace.length>1) this.currentScene.animEffect.color=splitSpace[1];
             
            this.bolEmptyLine=false;                                    
        }        
        else if(firstWord.substr(0,1)=="@"){    
            //set dialog

            if(this.bolGTL==true){
                this.arrGTLSceneID[this.arrGTLSceneID.length-1].text=sceneText;                
                this.bolGTL=false;                
            }

            //set dialog          
            if((this.lastSceneFormat=="dialog"&&this.bolEmptyLine==false)||this.lastAnimEffect=="love_gender"){                                
                this.createNewScene();                
            }
            
            if(this.currentScene.bg==null||this.currentScene.char==null){                                          
                this.setDefaultScene();
            }
            
            // var arr=splitSpace;
            // arr[0]=arr[0].replace(/@/g, '');
            var charName=firstWord.replace(/@/g, '').toLowerCase().replace("_"," ");                        
            
            if(charName!="none")this.currentScene.char=this.merge(this.currentScene.char,this.setCharData(splitSpace));                                    
            this.lastSceneFormat="dialog";
            this.bolEmptyLine=false;        
            
            // if(this.currentScene.bg==null){
            //     this.setDefaultScene();
            // }
            if(this.lastAnimEffect=="love_gender"){
                if(this.sceneData[this.numSceneChoice].option==null)this.sceneData[this.numSceneChoice].option=[{}];                    
                var objOption={
                    sceneID:this.currentScene.sceneID                        
                };
                this.sceneData[this.numSceneChoice].option.push(this.copy(objOption));    
                this.numSceneEndChoices.push(this.currentScene.sceneID);  
            }

            this.currentScene.charTalk=(charName=="none")?"none":this.capitalizeFirstLetter(charName);
            var idxText=0;
            var arrProp=["tint","anim","emo","faceTo","handheld","position","anim_delay","animDelay","outfit","shadow","animSpeed"];            
            var sceneProp=["text_delay","textDelay","bubbleOffsetY","textFontSize","nameTag","sfxText","tweenOut","tweenIn"];
            for(var i=1;i<splitSpace.length;i++){               
                  if(i%2==1){   
                    var idxSceneProp = sceneProp.findIndex(item => item.toLowerCase() === splitSpace[i].toLowerCase());                                   

                    if(arrProp.indexOf(splitSpace[i])>=0){
                        var idx=arrProp.indexOf(splitSpace[i]);
                        var prop=splitSpace[i+1];

                        if(splitSpace[i]=="handheld"){
                            if(prop.toLowerCase()=="none")prop="";                        
                            else{
                                if(this.customLoadData.object==null&&prop!="")this.customLoadData.object=[];
                                if(prop!=""&&this.customLoadData.object.indexOf(prop)==-1){
                                    this.customLoadData.object.push(prop);                    
                                }                                
                            }
                        }
                        if(splitSpace[i]=="tint"&&prop.toLowerCase()=="none"){
                            this.setCharData(splitSpace);
                            var idxChar=this.findIndexArrayObject(this.currentScene.char,"name",this.currentScene.charTalk,false);
                            delete this.currentScene.char[idxChar].tint;
                            idxText=i+1;
                            continue;
                        }

                        var key=(arrProp[idx]=="emo")?"emotion":arrProp[idx];
                        if(key=="animDelay")key="anim_delay";

                        this.changeCharProp(this.currentScene.charTalk,key,prop);
                        
                        idxText=i+1;   
                    }
                    else if(splitSpace[i]=="bubble"||splitSpace[i].toLowerCase()=="bubbletype"){
                        this.currentScene.bubbleType=splitSpace[i+1].toLowerCase();  
                        if(splitSpace[i+1].toLowerCase()=="none"){
                            this.currentScene.charTalk="none";
                        }
                        idxText=i+1;                       
                    }
                    else if(splitSpace[i]=="voice_over"||splitSpace[i].toLowerCase()=="voiceover"){
                        if(this.customLoadData.voiceover==null)this.customLoadData.voiceover=[];
                        this.customLoadData.voiceover.push(this.currentScene.sceneID);                  
                        idxText=i+1;                           
                    }
                    else if(splitSpace[i]=="nameTag"){
                        var charNameTag=splitSpace[i+1].toLowerCase().replace(/@/g, '').replace("_"," ");                        
                        this.currentScene.nameTag=this.capitalizeFirstLetter(charNameTag);           
                        idxText=i+1;                           
                    }
                    else if(idxSceneProp>=0)
                    {
                        var key=sceneProp[idxSceneProp];
                        if(key=="textDelay")key="text_delay";
                        else if(key=="sfxText"){
                            this.addToCustomLoad("sfx",splitSpace[i+1]);                            
                        }
                        this.currentScene[key]=this.setPropertiesValue(splitSpace[i+1]);                        
                        idxText=i+1; 
                    }else {
                        //it's not prop                        
                        break;
                    }
                }   
            }

            if(this.currentScene.nameTag==null&&charName=="none"&&this.noneNameTag!=""){
               
                this.currentScene.nameTag=this.noneNameTag;
            }
            
            if(this.scenePropertiesSettings!=null){
                var idx=this.findIndexArrayObject(this.scenePropertiesSettings,"charTalk",this.currentScene.charTalk,true);
                if(this.currentScene.charTalk=="none"){
                    // Prefer nameTag-specific settings, but fall back to generic @none settings if none found
                    var idxByNameTag=-1;
                    var idxByNone=this.findIndexArrayObject(this.scenePropertiesSettings,"charTalk","None",true);
                    if(this.currentScene.nameTag){
                        idxByNameTag=this.findIndexArrayObject(this.scenePropertiesSettings,"charTalk",this.currentScene.nameTag);
                    }
                    idx = (idxByNameTag>=0)? idxByNameTag : idxByNone;                    
                }

                if(idx>=0){
                    var scenePropSet=this.copy(this.scenePropertiesSettings[idx]);
                    // if(this.currentScene.charTalk!="none"||
                    //     (this.currentScene.charTalk=="none"&&!this.currentScene.nameTag&&!scenePropSet.nameTag)
                    //     ||(this.currentScene.charTalk=="none"&&this.currentScene.nameTag&&(
                    //         (scenePropSet.nameTag && scenePropSet.nameTag.toLowerCase()==this.currentScene.nameTag.toLowerCase())
                    //         || (!scenePropSet.nameTag) // allow generic @none settings even when nameTag is set
                    //     ))
                    // ){
                        delete scenePropSet.nameTag;
                        this.currentScene=this.merge(scenePropSet,this.currentScene);                        
                    // }
                }
            }
            
            var tempText=splitSpace.slice(idxText + 1).join(" "); 
              
                   
            // var tempText=splitSpace.slice(idxText).join(" ");
            // console.log(idxText,splitSpace[idxText],this.currentScene.sceneID,tempText);

            if(idxText==splitSpace.length-1||tempText==""||tempText==" "){
                this.currentScene.text="";
            }
            else
                this.currentScene.text=tempText;                                    

            if(this.currentScene.text.indexOf("{")>=0){
                //checking  dynamic words
                for(var j=idxText;j<splitSpace.length;j++){
                    var word=splitSpace[j];
                    if(word.substr(0,1)=="{"){
                        var sliceWord=word.replace("{","");                                                
                        sliceWord=sliceWord.slice(0,sliceWord.indexOf("}"))
                        sliceWord=sliceWord.replace("_"," ");
                        if(this.dynamicWords.indexOf(sliceWord)==-1)this.dynamicWords.push(sliceWord);                        
                    }
                }                
            }            
            // console.log(this.currentScene);
        }  
        else {
            switch(firstWord.toUpperCase()){
                case "SETTINGS.":
                    if(splitSpace[1].toLowerCase()=="none"){
                        this.noneNameTag=this.capitalizeFirstLetter(splitSpace[3].replace("_"," "));
                        if(this.noneNameTag=="Null")this.noneNameTag="";   
                                       
                    } else if(splitSpace[1].substr(0,1)=="@"){                        
                        var charNameTag=this.capitalizeFirstLetter(splitSpace[1].toLowerCase().replace(/@/g, '').replace("_"," "));                        
                        var scenePropObj= {
                            charTalk:charNameTag
                        };
                        
                        //for dialog scenes properties
                        var sceneProp=["text_delay","textDelay","bubbleOffsetY","textFontSize","nameTag","sfxText"];
                        var useNameTag=false;
                        for(var i=2;i<splitSpace.length;i++){               
                            if(i%2==0){   
                                var idxSceneProp = sceneProp.findIndex(item => item.toLowerCase() === splitSpace[i].toLowerCase());                                   
                                
                                if(splitSpace[i]=="bubble"||splitSpace[i].toLowerCase()=="bubbletype"){
                                    scenePropObj.bubbleType=splitSpace[i+1].toLowerCase();  
                                    if(splitSpace[i+1].toLowerCase()=="none"){
                                        scenePropObj.charTalk="none";
                                    }
                                    idxText=i+1;                       
                                }else if(splitSpace[i]=="nameTag"){
                                    scenePropObj.nameTag=this.capitalizeFirstLetter(splitSpace[i+1].replace("_"," "));
                                    idxText=i+1;
                                    useNameTag=scenePropObj.nameTag;
                                }
                                else if(idxSceneProp>=0)
                                {
                                    var key=sceneProp[idxSceneProp];
                                    if(key=="textDelay")key="text_delay";
                                    else if(key=="sfxText"){
                                        this.addToCustomLoad("sfx",splitSpace[i+1]);                            
                                    }
                                    scenePropObj[key]=this.setPropertiesValue(splitSpace[i+1]);                                                            
                                    idxText=i+1; 
                                }else {
                                    //it's not prop                        
                                    break;
                                }
                            }   
                        }
                        if(useNameTag!=false)
                            this.updateObjectInArray(this.scenePropertiesSettings,["charTalk","nameTag"],[charNameTag,useNameTag],scenePropObj);
                        else 
                            this.updateObjectInArray(this.scenePropertiesSettings,["charTalk"],[charNameTag],scenePropObj);                                                                        
                        
                    }
                    else{
                        
                        //only for zoom_pan
                        var key=splitSpace[1];
                        var arrNewKey=["flashbackEnd","zoomIn","zoomOut","zoomPan","freezeFrame","loveGender","loveGenderEnd"];
                        if(arrNewKey.indexOf(key)>=0)key=splitSpace[1].replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

                        this.animEffect={type:key};
                        if(splitSpace.length>3){
                            for(var i=2;i<splitSpace.length;i++){
                                if(i%2==0){                                    
                                    var val=(parseInt(splitSpace[i+1]).toString()=="NaN")?splitSpace[i+1]:parseFloat(splitSpace[i+1]);                                  
                                    if(splitSpace[i+1].toLowerCase()=="true"||splitSpace[i+1].toLowerCase()=="false")val=(splitSpace[i+1].toLowerCase() === "true");
                                    this.animEffect[splitSpace[i]]=val;
                                }
                            }
                        }
                        else if(key== "zoom_in"){
                            this.animEffect={type:"zoom_in", char:[this.capitalizeFirstLetter(splitSpace[2].replace(/@/g, '').replace("_"," "))]};
                        }
                        else if(splitSpace.length==3){
                            if(splitSpace[2].substr(0,1)=="#"){
                                this.animEffect.color=splitSpace[2];
                            }else this.animEffect.name=splitSpace[2];
                        } 
                    }
                break;
                case "PROGRESS_BAR.":
                    if(this.currentScene.progressBar==null)this.currentScene.progressBar=[];
                    var objBar={
                        progressID:splitSpace[1]                        
                    };
                    
                    for(var i=2;i<splitSpace.length;i++){               
                        if(i%2==0){   
                            if(splitSpace[i]=="text"){
                                idxText=i;
                                objBar.text=splitSpace.slice(idxText + 1).join(" ");
                                break;                                
                            }else{
                                objBar[splitSpace[i]]=this.setPropertiesValue(splitSpace[i+1]);
                            }
                        }   
                    }
                    
                    if(this.progressBarData[objBar.progressID]==null){
                        this.progressBarData[objBar.progressID]=objBar;
                    }else {
                        this.progressBarData[objBar.progressID]=this.merge(this.progressBarData[objBar.progressID],objBar);
                    }
                    
                    if(this.progressBarData[objBar.progressID].show==true)this.currentScene.progressBar.push(this.progressBarData[objBar.progressID]);
                    else if(this.currentScene.progressBar.length==0)delete this.currentScene.progressBar;
                break;
                case "WINDOWBOXING.":
                    if(this.currentScene.windowBoxing==null)this.currentScene.windowBoxing={};
                    var objBox={};
                    var prop=splitSpace[1];
                    objBox[prop]={};
                    
                    var arrProp=["color","thickness","zindex"];
                    for(var i=2;i<splitSpace.length;i++){   
                        if(splitSpace[i]==";"){
                            prop=splitSpace[i+1];
                            objBox[prop]={};
                        }
                        else if(arrProp.indexOf(splitSpace[i].toLowerCase())>=0){                                
                            objBox[prop][splitSpace[i]]=this.setPropertiesValue(splitSpace[i+1]);
                        }
                        
                    }
                    this.currentScene.windowBoxing=this.copy(objBox);
                break;
                case "TOASTBOX.":
                    if(this.currentScene.toastBox==null)this.currentScene.toastBox=[];
                    var objToast={};
                    var idxText=0;
                    for(var i=1;i<splitSpace.length;i++){               
                        if(i%2==1){   
                            if(splitSpace[i]=="time"){
                                objToast.time=parseFloat(splitSpace[i+1]);
                                idxText=i+1;                           
                            }
                            else if(splitSpace[i]=="sfx"){
                                objToast.sfx=splitSpace[i+1];
                                idxText=i+1;             
                                if(this.customLoadData.sfx==null)this.customLoadData.sfx=[];
                                if(this.customLoadData.sfx.indexOf(splitSpace[1+i])==-1)this.customLoadData.sfx.push(splitSpace[i+1]);              
                            }else {
                                //it's not prop                        
                                break;
                            }
                        }   
                    }
                    objToast.text=splitSpace.slice(idxText + 1).join(" ");
                    
                    this.currentScene.toastBox.push(objToast);
                break;
                case "SINGLE_PARTICLE.":
                    var tempObjData={
                        id:0,
                        objectID:splitSpace[1],
                        type:splitSpace[2]
                    };

                    if(splitSpace.length<3)this.showError("Single particle need more properties",line);
// OBJECT. basketball ball from { x:0,y:0, scaleX:1,scaleY:1 } to { x:0,y: 400 } time 1 easing Bounce.EaseOut pivot { x:0.5, y:0.5 } zIndex 1 remove true flip { x:true }
                    var idxObj=this.findIndexArrayObject(this.singleParticleData,"objectID",splitSpace[1]);                    
                    for(var i=3;i<splitSpace.length;i++){
                        if(i%2==1){
                            var val;
                            if(parseFloat(splitSpace[i+1]).toString()!="NaN")val=parseFloat(splitSpace[i+1]);                            
                            else {
                                val=splitSpace[i+1];
                            }                                                     
                            
                            tempObjData[splitSpace[i]]=val;
                        } 
                    }              
                         
                    //add new object                     
                    if(idxObj==-1){                                               
                        this.singleParticleData.push(this.copy(tempObjData));                                              
                    }else{
                        // tempObjData.id=idxObj;                                                  
                        if(tempObjData.hasOwnProperty("posX")==false&&this.singleParticleData){                            
                            if(this.singleParticleData[idxObj]!=null&&this.singleParticleData[idxObj].posX!=null){                                
                                tempObjData.posX=this.singleParticleData[idxObj].posX;                                
                            }
                        }          
                        
                        if(tempObjData.hasOwnProperty("posY")==false&&this.singleParticleData){                            
                            if(this.singleParticleData[idxObj]!=null&&this.singleParticleData[idxObj].posY!=null){                                
                                tempObjData.posY=this.singleParticleData[idxObj].posY;                                
                            }
                        }  
                        
                        if(tempObjData.hasOwnProperty("posX")==false&&tempObjData.hasOwnProperty("posY")==false){
                            this.showError("Single particle needs posX and posY",null)
                        }

                        this.singleParticleData[idxObj]=this.merge(this.singleParticleData[idxObj],tempObjData);                         
                    }
                    
                    if(this.currentScene.singleParticle==null)this.currentScene.singleParticle=[];                    
                    tempObjData.id=this.currentScene.singleParticle.length;
                    delete tempObjData.persist;

                    this.currentScene.singleParticle.push(this.copy(tempObjData));
                    
                    if(this.inOption==false&&this.lastSceneFormat=="choice")
                        this.lastSceneFormat="choice";
                    else this.lastSceneFormat="singleParticle";
                    this.bolEmptyLine=false;
                break;
                case "PARTICLE.":
                case "BACKGROUND_PARTICLE.":
                    // type:"rain/meteor/snow/matrix/fireworks"
                    // color:"#"
                    // quantity
                    // zIndex:
                    this.currentScene.particle={};
                    var idxText=0;      
                    var evenOdd=1; 
                    var saveParticle=false;                 
                    for(var i=1;i<splitSpace.length;i++){ 
                        if(i%2==evenOdd){
                            if(splitSpace[i].toLowerCase()=="persist"){
                                if(splitSpace[i+1].toLowerCase()=="true")saveParticle=true;
                                else {
                                    //remove persist
                                    this.particleData=null;
                                    saveParticle=null;
                                }
                                
                            }
                            else if(this.currentScene.particle.type=="fireworks"&&splitSpace[i].toLowerCase()=="color"){
                                var startIdx=sceneText.indexOf("[");
                                var endIdx=sceneText.indexOf("]")+1;
                                var arrString=sceneText.substring(startIdx,endIdx).replace(/"/g, "'");
                                // console.log(arrString+" "+endIdx);
                                this.currentScene.particle.color=JSON.parse(arrString.replace(/'/g, '"'));                                
                                i=splitSpace.findIndex((str) => str.includes("]"));
                                evenOdd=(i%2==1)?0:1;
                            }
                            else {
                                this.currentScene.particle[splitSpace[i]]=(parseInt(splitSpace[i+1]).toString()=="NaN")?splitSpace[i+1]:parseInt(splitSpace[i+1]);
                            }
                            
                        }
                    } 
                    if(saveParticle==true){
                        this.particleData=this.merge(this.particleData,this.currentScene.particle);                           
                    }else if(saveParticle==null){
                        //remove particle
                        delete this.currentScene.particle;
                    }
                break;
                case "SETCHAR.":
                var arr=splitSpace.slice(1);                
                this.currentScene.char=this.setCharData(arr);      
                this.lastSceneFormat="characters";
                this.bolEmptyLine=false;
                break;
                case "OBJECT.":
                    var tempObjData={
                        id:0,
                        objectID:splitSpace[1],
                        source: splitSpace[2],
                        from:{}
                    };
                    if(this.customLoadData.object==null)this.customLoadData.object=[];
                    if(this.customLoadData.object.indexOf(splitSpace[2])==-1)this.customLoadData.object.push(splitSpace[2]);

                    if(splitSpace.length<3)this.showError("Object need more properties",line);
// OBJECT. basketball ball from { x:0,y:0, scaleX:1,scaleY:1 } to { x:0,y: 400 } time 1 easing Bounce.EaseOut pivot { x:0.5, y:0.5 } zIndex 1 remove true flip { x:true }
                    var idxObj=this.findIndexArrayObject(this.objectData,"objectID",splitSpace[1]);
                    var tempProp="";
                    var strProp="";
                    var startIdx=-1;
                    var arrObject=["from","to"];
                    var arrProp=["tint","time","easing","zindex","remove","chain","delay","pivotx","pivoty","flipx","flipy","loop","textdelay"];
                    var saveObject=false;
                    for(var i=2;i<splitSpace.length;i++){
                        if(arrObject.indexOf(splitSpace[i].toLowerCase())>=0){
                            tempProp=splitSpace[i].toLowerCase();
                            strProp="";
                        }
                        else if(arrProp.indexOf(splitSpace[i].toLowerCase())>=0){
                            tempProp="";
                            var val;
                            if(splitSpace[i]=="textDelay"){
                                this.currentScene["text_delay"]=parseFloat(splitSpace[i+1]);
                            }
                            else if(parseFloat(splitSpace[i+1]).toString()!="NaN")val=parseFloat(splitSpace[i+1]);                            
                            else if(splitSpace[i]=="remove"){
                                val=(splitSpace[i+1]=="true")?true:false;                                
                            }
                            else if(splitSpace[i]=="tint"){
                                if(splitSpace[i+1]=="none"){
                                    continue;
                                }
                                else{
                                    val=splitSpace[i+1];
                                }        
                            }
                            else {
                                val=splitSpace[i+1];
                            }                         

                            var propLower   = splitSpace[i].toLowerCase();
                            if(propLower=="zindex"||propLower=="pivotx"||propLower=="pivoty"||propLower=="flipx"||propLower=="flipy")
                                tempObjData[splitSpace[i]]=val;
                            else 
                                tempObjData[splitSpace[i].toLowerCase()]=val;
                        }
                        else if(splitSpace[i].toLowerCase()=="persist"){
                            if(splitSpace[i+1].toLowerCase()=="true")saveObject=true;
                            else {
                                //remove persist
                                var arr=[];                                
                                var idx=this.findIndexArrayObject(this.tempObject,"objectID",tempObjData["objectID"]);                                
                                if(idx>=0)
                                {
                                    this.tempObject.splice(idx,1);
                                }
                                saveObject=null;
                            }
                        } else if(splitSpace[i].toLowerCase()=="{"){
                            // startIdx=i;
                            strProp+=splitSpace[i];
                        }else if(splitSpace[i].toLowerCase()=="}"){
                            strProp+=splitSpace[i];
                            // strProp=sceneText.slice(startIdx,i+1);
                            
                            if(tempObjData[tempProp]==null)tempObjData[tempProp]={};
                            tempObjData[tempProp]=this.merge(tempObjData[tempProp],eval('('+strProp+')'));
                            // if(tempProp=="to"&&tempObjData["from"]!=null){
                            //     tempObjData[tempProp]=this.merge(tempObjData[tempProp],tempObjData["from"]);
                            // }
                            
                            strProp="";
                        }else if(tempProp!=""){
                            strProp+=splitSpace[i];
                        }
                    }
                    if(tempObjData.hasOwnProperty("from")&&tempObjData.hasOwnProperty("to")&&!tempObjData.hasOwnProperty("time"))this.showError("Object need time for tween",line);
                    
                    //remove object from persist
                    if(saveObject==null) {
                        return;
                    }

                    //add new object
                    if(idxObj==-1){                                               
                        this.objectData.push(tempObjData);                        
                    }else{
                        // tempObjData.id=idxObj;                                                  
                        if(tempObjData.from.hasOwnProperty("x")==false&&this.objectData){                            
                            if(this.objectData[idxObj]!=null&&this.objectData[idxObj].to!=null){                                
                                tempObjData.from=this.copy(this.objectData[idxObj].to);                                
                            }
                            else if(this.objectData[idxObj]!=null&&this.objectData[idxObj].from!=null){                                
                                 tempObjData.from=this.copy(this.objectData[idxObj].from);
                            }
                            else this.showError("Object need from",line);                            
                        }                        
                        this.objectData[idxObj]=this.merge(this.objectData[idxObj],tempObjData);                         
                    }

                    if(this.currentScene.object==null)this.currentScene.object=[];                    
                    tempObjData.id=this.currentScene.object.length;
                    
                    if(saveObject==true){
                        if(this.tempObject==null)this.tempObject=[];
                        var idx=this.findIndexArrayObject(this.tempObject,"objectID",tempObjData.objectID);
                        if(idx==-1)
                            this.tempObject.push(this.copy(tempObjData));
                        else{                            
                            this.tempObject[idx]=this.copy(tempObjData);
                        }
                    }                    
                    
                    this.currentScene.object.push(this.copy(tempObjData));
                    
                    if(this.inOption==false&&this.lastSceneFormat=="choice")
                        this.lastSceneFormat="choice";
                    else this.lastSceneFormat="object";
                    this.bolEmptyLine=false;
                break;
                case "REWARD.":
                    if(splitSpace.length<3)showError("reward need currency and value",line);

                    this.currentScene.reward={};
                    this.currentScene.reward[splitSpace[1]]=parseInt(splitSpace[2]);                                     
                break;
                case "JUMPTO.":
                    if(splitSpace.length<2) this.showError("no branch name",line);
                    // this.currentScene.linkSceneID=splitSpace[1];
                    if(this.dataJumpTo[splitSpace[1]]==null)this.dataJumpTo[splitSpace[1]]={from:[],to:-1};                    
                    this.dataJumpTo[splitSpace[1]].from.push(this.currentScene.sceneID);
                    console.log(line+" JUMPTO "+splitSpace[1]+" sceneID "+this.currentScene.sceneID);
                break;
                case "CONTINUE.":
                    if(splitSpace.length<2) this.showError("no branch name",line);
                    if(this.dataJumpTo[splitSpace[1]]==null)this.dataJumpTo[splitSpace[1]]={from:[], to:-1};                                                              
                    this.dataJumpTo[splitSpace[1]].to=this.currentScene.sceneID;
                    console.log(line+" CONTINUE "+splitSpace[1]+" sceneID "+this.currentScene.sceneID);
                break;
                case "{":
                    if(this.inOption!=true&&this.isChoice==true){    
                        console.log("going to choice");
                        //only for choice                    
                        if(this.sceneData[this.numSceneChoice].option==null)this.sceneData[this.numSceneChoice].option=[{}];                    
                        var objOption={
                            sceneID:this.currentScene.sceneID                        
                        };
                        if(splitSpace.length==3){
                            objOption.cost={};
                            var bolValue=(splitSpace[2].toLowerCase() === "true");
                            objOption.cost[splitSpace[1]]=(parseInt(splitSpace[2]).toString()=="NaN")?bolValue:parseInt(splitSpace[2]);
                        }
                        else if(splitSpace.length>3){                            
                            objOption=this.merge(objOption,this.setChoiceCostReward(splitSpace));                            
                        }
                        // this.dataOption=objOption;
                        
                        this.sceneData[this.numSceneChoice].option.push(this.copy(objOption));
                    }else{
                        //check vc
                    }     
                    
                    this.inOption=true;
                    break;
                case "COST.":                    
                    if(this.inOption==true){
                        var lastOption=this.sceneData[this.numSceneChoice].option[this.sceneData[this.numSceneChoice].option.length-1];
                        lastOption=this.merge(lastOption,this.setChoiceCostReward(splitSpace));                        
                    }
                    else{
                        this.showError("Option not detected. Can't assign COST.",line);
                    }
                    break;
                case "}": //end of choice                    
                    this.numSceneEndChoices.push(this.currentScene.sceneID);                   
                    this.lastSceneFormat="choice";
                    // this.bolEmptyLine=false;

                    this.createNewScene(true);
                    this.bolEmptyLine=false;
                    this.inOption=false;    
                    this.isFirstSceneOnBranch=true;
                break;
                case "CHARACTERS.":
                    this.lastSceneFormat="characters";
                    this.bolEmptyLine=false;        
                    this.charactersData={};
                    var arr=splitSpace.slice(1);                    
                    this.currentScene.char=this.setCharData(arr);
                break;
                case "BACKGROUND.":
                    //set background. default pos is center.            
                    if(splitSpace.length<2){
                       this.showError("No background name",line);
                    }
                    var bgNow={};

                    this.lastSceneFormat="background";
                    this.bolEmptyLine=false;                
                    //set background
                    bgNow.name=splitSpace[1];
                    
                    if(this.customLoadData.bg==null)this.customLoadData.bg=[];
                    if(this.customLoadData.bg.indexOf(splitSpace[1])==-1&&splitSpace[1].substr(0,1)!="#")this.customLoadData.bg.push(splitSpace[1]);

                    if(splitSpace.length==3)bgNow.pos=splitSpace[2];
                    else if(splitSpace.length>3){
                        var arrPos=["left","right","center"];
                        var idxStart=3;
                        var mod=1;
                        if(arrPos.indexOf(splitSpace[2].toLowerCase())>=0){
                            bgNow.pos=splitSpace[2];
                        }else{
                            bgNow[splitSpace[2]]=splitSpace[3];
                            idxStart=4;mod=0;                            
                        }
                         for(var i=idxStart;i<=splitSpace.length-2;i++){                            
                            if(i%2==mod){                                
                                bgNow[splitSpace[i]]=this.setPropertiesValue(splitSpace[i+1]);
                            }
                        }            
                    }
                    else bgNow.pos="center";

                    this.currentScene.bg=bgNow;
                    // this.currentBG.name=bgNow.name;
                    // this.currentBG.pos=bgNow.pos;
                    this.currentBG=bgNow;

                    break;
                case "OVERLAY.":
                    if(splitSpace.length<2){
                        this.showError("No overlay type",line);
                     }
                    this.lastSceneFormat="overlay";
                    this.bolEmptyLine=false;     

                    this.currentOverlay=splitSpace[1];   
                    if(this.currentOverlay.toLowerCase()!="none"){                 
                        this.currentScene.overlayType=this.currentOverlay;
                    }else{
                        delete this.currentScene.overlayType;
                    }
                    break;
                case "BGM.":
                    //set background. default pos is center.            
                    if(splitSpace.length<2){
                       this.showError("No bgm name",line);
                    }

                   this.lastSceneFormat="bgm";
                   this.bolEmptyLine=false;                
                    //set background
                    this.currentBGM.name=splitSpace[1];
                    
                    this.currentScene.bgm=this.currentBGM;
                    if(this.customLoadData.bgm==null)this.customLoadData.bgm=[];
                    if(this.customLoadData.bgm.indexOf(splitSpace[1])==-1)this.customLoadData.bgm.push(splitSpace[1]);
                break;
                case "SFX.":
                     //set background. default pos is center.            
                    if(splitSpace.length<2){
                        this.showError("No sfx propertis",line);
                    }

                    this.lastSceneFormat="sfx";
                    this.bolEmptyLine=false;                
                    //set sfx           
                    this.currentScene.sfx={};
                    
                    if(splitSpace[1]=="stop"){
                       this.currentScene.sfx.stop=true;
                        if(splitSpace.length>=3){
                            this.currentScene.sfx.name=splitSpace[2];                
                            if(this.customLoadData.sfx==null)this.customLoadData.sfx=[];
                            if(this.customLoadData.sfx.indexOf(splitSpace[2])==-1)this.customLoadData.sfx.push(splitSpace[2]);
                        }
                    }
                    else if(splitSpace[1]=="loop"){
                       this.currentScene.sfx.loop=true;
                       if(splitSpace.length>=3){
                            this.currentScene.sfx.name=splitSpace[2]; 
                            if(splitSpace.length>=5&&splitSpace[3].toLowerCase()=="delay") this.currentScene.sfx.delay=parseFloat(splitSpace[4]);

                            if(this.customLoadData.sfx==null)this.customLoadData.sfx=[];
                            if(this.customLoadData.sfx.indexOf(splitSpace[2])==-1)this.customLoadData.sfx.push(splitSpace[2]);                              
                        } 
                    }else{
                        this.currentScene.sfx.name=splitSpace[1];
                        for(var i=2;i<splitSpace.length;i++){
                            if(splitSpace[i].toLowerCase()=="delay") this.currentScene.sfx.delay=parseFloat(splitSpace[i+1]);
                        }
                        
                        if(this.customLoadData.sfx==null)this.customLoadData.sfx=[];
                        if(this.customLoadData.sfx.indexOf(splitSpace[1])==-1)this.customLoadData.sfx.push(splitSpace[1]);
                    }                       
                break;  
                case "WALK_IN.":
                case "STUMBLE_IN.":
                case "RUN_IN.":
                case "FADE_IN.":
                    this.lastSceneFormat="walk_in";
                    this.bolEmptyLine=false;      
                    var arr=splitSpace.slice(1);                    
                    if(this.currentScene.char==null)this.currentScene.char=[];
                    this.currentScene.char=this.merge(this.currentScene.char,this.setCharData(arr,false));                    

                    if(firstWord.toUpperCase()=="WALK_IN.")this.currentScene.animEffect=this.setWalkInData("walk_in",splitSpace);
                    else if(firstWord.toUpperCase()=="FADE_IN.")this.currentScene.animEffect=this.setWalkInData("fade_in",splitSpace);
                    else {
                        var str=firstWord.toLowerCase().split("_")[0];
                        this.currentScene.animEffect=this.setWalkInData("walk_in",splitSpace,str);
                    }                    
                    
                break;    
                case "WALK_OUT.":
                case "STUMBLE_OUT.":
                case "RUN_OUT.":
                case "FADE_OUT.":
                    if(this.bolEmptyLine==false&&this.lastSceneFormat!="object"&&this.lastSceneFormat!="singleParticle")this.createNewScene(true);                    
                    
                    this.lastSceneFormat="walk_out";
                    this.bolEmptyLine=false;     
                    
                    var arr=splitSpace.slice(1);                    
                    if(this.currentScene.char==null)this.currentScene.char=[];
                    this.currentScene.char=this.merge(this.currentScene.char,this.setCharData(arr,false));                    
                    
                    if(firstWord.toUpperCase()=="WALK_IN.")this.currentScene.animEffect=this.setWalkInData("walk_out",splitSpace);
                    else if(firstWord.toUpperCase()=="FADE_OUT.")this.currentScene.animEffect=this.setWalkInData("fade_out",splitSpace);
                    else {
                        var str=firstWord.toLowerCase().split("_")[0];
                        this.currentScene.animEffect=this.setWalkInData("walk_out",splitSpace,str);
                    }    
                break;   
                
                // case "TRANS.":
                //     // if(this.bolEmptyLine==false)this.createNewScene(true);                    

                //     this.currentScene.animEffect={};
                //     this.currentScene.animEffect.type="trans1";
                //     if(splitSpace.length>1) this.currentScene.animEffect.color=splitSpace[1];
                //     this.bolEmptyLine=false;

                // break;
                case "CHOICE.":     
                    this.isChoice=true;               
                    this.lastSceneFormat="choice";
                    this.bolEmptyLine=false;  
                    this.numSceneChoice=this.currentScene.sceneID;     
                    this.numSceneEndChoices=[];     
                    this.sceneDataBeforeChoice=this.copy(this.currentScene);                    
                    this.createNewScene(true);       
                break;
                case "SWITCH.":  
                    this.isChoice=false;                  
                   if(this.inCheck!=true){
                        this.numSceneChoice=this.currentScene.sceneID;     
                        this.numSceneEndChoices=[];     
                        this.sceneDataBeforeChoice=this.copy(this.currentScene);
                        this.currentScene.linkSceneID=[];
                    }

                    var objLinkSceneID={
                        operator:splitSpace[1].toLowerCase(),
                        type: "switch",
                        variables:[]
                    };
                    for(var i=2;i<splitSpace.length;i++){
                        objLinkSceneID.variables.push(splitSpace[i]);
                    }
                    // this.dataOption=objOption;                    
                    if(this.currentScene.sceneID!=this.numSceneChoice){                        
                        this.sceneData[this.numSceneChoice].linkSceneID.push(this.copy(objLinkSceneID));                        
                    }
                    else {
                        this.currentScene.linkSceneID.push(this.copy(objLinkSceneID));                        
                    }
                    
                    this.lastSceneFormat="switch";
                    if(this.currentScene.sceneID==this.numSceneChoice){ 
                        this.bolEmptyLine=false;                      
                        this.createNewScene(true);   
                    }    
                    
                    this.inCheck=true;
                break;
                case "CASE.":
                    
                    var objLinkSceneID={
                        linkID:(this.currentScene.sceneID==this.numSceneChoice)?this.currentScene.sceneID+1:this.currentScene.sceneID,
                        condition:splitSpace[1]
                    };

                    if(this.currentScene.sceneID!=this.numSceneChoice){
                        var sceneDataID=this.sceneData[this.numSceneChoice].linkSceneID;                        
                        sceneDataID.push(this.copy(objLinkSceneID));
                    }
                    else {                             
                        this.currentScene.linkSceneID.push(this.copy(objLinkSceneID));
                    }
                    
                    this.lastSceneFormat="switch";
                    this.inCheck=true;
                break;
                case "CHECK_VIRTUAL_CURRENCY.":  
                case "CHECK_INTEGER.":
                    
                    this.isChoice=false;
                    if(this.inCheck!=true&&this.lastSceneFormat!="choice"){
                        this.numSceneChoice=this.currentScene.sceneID;     
                        this.numSceneEndChoices=[];     
                        this.sceneDataBeforeChoice=this.copy(this.currentScene);
                        
                        this.currentScene.linkSceneID=[];
                    }

                    var objLinkSceneID={
                        linkID:(this.currentScene.sceneID==this.numSceneChoice)?this.currentScene.sceneID+1:this.currentScene.sceneID,
                        type: splitSpace[1],
                        condition:[]
                    };
                    for(var i=2;i<=splitSpace.length-3;i+=3){                        
                        var objCondition={type:splitSpace[i],operator:splitSpace[i+1],value:this.setPropertiesValue(splitSpace[i+2])};                        
                        objLinkSceneID.condition.push(objCondition);
                    }
                    // this.dataOption=objOption;                    
                    if(this.currentScene.sceneID!=this.numSceneChoice){                        
                        this.sceneData[this.numSceneChoice].linkSceneID.push(this.copy(objLinkSceneID));
                    }
                    else this.currentScene.linkSceneID.push(this.copy(objLinkSceneID));
                                      
                    this.lastSceneFormat="check_vn";
                    if(this.currentScene.sceneID==this.numSceneChoice){ 
                        this.bolEmptyLine=false;                      
                        this.createNewScene(true);   
                    }    
                    this.inCheck=true;
                break;
                case "ELSE.":  
                    var objLinkSceneID={
                        linkID:this.currentScene.sceneID,                        
                        condition:null
                    };
                    
                    this.sceneData[this.numSceneChoice].linkSceneID.push(this.copy(objLinkSceneID));                   
                    this.lastSceneFormat="check_vn";
                    // if(this.currentScene.sceneID==this.numSceneChoice){ 
                    //     this.bolEmptyLine=false;                      
                    //     this.createNewScene(true);   
                    // }    
                    this.inCheck=true;
                break;
                case "CHECK_BOOLEAN.":  
                    if(this.inCheck!=true){
                        this.numSceneChoice=this.currentScene.sceneID;     
                        this.numSceneEndChoices=[];     
                        this.sceneDataBeforeChoice=this.copy(this.currentScene);
                        this.currentScene.linkSceneID=[];
                    }

                    var objLinkSceneID={
                        linkID:(this.currentScene.sceneID==this.numSceneChoice)?this.currentScene.sceneID+1:this.currentScene.sceneID,                        
                        type: splitSpace[1],
                        condition:[]
                    };
                    
                    for(var i=2;i<=splitSpace.length-2;i+=2){                                
                        var objCondition={type:splitSpace[i],value:this.setPropertiesValue(splitSpace[i+1])};                        
                        objLinkSceneID.condition.push(objCondition);                        
                    }
                    // this.dataOption=objOption;                    
                    if(this.currentScene.sceneID!=this.numSceneChoice){                        
                        this.sceneData[this.numSceneChoice].linkSceneID.push(this.copy(objLinkSceneID));
                    }
                    else this.currentScene.linkSceneID.push(this.copy(objLinkSceneID));
                                      
                    this.lastSceneFormat="check_bool";
                    if(this.currentScene.sceneID==this.numSceneChoice){ 
                        this.bolEmptyLine=false;                      
                        this.createNewScene(true);   
                    }    
                    this.inCheck=true;
                break;
                case "SET_BOOLEAN.":
                    if(this.currentScene.hasOwnProperty("variable")==false)this.currentScene.variable=[];

                    for(var i=1;i<=splitSpace.length-2;i+=2){                        
                        var idxVariable=this.findIndexArrayObject(this.currentScene.variable,"type",splitSpace[i]);
                        if(idxVariable==-1){
                            if(this.customLoadData.variable==null)this.customLoadData.variable=[];
                            if(this.customLoadData.variable.indexOf(splitSpace[i])==-1)this.customLoadData.variable.push(splitSpace[i]);
        
                            this.currentScene.variable.push({
                                type:splitSpace[i],
                                value:JSON.parse(splitSpace[i+1])
                            });
                        }else{
                            this.currentScene.variable[idxVariable].value=JSON.parse(splitSpace[i+1]);
                        }
                    }

                    
                break;
                case "SET_INTEGER.":
                    if(this.currentScene.hasOwnProperty("variable")==false)this.currentScene.variable=[];
                    
                    var objVar={type:splitSpace[1],operator:splitSpace[2]};
                    var objValue={};
                    for(var i=3;i<=splitSpace.length-1;i++){    
                                         
                        if(splitSpace[i]=="min"){
                            objValue.min=parseInt(splitSpace[i+1]);
                            i++;
                            
                        }else if(splitSpace[i]=="max"){
                            objValue.max=parseInt(splitSpace[i+1]);
                            i++;
                        }
                        else if(splitSpace[i]!=";"){
                            objValue=parseInt(splitSpace[i]);
                            i++;
                        }
                        
                        
                        //reset variable for multiple
                        if(i==splitSpace.length||splitSpace[i]==";"||splitSpace[i+1]==undefined){      
                            var idxVariable=this.findIndexArrayObject(this.currentScene.variable,"type",objVar.type);
                            objVar.value=this.copy(objValue);

                            if(idxVariable==-1){
                                if(this.customLoadData.variable==null)this.customLoadData.variable=[];
                                if(this.customLoadData.variable.indexOf(objVar.type)==-1)this.customLoadData.variable.push(objVar.type);
                                this.currentScene.variable.push(this.copy(objVar));
                                // objVar={
                                //     type:splitSpace[i],
                                //     value:(bolRandom==false)?parseInt(splitSpace[i+2]):objValue,
                                //     operator:splitSpace[i+1]
                                // };
                            }else{
                                this.currentScene.variable[idxVariable].value=objVar.value;
                                this.currentScene.variable[idxVariable].operator=objVar.operator;
                            }                      
                            // 
                            if(i!=splitSpace.length)objVar={type:splitSpace[i+1],operator:splitSpace[i+2]};
                            objValue={};
                            i+=2;
                        }
                    }                    
                break;
                case "DRESSUP.":
                    this.lastSceneFormat="dressup";
                    this.bolEmptyLine=false;                    
                    this.currentScene.animEffect={type:"dress_up",char:[]};
                    if(this.currentScene.option==null)this.currentScene.option=[{"sceneID": 0}];

                    if(this.customLoadData.duTheme==null)this.customLoadData.duTheme=["Amy"];
                    var nameWithSpace=this.capitalizeFirstLetter(splitSpace[1].replace("_"," "));
                    if(this.customLoadData.duTheme.indexOf(this.capitalizeFirstLetter(splitSpace[1]))==-1)this.customLoadData.duTheme.push(nameWithSpace);

                    var objOption={"sceneID":nameWithSpace};
                    if(splitSpace.length>=5){
                        for(var i=2;i<splitSpace.length-2;i++){
                            if(splitSpace[i]=="COST."){
                               objOption.cost={};
                               var bolValue=(splitSpace[i+2].toLowerCase() === "true");
                               objOption.cost[splitSpace[i+1]]=(parseInt(splitSpace[i+2]).toString()=="NaN")?bolValue:parseInt(splitSpace[i+2]);
                            }
                            if(splitSpace[i]=="REWARD."){
                                objOption.reward={};
                                objOption.reward[splitSpace[i+1]]=parseInt(splitSpace[i+2]);
                            }
                        }                        
                        
                    }else if(splitSpace.length>2){
                        this.showError("need cost or reward param",line);
                    }
                    this.currentScene.option.push(this.copy(objOption));                    
                break;
                case "ANIMEFFECT.":                    
                    if(this.lastSceneFormat=="animEffect"||this.lastSceneFormat=="walk_out")this.createNewScene(true);
                    
                    var key=splitSpace[1];
                    var arrNewKey=["flashbackEnd","zoomIn","zoomPan","freezeFrame","loveGender","loveGenderEnd","walkIn","walkOut","inputName","dressUp","textChat"];
                    if(arrNewKey.indexOf(key)>=0)key=splitSpace[1].replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
                    
                    if(key.toLowerCase().substr(0,5)=="trans"&&this.lastSceneFormat!="characters"&&this.lastSceneFormat!=""){
                        if(this.bolEmptyLine==false) this.createNewScene(true);

                        this.charactersData={};                
                        this.currentScene.char=[];
                    }

                    this.lastSceneFormat="animEffect";
                    this.bolEmptyLine=false;  
                    this.lastAnimEffect=splitSpace[1].toLowerCase();                   
                    
                    if(key=="trans1"||key=="trans0"||key=="flashback_end"){
                        this.tempObject=[];
                        this.animEffect=null;
                        this.particleData=null;
                        this.singleParticleData=[];
                    }
                    
                    if(key=="zoom_in"){
                        if(splitSpace.length<3)this.showError("animEffect type or name is missing",line);
                        var charName=splitSpace[2].replace(/@/g, '');
                        this.currentScene.animEffect={type:"zoom_in", char:[this.capitalizeFirstLetter(charName.replace("_"," "))]};

                        if(this.animEffect==null)this.animEffect={};
                        // this.currentScene.animEffect=this.copy(this.merge(this.animEffect,this.currentScene.animEffect));
                        

                        this.animEffect=this.copy(this.merge(this.animEffect,this.currentScene.animEffect));                        

                    }else if(key=="freeze_frame"){                        
                        this.currentScene.animEffect={type:"freeze_frame", char:[]};

                        var obj={
                            bg:"#000000",
                            anim:"ANIM_IDLE",
                            emotion:"EMO_NEUTRAL",
                            faceTo:"left",
                            handheld:""
                        };
                        var idxText=0;    
                        var arrProp=["timeAlive","sfxStart","sfxText"];                    
                        for(var i=2;i<splitSpace.length;i++){                                             
                            if(splitSpace[i]=="type"){
                                this.currentScene.animEffect.frame_type=parseInt(splitSpace[i+1]);
                            }
                            else if(splitSpace[i]=="emo"){
                                obj.emotion=splitSpace[i+1];
                                if(i+1>idxText)idxText=i+1;
                            }
                            else if(splitSpace[i].indexOf("@")>=0){
                                obj.name=this.capitalizeFirstLetter(splitSpace[i].replace(/@/g, '').replace("_"," "));
                                if(i+1>idxText)idxText=i+1;
                            }
                            else if(arrProp.indexOf(splitSpace[i])>=0){
                                this.currentScene.animEffect[splitSpace[i]]=this.setPropertiesValue(splitSpace[i+1]);
                                if(i+1>idxText)idxText=i+1;
                                if(splitSpace[i]=="sfxStart"||splitSpace[i]=="sfxText"){
                                    this.addToCustomLoad("sfx",splitSpace[i+1]);
                                }
                            }
                            else if(obj[splitSpace[i]]!=null){
                                obj[splitSpace[i]]=splitSpace[i+1];
                                if(i+1>idxText)idxText=i+1;      
                                if(splitSpace[i]=="bg"){
                                    this.addToCustomLoad("bg",splitSpace[i+1]);
                                }
                            }              
                        }
                       
                        this.currentScene.animEffect.char.push(obj);                        
                        this.currentScene.text=splitSpace.slice(idxText + 1).join(" ");
                        this.currentScene.char=[];
                        
                    }
                    else if(key=="love_gender"){
                        this.bolEmptyLine=false;
                        this.currentScene.animEffect={type:"love_gender"};
                        this.numSceneChoice=this.currentScene.sceneID;  
                        this.numSceneEndChoices=[];
                    }else if(key=="love_gender_end"){
                        this.bolEmptyLine=false;
                        this.lastAnimEffect="";
                        for(var i=0;i<this.numSceneEndChoices.length;i++){                           
                            this.sceneData[this.numSceneEndChoices[i]].linkSceneID=this.currentScene.sceneID;
                        }
                    }
                    else{
                        if(splitSpace.length<2)showError("no attribute in animEffect",line);
                        this.currentScene.animEffect={type:key};
                        if(splitSpace.length>3){
                            for(var i=2;i<splitSpace.length;i++){
                                if(i%2==0){                
                                                       
                                    if(splitSpace[i]=="textDelay"){
                                        this.currentScene["text_delay"]=parseFloat(splitSpace[i+1]);
                                    }else{
                                        this.currentScene.animEffect[splitSpace[i]]=this.setPropertiesValue(splitSpace[i+1]);
                                    }
                                }
                            }
                        }
                        else if(splitSpace.length==3){
                            if(splitSpace[2].substr(0,1)=="#"){
                                this.currentScene.animEffect.color=splitSpace[2];
                            }else this.currentScene.animEffect.name=splitSpace[2];
                        } 
                        
                        if(key=="zoom_pan"||key=="zoomPan"){
                            if(this.animEffect==null)this.animEffect={};
                            this.currentScene.animEffect=this.copy(this.merge(this.animEffect,this.currentScene.animEffect));
                            

                            this.animEffect=this.copy(this.merge(this.animEffect,this.currentScene.animEffect));
                            if(this.animEffect.time!=null) delete this.animEffect.time;
                            
                        }                        
                        else if((key=="heartbeat"||key=="pulse"||key=="hover")&&splitSpace[2]=="remove")
                        {
                            this.currentScene.animEffect={
                                type:key,
                                remove:true
                            };
                            this.animEffect=null;                            
                        }
                        else if((key=="heartbeat"||key=="pulse"||key=="hover")&&this.currentScene.animEffect.time==-1){                            
                            if(this.animEffect==null)this.animEffect={};
                            
                            this.currentScene.animEffect=this.copy(this.merge(this.animEffect,this.currentScene.animEffect));                            
                            this.animEffect=this.copy(this.merge(this.animEffect,this.currentScene.animEffect));                            
                        }
                        else if(key=="zoom_out"||key=="zoomOut"){
                            this.animEffect=null;
                        }                        
                    }
                    
                break;
               }
        }
    },
    capitalizeFirstLetter:function(string) {
        if(string==null)return null;
        else if(string.split(" ").length>1){ //have space            
            return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        }
        else if(string.length==1) return string.charAt(0).toUpperCase();
        else if(string.length==0) return string;

        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    },
    setCharData:function(splitSpace,isBreak=true){        
        //fill in default data for a char. used in CHARACTERS.
        var arrChar=[];
        //      "name": "Amy",
        // "faceTo": "right",
        // "anim": "ANIM_MOUTH",
        // "emotion": "EMO_NEUTRAL",
        // "handheld": "",
        // "position": "center"
        var name=splitSpace[0].substr(1);
        var currentChar={};
        currentChar.name=this.capitalizeFirstLetter(name.replace("_"," "));
        
        

        if(this.customLoadData.character==null)this.customLoadData.character=[];
        if(this.customLoadData.character.indexOf(currentChar.name)==-1)this.customLoadData.character.push(currentChar.name);
        
        if(this.charactersData[currentChar.name]==null){
            this.charactersData[currentChar.name]={name:currentChar.name};
            if(this.charName.indexOf(name)==-1)this.charName.push(splitSpace[1].toUpperCase());
        }
        
        for(var i=1;i<splitSpace.length;i++){                       
            if(splitSpace[i].toLowerCase()=="anim"){
                this.charactersData[currentChar.name].anim=splitSpace[i+1].toUpperCase();                
            }
            else if(splitSpace[i].toLowerCase()=="position"||(splitSpace[i].toLowerCase()=="to"&&this.lastSceneFormat=="walk_in")){
                this.charactersData[currentChar.name].position=splitSpace[i+1].toLowerCase();                                
            }
            else if(splitSpace[i].toLowerCase()=="faceto"){
                this.charactersData[currentChar.name].faceTo=splitSpace[i+1].toLowerCase();                                
            }
            else if(splitSpace[i].toLowerCase()=="posx"){
                this.charactersData[currentChar.name].posX=parseFloat(splitSpace[i+1]);
                this.charactersData[currentChar.name].position=null;
            }
            else if(splitSpace[i].toLowerCase()=="posy"){
                this.charactersData[currentChar.name].posY=parseFloat(splitSpace[i+1]);
                this.charactersData[currentChar.name].position=null;
            }
            else if(splitSpace[i].toLowerCase()=="emo"){
                this.charactersData[currentChar.name].emotion=splitSpace[i+1].toUpperCase();                
            }
            else if(splitSpace[i].toLowerCase()=="shadow"){
                this.charactersData[currentChar.name].shadow=this.setPropertiesValue(splitSpace[i+1]);                
            }
            else if(splitSpace[i].toLowerCase()=="tint"){
                if(splitSpace[i+1]=="none"){
                    delete this.charactersData[currentChar.name].tint;
                }
                else{
                   this.charactersData[currentChar.name].tint=this.setPropertiesValue(splitSpace[i+1]);                 
                }        
            }
            else if(splitSpace[i].toLowerCase()=="handheld"){
                var handheldObj=splitSpace[i+1].toLowerCase();
                
                if(handheldObj=="none")handheldObj="";
                this.charactersData[currentChar.name].handheld=handheldObj;                                
                
                if(this.customLoadData.object==null&&handheldObj!="")this.customLoadData.object=[];
                if(handheldObj!=""&&this.customLoadData.object.indexOf(handheldObj)==-1){
                    this.customLoadData.object.push(handheldObj);                    
                }
            }
            else if(splitSpace[i].toLowerCase()=="outfit"){
                var outfitName=splitSpace[i+1].toLowerCase().replace("_","");
                this.charactersData[currentChar.name].outfit=outfitName;  

                //any clothes for AMY should be in duTheme. All clothes for other characters is in outfit.
                if(currentChar.name.toLowerCase()!="amy"){
                    if(this.customLoadData.outfit==null)this.customLoadData.outfit=[];
                    if(this.customLoadData.outfit.indexOf(outfitName)==-1)this.customLoadData.outfit.push(outfitName);              
                }
                else if(currentChar.name.toLowerCase()=="amy"){
                    if(this.customLoadData.duTheme==null)this.customLoadData.duTheme=["Amy"];
                    if(this.customLoadData.duTheme.indexOf(outfitName)==-1)this.customLoadData.duTheme.push(outfitName);              
                }
            }
            else if(splitSpace[i].toLowerCase()=="anim_delay"||splitSpace[i].toLowerCase()=="animdelay"){
                this.charactersData[currentChar.name].anim_delay=parseFloat(splitSpace[i+1]);                
            }
            else if(splitSpace[i].toLowerCase()=="animspeed"){
                this.charactersData[currentChar.name].animSpeed=parseFloat(splitSpace[i+1]);                
            }
            else if(splitSpace[i].toLowerCase()=="scale"){
                this.charactersData[currentChar.name].scale=parseFloat(splitSpace[i+1]);                
            }
            else if(i==splitSpace.length-1||splitSpace[i].toLowerCase()==";"){    //end of text                
                
                if(this.charactersData[currentChar.name].anim==null||this.charactersData[currentChar.name].anim==""){
                    this.charactersData[currentChar.name].anim="ANIM_IDLE";
                }
                if(this.charactersData[currentChar.name].emotion==null||this.charactersData[currentChar.name].emotion==""){
                    this.charactersData[currentChar.name].emotion="EMO_NEUTRAL";
                }
                if(this.charactersData[currentChar.name].hasOwnProperty("posX")==false&&(this.charactersData[currentChar.name].position==null||this.charactersData[currentChar.name].position=="")){
                    this.charactersData[currentChar.name].position="left";
                }
                // arrChar.push(this.copy(this.charactersData[currentChar.name]));
                if(i<splitSpace.length-1){
                    currentChar={name:this.capitalizeFirstLetter(splitSpace[i+1].substr(1).replace("_"," "))};
                    
                    if(this.charactersData[currentChar.name]==null){
                        this.charactersData[currentChar.name]={name:currentChar.name};
                        if(this.charName.indexOf(splitSpace[i+1])==-1)this.charName.push(splitSpace[i+1].toUpperCase());
                    }

                    if(this.customLoadData.character==null)this.customLoadData.character=[];
                    if(this.customLoadData.character.indexOf(currentChar.name)==-1)this.customLoadData.character.push(currentChar.name);                    
                }
            }else if(i%2==1&&isBreak==true){            
                //not prop                
                break;
            }
        }
        
        Object.keys(this.charactersData).forEach(obj => {
            var objCopy=this.copy(this.charactersData[obj]);
            objCopy.name=obj;            
            arrChar.push(objCopy);
        });
        
        return arrChar;
    },
    addToCustomLoad:function(type,value){
        if(this.customLoadData[type]==null)this.customLoadData[type]=[];
        if(this.customLoadData[type].indexOf(value)==-1&&value.substr(0,1)!="#")this.customLoadData[type].push(value);
    },
    setPropertiesValue:function(val){
        if(val.toLowerCase()=="true"||val.toLowerCase()=="false"){
        {
            return val.toLowerCase()==="true";
        }
        }else if(parseFloat(val).toString()!="NaN")
        {
            return parseFloat(val);
        }
        
        return val;
    },
    setChoiceCostReward:function(splitSpace){
        var objOption={};
        for(var i=0;i<splitSpace.length-2;i++){
            if(splitSpace[i]=="COST."){
               objOption.cost={};
               var bolValue=(splitSpace[i+2].toLowerCase() === "true");
               objOption.cost[splitSpace[i+1]]=(parseInt(splitSpace[i+2]).toString()=="NaN")?bolValue:parseInt(splitSpace[i+2]);
            }
            if(splitSpace[i]=="REWARD."){
                objOption.reward={};
                objOption.reward[splitSpace[i+1]]=parseInt(splitSpace[i+2]);
            }
            if(splitSpace[i]=="SET_INTEGER."){
                var obj={
                    sceneID:this.currentScene.sceneID,
                    type:splitSpace[i+1],
                    operator:splitSpace[i+2],
                    value:parseInt(splitSpace[i+3])
                };
                this.dataVariable.push(obj);
                if(this.customLoadData.variable==null)this.customLoadData.variable=[];
                if(this.customLoadData.variable.indexOf(splitSpace[i+1])==-1)this.customLoadData.variable.push(splitSpace[i+1]);
            }
            if(splitSpace[i]=="SET_BOOLEAN."){
                var obj={
                    sceneID:this.currentScene.sceneID,
                    type:splitSpace[i+1],
                    value:(splitSpace[i+2].toLowerCase() === "true")
                };
                this.dataVariable.push(obj);
                if(this.customLoadData.variable==null)this.customLoadData.variable=[];
                if(this.customLoadData.variable.indexOf(splitSpace[i+1])==-1)this.customLoadData.variable.push(splitSpace[i+1]);
            }
        }
        return objOption;
    },
    setWalkInData:function(type,splitSpace,firstWord="walk"){
        var animEffectData={type:type, char:[]};
        var data={name:this.capitalizeFirstLetter(splitSpace[1].replace("@","").replace("_"," "))};
        if(type=="walk_out"||type=="fade_out")this.charWalkOut.push(data.name);

        if(this.charactersData[data.name]==null){
            this.charactersData[data.name]={};
            if(this.charName.indexOf(splitSpace[1])==-1)this.charName.push(splitSpace[1].toUpperCase());
        }

        // if(type!="fade_in"&&type!="fade_out"){
            if(splitSpace.indexOf('type')==-1&&splitSpace.indexOf('anim_during')==-1){
                data.anim="ANIM_WALK";
            }
            if(splitSpace.indexOf('shadow')==-1&&this.charactersData[data.name].shadow!=null){
                data.shadow=this.charactersData[data.name].shadow;
            }
            if(splitSpace.indexOf('handheld')==-1&&this.charactersData[data.name].handheld!=null){
                data.handheld=this.charactersData[data.name].handheld;
            }
            if(splitSpace.indexOf('tint')==-1&&this.charactersData[data.name].tint!=null){
                data.tint=this.charactersData[data.name].tint;
            }
        // }

        for(var i=2;i<splitSpace.length;i++){
            if(splitSpace[i]=="time"){                
                data.time=this.setPropertiesValue(splitSpace[i+1]);
            }
            else if(splitSpace[i]=="from"){                
                data.from=splitSpace[i+1];
            }
            else if(splitSpace[i]=="speed"){
                data.speed=parseFloat(splitSpace[i+1]);
            }
            else if(splitSpace[i]=="handheld"){
                this.charactersData[data.name].handheld=splitSpace[i+1];
                data.handheld=splitSpace[i+1];                
            }
            else if(splitSpace[i]=="tint"){
                if(splitSpace[i+1]=="none"){
                    delete this.charactersData[data.name].tint;
                }
                else{
                    this.charactersData[data.name].tint=splitSpace[i+1];
                    data.tint=splitSpace[i+1];                
                }
            }
            else if(splitSpace[i]=="to"){     
                if(data.from==null)data.from=this.charactersData[data.name].position;
                if(type=="walk_out") {
                    data.from=splitSpace[i+1];
                }
                else {
                   
                    this.charactersData[data.name].position=splitSpace[i+1];                       
                }
            }
            else if(splitSpace[i]=="anim"||splitSpace[i]=="anim_after"||splitSpace[i]=="animAfter"){
                this.charactersData[data.name].anim=splitSpace[i+1];
            }
            else if(splitSpace[i]=="type"){
                data.anim="ANIM_"+splitSpace[i+1].toUpperCase();
            }
            else if(splitSpace[i]=="anim_during"||splitSpace[i].toLowerCase()=="animduring"){
                data.anim=splitSpace[i+1];
            }
            else if(splitSpace[i]=="rear"){
               data.rear=true;
            }
            else if(splitSpace[i].toLowerCase()=="faceto"||splitSpace[i].toLowerCase()=="faceto_after"||splitSpace[i].toLowerCase()=="facetoafter"){
                this.charactersData[data.name].faceTo=splitSpace[i+1];
            }
            else if(splitSpace[i].toLowerCase()=="faceto_during"||splitSpace[i].toLowerCase()=="facetoduring"){
                data.faceTo=splitSpace[i+1];
            }
            else if(splitSpace[i]=="shadow"){
                this.charactersData[data.name].shadow=this.setPropertiesValue(splitSpace[i+1]);
                data.shadow=this.charactersData[data.name].shadow;
            }
            else if(splitSpace[i]=="emo"||splitSpace[i]=="emo_after"||splitSpace[i].toLowerCase()=="emoafter"){
                this.charactersData[data.name].emotion=splitSpace[i+1];
            }
            else if(splitSpace[i]=="emo_during"||splitSpace[i].toLowerCase()=="emoduring"){
                data.emotion=splitSpace[i+1];
            }
            else if(splitSpace[i]=="outfit"){
                this.charactersData[data.name].outfit=splitSpace[i+1];
                var outfitName=splitSpace[i+1].toLowerCase().replace("_","");
                
                if(data.name.toLowerCase()!="amy"){
                    if(this.customLoadData.outfit==null)this.customLoadData.outfit=[];
                    if(this.customLoadData.outfit.indexOf(outfitName)==-1)this.customLoadData.outfit.push(outfitName);              
                }
                else if(data.name.toLowerCase()=="amy"){
                    if(this.customLoadData.duTheme==null)this.customLoadData.duTheme=["Amy"];
                    if(this.customLoadData.duTheme.indexOf(outfitName)==-1)this.customLoadData.duTheme.push(outfitName);              
                }                
            }
            else if(splitSpace[i]==";"||i==splitSpace.length-1){              
                animEffectData.char.push(this.copy(data)); 
                var idx=this.findIndexArrayObject(this.currentScene.char,"name",data.name);
                if(idx>=0)
                    this.currentScene.char[idx]=this.copy(this.charactersData[data.name]);
                else this.currentScene.char.push(this.copy(this.charactersData[data.name]));                

                if(i<splitSpace.length-1){
                    data={name:this.capitalizeFirstLetter(splitSpace[i+1].replace("@","").replace("_"," "))};                    
                    if(splitSpace.indexOf('type')==-1){
                        data.anim=firstWord;
                    }
                    if(type=="walk_out"||type=="fade_out")this.charWalkOut.push(data.name);                    
                    if(this.charactersData[data.name]==null){
                        this.charactersData[data.name]={};
                        if(this.charName.indexOf(splitSpace[i+1])==-1)this.charName.push(splitSpace[i+1].toUpperCase());
                    }
                }
            }
        }
        return animEffectData;      
    }
}