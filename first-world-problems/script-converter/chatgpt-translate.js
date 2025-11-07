// Initial import of openai npm package
// import OpenAI from "openai";

var test=false; //set true: disable chatGPT. false: translating
// if(test==false){
  var lmstudio = require('@lmstudio/sdk');
  const { LMStudioClient } = lmstudio;
  const client = new LMStudioClient();
  var model;
// }
var fs = require('fs');


// const model = await client.llm.model("gemma-3-4b-it");

var arrText={};
var translatedText={};
var arrChapterData={};

// const openai = new oai({
//    apiKey: process.env.CHATGPT_SECRETKEY
// });

// var arrLanguage=["Indonesia"];
// var arrLanguageCode=["id"];

// var arrLanguage=["Russian","Chinese (Simplified)","Korea","Japanese","German","Spanish","Dutch"];
// var arrLanguageCode=["ru","cn","kr","jp","de","es","nl"];

// var arrLanguage=["Chinese (Traditional)"];
// var arrLanguageCode=["tw"];

// var arrLanguage=["German","Spanish","Dutch"];
// var arrLanguageCode=["de","es","nl"];

var arrLanguage=["Chinese (Simplified)"];
var arrLanguageCode=["cn"];

// var arrLanguage=["Chinese (Simplified)"];
// var arrLanguageCode=["cn"];
var totalScenesInBatch=1;

// var arrLanguage=["Russian","Japanese"];
// var arrLanguageCode=["ru","jp"];

// var arrLanguage=["Russian","Japanese","Korean","Chinese (Simplified)","Chinese (Traditional)"];
// var arrLanguageCode=["ru","jp","kr","cn","tw"];

var languageInput = "";
var languageCode = "";
var fileName = process.argv[2];
var folderPath = "../media/text/translate/";
var idxLanguage=-1;
var totalFiles=0;
var currentIdxFiles=0;
var arrNames=["NAME"];
var arrDynamicCharacter=[];

async function loadModel() {
    // model = await client.llm.model("gemma-3-4b-it");
    if(test==false)model = await client.llm.model("darkidol-llama-3.1-8b-instruct-1.2-uncensored");
    
    readFile("../lib/settings.js","_GAMESETTING",function(obj,data){  
      arrNames=[...obj._DATAGAME["neutral_boy"], ...obj._DATAGAME["neutral_girl"], ...obj._DATAGAME["dynamic_name"]];  
      // readFile(folderPath+"dynamic_character.en.js",null,function(data){ 
      //   var _LANG={"en":{}};
      //   if(data)eval(data);
      //   arrDynamicCharacter=Object.keys(_LANG["en"]["dynamic_character"]);
        
        //remove char name
         // arrDynamicCharacter=arrDynamicCharacter.filter(item => !arrNames.includes(item));     
         translateLanguage();
      // }); 
      
    });

}

loadModel();


function translateLanguage(){
  translatedText={};
  if(idxLanguage<arrLanguageCode.length-1){    
    idxLanguage++;
    languageInput=arrLanguage[idxLanguage];
    languageCode=arrLanguageCode[idxLanguage];
    currentIdxFiles=0;
  }else return;
  console.log(languageCode+" "+languageInput+" "+fileName);

  if(fileName!=undefined){
    totalFiles=1;
    
    if(fileName.toLowerCase()=="strings.en.js"){
      processStringsFile();    
    }else{
      processFile(folderPath,fileName);
      // translateLanguage();
    }
  }else{
    translateAll();
  }
  
}

