var cacheCounter=1;
var exportFiles={
    languageCode:"en",
    scriptExtension:"js",
    arrFiles:[],
    phpFile:"script-editor.php",
    init: function(){  
        this.arrFiles=[];
        convertFiles.resetCustomLoad();
        $.ajax({
            type:"POST",
            dataType: 'json',
            url: this.phpFile,
            data: {functionname: 'fetchFiles'},
            success: function(data) {                   
                this.readFile("../lib/settings.js","_ENGINE_VERSION",function(obj,data1){
                    convertFiles.engineVersion=obj;                    
                });                
                this.arrFiles=data;   
                this.exportAllScript();  
                
            }.bind(this),
        });
    },
    exportSingleScript:function(){
        var num=Number(document.getElementById('scriptNumber').value);
        var label=document.getElementById("error-script");
        if(num<=0)
        {            
            label.innerText="Invalid chapter. Make sure the value is >=1";
        }else label.innerText="";
        
        this.readFile("../media/text/scripts/chapter"+num+".en."+this.scriptExtension+"?"+cacheCounter,null,function(data){
            cacheCounter++;
            if(data==null)label.innerText="Script file not found.";
            else {
                label.innerText="";
                convertFiles.arrCustomLoad=[{}];
                this.doneLoadScript(data,"chapter"+num);                
                
                this.readFile("../media/text/customload.js","_CUSTOMLOAD",function(obj,data){                                        
                    obj.Chapter[num]=convertFiles.arrCustomLoad[1];
                    var dataStr = JSON.stringify(obj.Chapter, null, 1);  
                    var data='var _CUSTOMLOAD={Chapter:'.concat(dataStr,'};');
                    this.exportFile('../media/text/customload.js',data);
                }.bind(this));
                // this.exportCharData();
                this.exportDynamicCharacter();
            }
        }.bind(this));
        
    },

    rearrangeObject:function(oriObj,parent){
        var result=[{parent:null}];
         try{
             oriObj=JSON.parse(oriObj);
         }catch{
             //
         }

        for(key in oriObj){
            var object=oriObj[key];

            if(!object || typeof(object) != 'object' ) {
                //strings
                if(parent==null)result[0][key]=object;
                else{
                    var result1={parent:parent};
                    result1[key]=object;
                    return result1;
                }

            }else if( object instanceof Array ) {
                if(parent==null)result[0][key]=object;
                else {

                }
            }       
                
        }
    },
    
    testTranslate:function(){      
        var arrText=[];
        this.readFile("../media/text/strings-test.en.js",null,function(data){
            var cleanedData = data.replace(/\/\/.*$/gm, '');
            var splitData=cleanedData.split("_LANG['en'] =");
            if(splitData.length==0)splitData=cleanedData.split('_LANG["en"] =')[1];
            else splitData=splitData[1];

            var split=JSON.parse(splitData.trim());
            var resultObj=this.rearrangeObject(split);
            // arrText["strings"]=exportFiles.loopStrings(split);  
            
        }.bind(this));
      
    },
    exportCharData:function(){
        this.readFile("characters-data.js","charData",function(obj,data){             
            var data3=convertFiles.createCharactersData(obj);                                
            var dataVar='var charData='.concat(JSON.stringify(data3,null,1),';');
            this.exportFile('characters-data.js',dataVar);
        }.bind(this));      
    }, 
    exportDynamicCharacter:function(root,deleteName){
        if(!root&&root!="")root="../";
        
        this.readFile(root+"media/text/translate/dynamic_character.en.js",null,function(data){             
            var _LANG={en:{}};
            if(data!=null)eval(data);
            else _LANG["en"]["dynamic_character"]={};
            // console.log(_LANG["en"]["dynamic_character"]);
            var dataObj=_LANG["en"]["dynamic_character"];
            
            // var data1=data.split('_LANG["en"]["dynamic_character"]={');
            var data3=convertFiles.createDynamicCharacter(dataObj);    
            _LANG["en"]["dynamic_character"]=data3;
            if(deleteName){
                delete _LANG["en"]["dynamic_character"][deleteName];
            }
            var dataFinal='_LANG["en"]["dynamic_character"]='.concat(JSON.stringify(_LANG["en"]["dynamic_character"],null,1));            
            
            this.exportFile('../media/text/translate/dynamic_character.en.js',dataFinal);
        }.bind(this));      
    },
    readFile(path,varName,functComplete){        
        $.ajax({
            type:"GET",
            url: path+"?"+cacheCounter, 
            dataType:"text",
            error: function (xhr, ajaxOptions, thrownError) {
                
                if(functComplete){
                    functComplete(null);
                }
            }.bind(this),
            success: function(data) { 
                cacheCounter++;               
                if(varName!=null){
                    var getObject = new Function(data + "; return "+varName+";");
                    var obj=getObject();
                    if(functComplete)functComplete(obj,data);
                }else if(functComplete){
                    functComplete(data);
                }
            }.bind(this),
        });
    },
    toCharacterPage:function(){
        window.location.href="../character-preview.html";
    },
    updateSpriterData:function(basePath,data){
        if(!basePath)basePath="";
        if(data){
            var spriterData=convertFiles.createSpriterData(data);
            var data2=JSON.stringify(spriterData,null,1);    

            // removing {} at first char and the end 
            data2=data2.substr(1).substr(0,data2.length-2);                  
            this.readFile(basePath+"../lib/settings.js",null,function(dataAll){
                // eval(dataAll);
                
                // _GAMESETTING._DATAGAME.spriterData={};
                // _GAMESETTING._DATAGAME.neutral_boy=[];
                // _GAMESETTING._DATAGAME.neutral_girl=[];
                // _GAMESETTING._DATAGAME.dynamic_name=[];

                // var merge=convertFiles.merge(_GAMESETTING._DATAGAME,spriterData);                
                var data1=dataAll.split("//CODE_GENERATED");
                var data3=dataAll.split("//END_GENERATED");
                var dataFinal=data1[0].concat("//CODE_GENERATED \n",data2,"\n //END_GENERATED",data3[1]);
                // console.log("spriterData1 : ",data2);
                
                this.exportFile('../lib/settings.js',dataFinal);

                if(dataAll.indexOf("CODE_GENERATED")==-1){
                    convertFiles.showError("//CODE_GENERATED not found. The result may break settings.js");
                }
            }.bind(this));
            return;
        }

        this.readFile(basePath+"characters-data.js","charData",function(data){
            var spriterData=convertFiles.createSpriterData(data);
            var data2=JSON.stringify(spriterData,null,1);    

            // removing {} at first char and the end 
            data2=data2.substr(1).substr(0,data2.length-2);                  
            this.readFile(basePath+"../lib/settings.js",null,function(dataAll){
                // eval(dataAll);
                
                // _GAMESETTING._DATAGAME.spriterData={};
                // _GAMESETTING._DATAGAME.neutral_boy=[];
                // _GAMESETTING._DATAGAME.neutral_girl=[];
                // _GAMESETTING._DATAGAME.dynamic_name=[];

                // var merge=convertFiles.merge(_GAMESETTING._DATAGAME,spriterData);                
                var data1=dataAll.split("//CODE_GENERATED");
                var data3=dataAll.split("//END_GENERATED");
                var dataFinal=data1[0].concat("//CODE_GENERATED \n",data2,"\n //END_GENERATED",data3[1]);
                // console.log("spriterData : ",data2);
                
                this.exportFile('../lib/settings.js',dataFinal);

                if(dataAll.indexOf("CODE_GENERATED")==-1){
                    convertFiles.showError("//CODE_GENERATED not found. The result may break settings.js");
                }
            }.bind(this));
        }.bind(this))
    },
    idxScript:0,
    exportAllScript:function(idx){
        // for(var i=0;i<this.arrFiles.length;i++){
        if(!idx){
            idx=0;
            this.idxScript=0;
        }
        else idx=this.idxScript;
        
        var fileName=this.arrFiles[idx];
         $.ajax({
            type:"GET",
            url: "../media/text/scripts/"+fileName+"?"+cacheCounter, 
            dataType:"text",
            success: function(data) {   
                cacheCounter++;
                var str=fileName.split(".")[0];                
                this.doneLoadScript(data,str); 
                this.idxScript++;
                if(this.idxScript<this.arrFiles.length)this.exportAllScript(this.idxScript);                
                else {
                    //done all script
                    var dataCustomLoad=convertFiles.exportCustomLoad();  
                    this.exportFile('../media/text/customload.js',dataCustomLoad);
                    // this.exportCharData();
                    this.exportDynamicCharacter();
                }
            }.bind(this),
        });
    },
    exportFile:function (name,data,functComplete) {
        $.ajax({
            type:"POST",
            url: this.phpFile,
            data: {functionname: 'exportFile',file:data,filename:name},
            success: function(res) {                   
                if(functComplete)functComplete();
            }.bind(this),
        });
    },
    exportScript:function(jsonData, name, dialog,space,varName){
        var dataStr = JSON.stringify(jsonData, null, space);  
        var data='_LANG["en"]["'.concat(varName,'"]=',dataStr,';');
        
        $.ajax({
            type:"POST",
            url: this.phpFile,
            data: {functionname: 'exportScript',file:data,filename:name+'.en.js'},
            success: function(res) {   
                // console.log("writen "+name);             
            }.bind(this),
        });
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
        
    	
    	for(var i=0;i<this.splitScript.length;i++){
    		convertFiles.readScene(this.splitScript[i],i,nameFile);
    	}        
        // jsonData, name, dialog,space,varName
        convertFiles.setLinkSceneID();
        
        this.exportScript(convertFiles.sceneData,nameFile,"download",1,convertFiles.capitalizeFirstLetter(nameFile));
        convertFiles.resetAllSceneData();
       
    },
    showError:function(text,line){
        console.error(line+1,text);
    }
}