function readFile(path,varName,functComplete){
   var inputStreamCharacterData = fs.createReadStream(path);
   var dataRead="";
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

function exportFile (path,data) {
   var outputStream = fs.createWriteStream(path);
   outputStream.write(data);  
   outputStream.end();  
}

function nextNested(split) {    
   //split currentKey to get properties
   var arrSplitKey=currentKey.split(".");   
   var strParent=arrSplitKey.slice(0,-1).join(".");
   //get the parent object
   var objParent=eval(strParent);
   var keys=Object.keys(objParent);
   var idx=keys.indexOf(arrSplitKey[arrSplitKey.length-1]);

   //check if it's the last properties in parent object
   if(idx>=keys.length-1){
      //done nested
      idxKey++;
      loopStrings(stringsResult);
   }else{
      //next nest
      var nextKey=keys[idx+1];
      currentKey=strParent.concat(".",nextKey);
      loopStrings(objParent[nextKey],true);
   }
}

var arrKey=[];
var stringsResult;
var idxKey=0;
var currentKey="";
function loopStrings (split,nested){ 
   var object=split[arrKey[idxKey]];  
   if(nested==true){
      object=split;
   }else{
      console.log("------------"+idxKey+" "+arrKey.length+" "+currentKey);
      if(idxKey>=arrKey.length){
         //translate strings is done
         // console.log(stringsResult);         
         stringsResult["lang"]["label"]=languageInput.toUpperCase();
         stringsResult["lang"]["basePath"]="media/graphics/translate/".concat(languageCode.toLowerCase());
         var dataStr='var _LANG = _LANG || {}; \n _LANG["'+languageCode+'"]'.concat('=',JSON.stringify(stringsResult,null,1),';');
         exportFile(folderPath+"../strings."+languageCode+".js",dataStr);    
         translateLanguage();     
         return;
      }
   }

   
   if(nested!=true)currentKey="stringsResult".concat(".",arrKey[idxKey]);
   // console.log("current key : "+arrKey[idxKey]);
   //object 1st part lang, color, button, etc
   var arr=[];
   
   for(let partkey in object){      
      var partObject=object[partkey];
      if(!partObject || typeof(partObject) != 'object' )
      {
         //object filled with strings
         if(partObject.substr(0,1)!="#"&&partObject.substr(0,5)!="media"&&parseInt(partObject).toString()=="NaN")//skipped color code media path     
            arr.push(partObject);
      }else if(partObject instanceof Array ){
        //object filled with array
         for(var i=0;i<partObject.length;i++){
            if(parseInt(partObject[i]).toString()=="NaN"&&partObject[i].substr(0,1)!="#"&&partObject[i].substr(0,5)!="media")//skipped color code media path     
              arr.push(partObject[i]);
         }
      }
      else{
        //object within object. 
        currentKey=currentKey.concat(".",partkey);        
        loopStrings(partObject,true);
        nested=true;
        break;
      }
   }

   if(nested!=true){
      if(arr.length>0){
         getResponse("strings",arr);         
      }
      else {        
         idxKey++;
         console.log("=================="+idxKey+" "+arrKey.length+" "+currentKey);         
         loopStrings(split);
      }
   }else{
      if(arr.length>0){
         console.log("before response "+currentKey+" : "+arr);
         getResponse("strings",arr);
      }
   }
}
function processStringsFile(){
  readFile(folderPath+"../strings.en.js",null,function(data){
    try{
      //removing comments in strings
      // eval(data);
      // console.log(_LANG);
      // var cleanedData = data.replace(/\/\/.*$/gm, '');
      // arrChapterData["strings"]=_LANG["en"].toString();    

      // var splitData=data.split("//START_OF_OBJECT")[1].replace(/\/\/.*$/gm, '');
      var str=data.split("_LANG['en'] = ")[1].trim().replace(/\/\/.*$/gm, '');                  
      
      // if(splitData.length==0)splitData=cleanedData.split('_LANG["en"]=')[1];
      // else splitData=splitData[1];
      
      var split=JSON.parse(str);  
      stringsResult=split;
      arrKey=Object.keys(split);
      idxKey=0;      
      
      loopStrings(split);   
    } catch(e){
      console.log(e);
      console.log("Strings format is not correct");
    }
  });
}
function translateAll(){
  totalFiles=0;
  currentIdxFiles=0;
  processStringsFile();
  
  fs.readdir(folderPath, (err, files) => {
    files.forEach(file => {      
       totalFiles++;       
      if(file.substr(file.length-6)==".en.js"){
        processFile(folderPath,file);
      }      
    });
  });
  
}

var idxText=0;
function processFile(folderPath,file){
  var filename=file.split(".")[0];
  var varName=capitalizeFirstLetter(filename);   
  readFile(folderPath+file,null,function(data){             
    //  //script text
    console.log(file+" readFile "+file.indexOf("_"));
    if(file.indexOf("_")==-1){    
      arrChapterData[varName]=data;
      // var split=JSON.parse(data.split("=")[1].trim().slice(0,-1));            
      var str=data.split('_LANG["en"]["'+varName+'"]=')[1].trim().slice(0,-1);            
      // var str=data.split('_LANG["en"]["'+varName+'"]=');            
      // console.log(str.length);
      // return;
      idxText=0;
      var split=JSON.parse(str);            
      arrText[varName]=[];
      var arrTranslate=[];

      for(var i=0;i<split.length;i++){
        if(split[i].text!=null&&split[i].text!="")
        {
          arrText[varName].push({text:split[i].text,id:i});
          if(arrTranslate.length<totalScenesInBatch){
            idxText=arrText[varName].length-1;
            //have text format
            if(split[i].text.indexOf("|")>=0){
              //remove text format with @2              
              split[i].text = split[i].text.replace(/\|.*?\|/g, '@2');              
            }

            arrNames.forEach((name, index) => {
              if(split[i].text.toLowerCase().indexOf(name.toLowerCase())>=0){
                var regex = new RegExp(name, 'gi'); // Create a case-insensitive regex for each word in arrA
                split[i].text = split[i].text.replace(regex, `*&${index}&*`);
              }
            });


            arrTranslate.push(split[i].text);
          }
        }
      }            
      getResponse(varName,arrTranslate);
      // getResponse(varName,arrText[varName]); 

    }else if(file=="dynamic_character.en.js"){

      varName="dynamic_character";
      arrChapterData[varName]=data;            
      var split=JSON.parse(data.split('_LANG["en"]["dynamic_character"]=')[1].trim().slice(0,-1));
      arrText[varName]=[];

      for(key in split){
        if(arrNames.indexOf(key)==-1){
          arrText[varName].push(split[key]["boy"]);
          arrText[varName].push(split[key]["girl"]);
        }
      }            
      getResponse(varName,arrText[varName]);          
    }else if(file=="chapter_list.en.js"){
       varName="chapter_list";
       var split=JSON.parse(data.split('_LANG["en"]["chapter_list"]=')[1].trim().slice(0,-1));
        arrText[varName]=[];

        for(i=0;i<split.length;i++){
          var objData=split[i];
          arrText[varName].push(objData.title);
          arrText[varName].push(objData.description);
        }
        // for(key in split){
        //   if(arrNames.indexOf(key)==-1){
        //     arrText[varName].push(split[key]["boy"]);
        //     arrText[varName].push(split[key]["girl"]);
        //   }
        // }            
        getResponse(varName,arrText[varName]);         
    }else{//chat message scripts
      
      varName=filename.toUpperCase();
      arrChapterData[varName]=data;
      var strSplit=data.split('_LANG["en"]["'+varName+'"]=');
      if(strSplit.length<=1){
        strSplit=data.split("_LANG['en']['"+varName+"']=");
      }

      var split=JSON.parse(strSplit[1].trim().slice(0,-1));
      
      arrText[varName]=[];

      for(var i=0;i<split.data.length;i++){
        if(split.data[i].text!=null&&split.data[i].text!="")
        {
          arrText[varName].push(split.data[i].text);
        }
      }          
      getResponse(varName,arrText[varName]);
    }
  });
  
}

function capitalizeFirstLetter(string) {
    if(string==null)return null;
    else if(string.length==1) return string.charAt(0).toUpperCase();
    else if(string.length==0) return string;

    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
function cleanJsonString(dirtyString) { 
    return dirtyString .replace(/,(?=\s*?[}\]])/g, '').replace(/([{,])(\s*?[,]+)/g, '$1'); // Remove consecutive commas 
}

function resultText(varName,data,oriText){  
  // if(test==true){
  //   console.log(data);
  //   return;
  // }
   var arrResponse=data;
   var dataStr="";

   // console.log(arrResponse);
   if(varName=="strings"){  
      var nested=false;
      if(currentKey.split(".").length>2)nested=true;

      var idx=0;
      //filling result with translated response
      var objParent=eval(currentKey);
      for(key in objParent){
         var partObject=objParent[key];
          if(!partObject || typeof(partObject) != 'object' )
         {
            //object filled with strings
            if(partObject.substr(0,1)!="#"&&partObject.substr(0,5)!="media"&&parseInt(partObject).toString()=="NaN")//skipped color code, media path, numbers
            {
               // setNestedProperty(stringsResult,currentKey.concat(key),arrResponse[idx]);               
               eval(currentKey.concat(".",key,"=",JSON.stringify(arrResponse[idx])));               
               
               idx++;
            }
         }else if(partObject instanceof Array ){
           //object filled with array
            for(var i=0;i<partObject.length;i++){
              if(parseInt(partObject[i]).toString()=="NaN"&&partObject[i].substr(0,1)!="#"&&partObject[i].substr(0,5)!="media")//skipped color code media path     
              {
               // setNestedProperty(stringsResult,currentKey.concat(key),arrResponse);
                eval(currentKey.concat(".",key,"[",i,"]=",JSON.stringify(arrResponse[idx])));
               // stringsResult[arrKey[idxKey]][key][i]=arrResponse[idx];
               idx++;
             }
            }
         }
      }
      if(currentKey.split(".").length>2)    {         
         nextNested(stringsResult);
      }else{
         //looping next index
         idxKey++;
         loopStrings(stringsResult);
      }
   }
   else if(varName=="dynamic_character"){
      var split=JSON.parse(arrChapterData[varName].split('_LANG["en"]["dynamic_character"]=')[1].trim().slice(0,-1));
      var idx=0;
      for(key in split){
        if(arrNames.indexOf(key)==-1){
         split[key]["boy"]=arrResponse[idx];
         idx++;
         split[key]["girl"]=arrResponse[idx];
         idx++;
         if(idx>arrResponse.length){
            console.log("translate text is longer than it should");
            break;
         }
       }
      }   
      dataStr='_LANG["'.concat(languageCode,'"]["dynamic_character"]=',JSON.stringify(split,null,1),";");
      exportFile(folderPath.concat(varName.toLowerCase(),".",languageCode,".js"),dataStr);  
      currentIdxFiles++;
      if(currentIdxFiles==totalFiles){
        translateLanguage();
      }
   } else if(varName=="chapter_list"){
      var split=JSON.parse(arrChapterData[varName].split('_LANG["en"]["chapter_list"]=')[1].trim().slice(0,-1));
      var idx=0;
      for(key in split){
        // if(arrNames.indexOf(key)==-1){
         split[key]["title"]=arrResponse[idx];
         idx++;
         split[key]["description"]=arrResponse[idx];
         idx++;
         if(idx>arrResponse.length){
            console.log("translate text is longer than it should");
            break;
         }
       // }
      }   
      dataStr='_LANG["'.concat(languageCode,'"]["chapter_list"]=',JSON.stringify(split,null,1),";");
      exportFile(folderPath.concat(varName.toLowerCase(),".",languageCode,".js"),dataStr);  
      currentIdxFiles++;
      if(currentIdxFiles==totalFiles){
        translateLanguage();
      }
   }else if(varName.indexOf("_")==-1){ 
      //DIALOG   
     console.log("erawerwaw"+arrResponse.length);
      if(!translatedText[languageCode])translatedText[languageCode]={};
      if(!translatedText[languageCode][varName])translatedText[languageCode][varName]=[];
      // for(var i=0;i<arrResponse.length;i++){
          // translatedText[languageCode][varName].push(arrResponse[0]);
      // } 

      var split=JSON.parse(arrChapterData[varName].split('_LANG["en"]["'+varName+'"]=')[1].trim().slice(0,-1));
      var idx=0;

      for(var i=0;i<arrResponse.length;i++){
        var idxArrText=(((idxText/totalScenesInBatch)-1)*totalScenesInBatch)+i;
        if(idxArrText<0||idxText<=totalScenesInBatch){
          idxArrText=i;
        }
        if(arrResponse[i].indexOf("@2")>=0){
          //switched back the text format    
          var findFormat=arrText[varName][idxArrText].text.match(/\|.*?\|/g);
          if(findFormat!=null){
            findFormat.forEach(format => {
              arrResponse[i] = arrResponse[i].replace('@2', format);
            });
          }

          
        }

        if(arrResponse[i].indexOf("*&")>=0){
          arrResponse[i] = arrResponse[i].replace(/\*&(\d)&\*/g, (match, idxName) => arrNames[idxName]);
        }

         //find dynamic_character words. any words with {}
        var resMatch=arrResponse[i].match(/\{([^}]+)\}/g);              
        if(resMatch!=null&&resMatch.length>0){
          var oriWord=oriText[i];
          var oriMatch=oriWord.match(/\{([^}]+)\}/g);  
          resMatch.forEach(function(value,index){               
            if(oriWord!=null&&oriMatch!=null&&i<oriText.length&&arrNames.indexOf(oriWord.substr(1,oriWord.length-2))==-1&&arrNames.indexOf(value.substr(1,value.length-2))==-1)
            {
              arrResponse[i]=arrResponse[i].replace(value,oriMatch[index]);              
            }else{
              console.log("=========",oriWord,"=======",arrResponse[i]);
            }
          });
        }

        translatedText[languageCode][varName].push(arrResponse[i]);        
      }
        
      if(idxText<arrText[varName].length-1){
        //50 scenes next batch for translation
        var arrTranslate=[];
        for(var i=1;i<=totalScenesInBatch;i++){
          idxText++;
          if(idxText<arrText[varName].length)
          {
            arrTranslate.push(arrText[varName][idxText].text);
          }
        }        
                
        getResponse(varName,arrTranslate);

      }else{
         var split=JSON.parse(arrChapterData[varName].split('_LANG["en"]["'+varName+'"]=')[1].trim().slice(0,-1));
        var idx=0;
         for(var i=0;i<split.length;i++){
            if(split[i].text!=null&&split[i].text!=""){
                split[i].text=translatedText[languageCode][varName][idx];      
                idx++;
            }    
          }
        // console.log("translate ",translatedText[languageCode][varName]);

        dataStr='_LANG["'+languageCode+'"]["'.concat(varName,'"]=',JSON.stringify(split,null,1),';');
        exportFile(folderPath.concat(varName.toLowerCase(),".",languageCode,".js"),dataStr);  
         currentIdxFiles++;
        if(currentIdxFiles==totalFiles){
          translateLanguage();
        }
      }
   }else{      
      var strSplit=arrChapterData[varName].split('_LANG["en"]["'+varName+'"]=');
      if(strSplit.length<=1){
        strSplit=arrChapterData[varName].split("_LANG['en']['"+varName+"']=");
      }

      var split=JSON.parse(strSplit[1].trim().slice(0,-1));
      var idx=0;
      for(var i=0;i<split.data.length;i++){
         if(split.data[i].text!=null&&split.data[i].text!=""){
            split.data[i].text=arrResponse[idx];      
            idx++;
         }    
      }
      // console.log(arrText);
      dataStr='_LANG["'+languageCode+'"]["'.concat(varName,'"]=',JSON.stringify(split,null,1),';');
      exportFile(folderPath.concat(varName.toLowerCase(),".",languageCode,".js"),dataStr);  
       currentIdxFiles++;
      if(currentIdxFiles==totalFiles){
        translateLanguage();
      }
   }
  
}

async function getResponse(varName, textData){
   if(test==true){
    translatedText=[];

    resultText(varName,translatedText, textData);
    // exportFile(folderPath.concat(varName.toLowerCase(),".",languageCode,".js"),JSON.stringify(textData));  
     // resultText(varName,textData,textData);
    return;
  }
  else{
    // Create a combined prompt 
    var textsToTranslate="";
    textsToTranslate = textData.map((text, index) => `${index + 1}. ${text}`).join('\n'); 

    var prompt;
    if(varName=="dynamic_character"||varName=="chapter_list"||varName=="strings"){
      prompt = `Translate the following texts from English to ${languageInput}, only show the result in ${languageInput}. Output in the same format :\n\n${textsToTranslate} `; 
    }
    else prompt = `Translate the following texts from English to ${languageInput}. Keep words inside curly brackets { } in English. Do not change curly bracket {} or straight brackets ||. Keep the translation short and straightforward. Only response the translation result with the same format. :\n\n${textsToTranslate} `; 
    
    try { 
      const result = await model.respond(prompt);    
      
      try{
          // Extract the translated texts 
          const translatedTexts = result.content.trim().split('\n').map((text) => text.replace(/^\d+\.\s*/, ''));    
          console.log(textData);
          console.log("==================translated==========");
          console.log(translatedTexts); 
          resultText(varName,translatedTexts, textData);        
      }catch(error){
         console.log("error",error);
          resultText(varName,textData, textData);
      }
    } catch (error) { console.error(error); }
  }
}


// readFile(file,null,function(data){
//   getResponse(data);
// });
// getResponse();