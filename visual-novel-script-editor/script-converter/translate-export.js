var fs = require('fs');


// const model = await client.llm.model("gemma-3-4b-it");
var isExport=false;

var arrText={};
var translatedText={};
var arrChapterData={};

var arrLanguage=["Chinese (Simplified)"];
var arrLanguageCode=["zh"];

var totalScenesInBatch=600;

var languageInput = "";
var languageCode = "";
var fileName = process.argv[2];
var folderPath = "../media/text/translate/";
var idxLanguage=-1;
var totalFiles=0;
var currentIdxFiles=0;
var arrNames=["NAME"];
var arrDynamicCharacter=[];

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
   // if(test==true){
    translatedText=["你一直是个糟糕的学生。",
"后排。",
"高中最后一个提交作业的人。",
"突击测验是你最可怕的噩梦。",
"好吧，如果你在所有选择题中都圈出 A，那么你肯定会答对几道题，对吗？",
"这种逻辑在当时是有道理的。",
"这可能是班级平均成绩下降的原因。",
"在大学里，你有很多课程不及格。",
"您是如何获得心理学学位毕业的，真是个谜。",
"啊……那是一所网络大学。",
"由于运气好（以及爸爸的关系），你以某种方式获得了一份私人心理医生的工作......",
"*&0&* 关税王国。",
"这真是莫大的荣幸。",
"你显然不够格。不过，他们还是录用了你。",
"什么鬼？",
"*&0&* 安排了一个会议。",
"你是心理学家吗？",
"我听说过很多关于你的好事。@2 Big @2 的事情。实际上是最大的。",
"我期待这次会议能改变我的人生。否则……",
"总统先生，别担心，我会让您的精神恢复健康。",
"你是在暗示我的精神健康状况不佳吗？",
"抱歉，我不是故意的。我的意思是，让我们把@2做得更精彩一些@2。",
"太棒了...我喜欢那个声音！",
"那么，您今天最关心的是什么？",
"他们没有向你简要介绍我的担忧吗？",
"抱歉，我更喜欢重新开始我的课程。",
"我确信我的咖啡消费量已经达到了极端水平。",
"极端？怎么会这样？",
"我不再喝水，只喝咖啡。",
"听起来很危险。",
"这是唯一能让我维持正常功能的东西。",
"也许你应该减少一点？",
"你说得对。也许我应该对咖啡进口征收更多关税！",
"（关税？这就是你们的解决方案？）",
"（放松，呼吸……）",
"这是我的方法，我宁愿直接听到问题。",
"我又被邮件淹没了。光是读邮件标题就已经够我忙活了。",
"你至少得到了有趣的主题吗？",
"让我给你读几句。",
"主题行 1：紧急<br>主题行 2：我们处于危机中<br>主题行 3：WEN LAMBO<br>主题行 4：CRYPTO DEALZ<br>",
"听起来很严肃但很有趣。",
"WEN LAMBO 是什么意思？",
"这是我创造的一个术语。是我先创造的。他们应该用我的名字来命名这枚硬币。",
"（我不会进一步探讨这个话题）",
"（放松，深呼吸......我们可以完成这次会议）",
"往后退一点。你离我的头发太近了。",
"哦好的..",
"谢谢。",
"那么...你最近睡眠怎么样？",
"我一直在与噩梦作斗争。",
"普通的？还是总统级别的？",
"其中一人用一只会说话的猫来评判我的外交政策。",
"嗯。国内问题还是国际问题？",
"它没说话，只是不停地摇头叹气。",
"这太粗糙了。",
"然后我的关税牌变成了一个怪物并追着我跑。",
"当然。典型的关税局行为。",
"这个怪物一直试图给我喂玉米饼。",
"玉米卷？这不太常见。",
"我是说，我喜欢墨西哥卷饼。我喜欢它的一切。",
"（我必须在网上搜索有关玉米卷的信息才能知道这是什么意思）",
"您尝试过睡前写日记吗？",
"我做到了。太累了。",
"呼吸练习怎么样？只需轻轻吸气几次？",
"我不运动。我自豪地支持久坐。",
"对，当然了。",
"不管怎样，现在我的顾问说我需要“处理我的感受”。所以我就来了。",
"没错，就是情绪调节！超级粉丝。",
"我刚刚在……读到过这个内容",
"自助博客评论区。",
"我是来寻求真正指导的。你有执照吧？",
"我当然是。不过，智慧无处不在，哪怕是在评论区。",
"……听起来有点儿乱。不过还好。继续吧，自诩的评论区大师。",
"总统先生，这真是巨大的进步。接受自己的感受是第一步。",
"我没有接受它们，只是用自己编造的晦涩术语来描述它们。",
"差不多了！那你叫它们什么？",
"“情绪波动”、“思维飓风”，以及我引以为豪的“灵魂打喷嚏”。",
"（如果我做笔记，也许他会认为我知道自己在做什么。）",
"哇！主动现身处理情绪？太厉害了。",
"不习惯啊，被零食贿赂了。",
"经典的情感诱饵。",
"我还是不相信这个“​​处理”的事情。",
"我不需要处理。我就是处理器！",
"（处理器？我们现在谈论的是计算机吗？我一时之间完全懵了。）",
"说实话，我感觉很孤独。我想，身处高处，真的很孤独吧。",
"好的...",
"（我该在这里再说什么呢？）",
"...",
"你难道不应该多问问我的感受吗？",
"呃。这些闲聊让我有点昏昏欲睡。",
"（等等……我刚才是不是说漏嘴了？！）",
"（这个治疗师很可疑。）",
"咳咳。总之！我们继续吧。",
"很好。我还有很多行李要卸。",
"我洗耳恭听。",
"靠近点。我有个秘密要告诉你。",
"哦，秘密！（请多多指教……）",
"好吧，说出来吧。",
"算了，你的呼吸刚刚打到我脸上了。",
"后退。@2 立即@2。",
"（我不敢相信我竟然会相信这一点。）",
"不用低声说话。这里很安全。",
"我坚持！",
"美好的…",
"算了，你的呼吸刚刚打到我脸上了。",
"后退。@2 立即@2。",
"（我不敢相信我竟然会相信这一点。）",
"（我知道你在做什么，但我会配合你。）",
"那么，秘密是什么？",
"算了，你的呼吸刚刚打到我脸上了。",
"后退。@2 立即@2。",
"（我不敢相信我竟然会相信这一点。）",
"（抓住他了。双重恶作剧。仍然不败。）",
"不管怎样，这个秘密。我偷听到有人在背后议论我。",
"他们说我的词汇量很差。",
"坦白说，我很生气。",
"但我最厉害的地方是什么？我非常有钱。超级有钱。最有钱的。",
"总统先生，我认为他们不是指经济方面。",
"也许他们正在评论你的措辞。",
"拜托，我懂词。我有最好的词。",
"我的智商是最高的。也许他们只是嫉妒。",
"他们在我面前感到自己很渺小，这不是他们的错。",
"你跟我说话会不自在吗？嗯，你应该会。我觉得你确实会。",
"你现在看上去缺乏安全感。",
"好吧，我真是在天才面前。真是吓人。（咱们就这么定了，这样我就能活着看到明天了。）",
"我就是这么想的。",
"好的，我们继续。",
"让我们从基础开始。",
"我很想进一步了解你，从你的家人开始。",
"您会如何描述您的童年？",
"（挖掘我的背景故事？等等……这是在调情吗？）",
"嗯...我的童年和其他人一样。",
"我们并不富裕……",
"最多算是中产阶级。",
"像你这样的人称之为“中间”。",
"很高兴你了解我们的行话。我得承认，最近我有点用“mid”这个词了。",
"我记得当我的父母选择巴黎作为我们家庭度假的目的地时，我感到非常难过。",
"我真的很希望去马尔代夫。",
"就在那时，我意识到……我们很穷。真的很穷。",
"我们两个管家甚至都没法跟着去！",
"（……我不认为“穷人”会去巴黎度假。）",
"（也不知道人们会带他们的管家去度假）",
"那个痛苦的夏天在我心中燃起了一团火焰。",
"我发誓，无论怎样我都要变得富有。",
"这很鼓舞人心。那么……你的第一份工作是什么？",
"我从最底层做起。",
"我父亲公司的助理经理。",
"（……这就是底部吗？）",
"助理经理听起来还不错。",
"噢，已经跌到谷底了。",
"我没有助手。我@2 就是@2 助手！",
"我不得不亲自接电话。",
"我自己煮了咖啡。",
"说实话，我不知道那一周我是怎么熬过来的。",
"这真是艰难的一周，或许是最艰难的一周。",
"我认为没有人能够幸存下来。",
"（等一下，只持续一周？）",
"那确实很艰难。（不，一点也不！）",
"尽管如此，你还是成功了。",
"并不是每个人都能忍受全家去巴黎旅行并手动拨打电话。",
"它确实塑造了性格，你知道吗？",
"现在看看你，食物链顶端，总统什么的。",
"有时当我听到电话铃声时，我仍然会退缩。",
"创伤根深蒂固。",
"那么，您通常如何处理困难的情绪？",
"我把它们分类，锁起来，锁得很紧。",
"经典。然后呢？",
"然后我在他们周围筑起一道精神墙。",
"配备警卫。如果预算允许的话，也许还会配备坦克。",
"预算用于……情感防御？",
"是的。情感国土安全。",
"您觉得效果如何？",
"不太好。悲伤依然萦绕心头。",
"隧道始终是个问题。",
"没错！我说我们应该打更深的地基。",
"那么，当悲伤袭来时我们该怎么办？",
"向它收取关税。让它付费进入我的心。",
"你现在想对情绪征收关税吗？（而且我很惊讶你还有心）",
"是的。25%是眼泪，50%是怀旧。",
"那快乐呢？也要征税吗？",
"当然不是。乔伊有外交豁免权。",
"所以悲伤有回报，而快乐却能获得 VIP 通行证？",
"没错。乔伊乘坐私人飞机，无需安检。",
"听起来像是一个有缺陷的系统。",
"欢迎来到我的情感政府。",
"有什么改革计划吗？",
"也许吧。如果悲伤雇佣了一个说客。",
"你真是不可能。",
"在我赢得选举之前他们就是这么说的。",
"（我甚至不知道他是不是在开玩笑。）",
"你现在实际上@2 想要什么@2？",
"一架带性爱室的私人飞机。还有金色的马桶座。",
"（我也想要一个。等等……我不是这个意思。）",
"我指的是情感上。",
"哦。那么也许……是情感无敌？",
"很诱人，但我认为这就是超级恶棍诞生的方式。",
"如果您现在可以逃到任何地方，您会去哪里？",
"某个没有电话、没有头条新闻、没有责任的地方。",
"听起来就像天堂。",
"也许是戈尔巴利亚的圣山。",
"非常适合充电。",
"我的兄弟实际上是那里的一名僧侣。",
"哇。他为了内心的平静而放弃了富裕的生活？",
"不，我把他放逐了。我想继承一切。",
"您从未告诉过任何人的一件事是什么？",
"我通过抛硬币来做国家决策。三局两胜。",
"谢谢你对我的信任。",
"如果消息泄露，你就是我的首要嫌疑人。",
"（哦不，我在睡梦中说话！）",
"那么现在怎么办？你能治好我吗？",
"我是一名心理学家，而不是一名奇迹创造者。",
"应该和催眠师一起去。",
"太晚了。我按小时计费，而且不退款。",
"你胡言乱语真是浪费我的时间。",
"你正在接受治疗，你希望我只是点头而不说话吗？",
"……事实上，是的，我更喜欢自言自语。",
"因为我有一个非常好的大脑。",
"我的主要顾问是我自己，你知道，我是一个非常好的倾听者。",
"我可能是最棒的倾听者。比你好，比任何人都好。",
"（只是点头，什么也不说。）",
"好的，那么现在怎么办？",
"我们来尝试一下接地练习好吗？",
"简单来说，只需说出 5 件你能看到的东西。",
"很简单。我的倒影，我美丽的秀发，我的自尊，我迷人的晒痕……",
"等一下，只有四个。",
"继续前进。",
"呃……这是我最后的耐心，希望你不会要求第六个。",
"（注意。我会将其保持在五个。）",
"你在这方面出奇地好。",
"当然。我就是 GOAT。",
"也许我们现在可以先忽略感情，而去注重实际。",
"当你心烦意乱时什么能帮助你感到平静？",
"说实话？解雇某人。",
"……好吧。我们来找点积极的事情吧。",
"好吧。那就来个购物疗法吧。我买的袜子上镶着24K金。",
"循序渐进。脚踝也很漂亮。（我真不该大声说出来）",
"确实很豪华。",
"你在心上筑起一道墙，谁被困在里面？",
"...",
"我。",
"这实际上是非常有自知之明的。",
"我无意中驱逐了其他所有人。",
"那么我们就开始情感移民的过程吧。",
"只有通过氛围检查。",
"需要多少次治疗才能让我的情绪变得无敌？",
"治疗实际上并不是这样运作的。",
"如果我付双倍钱会怎样？",
"还是没有。",
"三倍，我就拥有了一个很酷的新个性。",
"情感成长是无法用金钱买到的。",
"哈。这听起来像是放弃者的说辞。",
"或者是真正做过这项工作的人。",
"我想我希望找到一条捷径。",
"没有。但你已经在做大多数人都会避免的事情了。",
"谈论感受？真恶心。",
"是的。谈论一些让人不舒服的事情。这才是真正的工作。",
"是的……只是，最近我甚至不知道自己在为何而努力，或者我到底是谁。",
"那么也许今天就是开始解决这个问题的好日子。",
"你没有迷路，你只是在休息。",
"迷路了？我这辈子从来没迷路过。",
"我曾经在雾中没有球童的情​​况下在高尔夫球场上行驶。",
"但是...也许你是说喘口气也没关系。",
"好吧。五分钟。然后我像进行敌对谈判一样控制自己的情绪。",
"正如俗话所说，我们不与人质谈判。",
"（很确定他不是那个意思）",
"让我们来了解一下你是谁，无需别人来塑造。",
"我知道我是谁。坚强。成功。秀发飘逸。牙齿整齐。",
"但如果还有……更多的东西给我，我想探索一下也无妨。",
"只要向我保证，不要涉及愿景板。",
"现在没有答案也没关系。",
"太荒谬了。我总有答案。问我任何事。关税之都？简单。",
"……等一下，别问我这个。",
"也许我@2 有点厌倦假装我已经把一切都弄明白了。",
"嗯...这次会议感觉改变生活的效果不够。",
"嘿，有人可以对我的治疗师进行背景调查吗？",
"我认为他是个骗子。",
"哎呀。*&0&* 对你进行了背景调查。",
"事实证明您的“认证”是……",
"3小时在线课程，还有电子证书。我猜对了！",
"你说你有执照！",
"我把我童年的创伤托付给你！",
"总统先生，我拥有技术许可。我可以把PDF文件发邮件给你。",
"它甚至还有水印。是 Comic Sans 字体。不过，就像正儿八经的 Comic Sans 字体一样。",
"保镖！快来！紧急情况！",
"总统先生",
"总统先生",
"赶紧把这个心理学家除掉！他明显是个骗子。",
"（好吧，很粗鲁，但很公平。）",
"远离*&0&*。",
"不要做出任何突然的举动！",
"等等！我还有两个应对策略要分享！",
"安静，你这个骗子！",
"你差点让我直面自己的感情。这简直是叛国。",
"（这个王国真是疯狂。）",
"（我应该成为 TariffTok 上的生活教练。）",
"你有权利……实际上，你根本没有任何权利！",
"将这个骗子投入永久的监狱。",
"然后在监狱周围建一堵墙。等等，我要四面墙。两边各一堵。",
"这是 8 个结局中的第 1 个。",
"你被判处终身监禁。罪名是情感诈骗。罪名是制造不良氛围。",
"你的庭审持续了4分钟。陪审团在开庭辩论前达成了一致裁决。",
"法官称你为“一个榜样……告诉人们什么不该做”。",
"你现在领导一个监狱支持小组。必须参加。",
"你的故事到此结束。身陷囹圄。依然被误解。",
"嗯...我不得不说，这次会议进行得出奇地顺利。",
"我感觉轻松多了。看得见，听得见。",
"（好的。很好。也许我终于擅长这种治疗了。）",
"你确实有办法……进入我的内心。",
"还有我的心。",
"（等等，什么？）",
"很奇怪。我有过无数的顾问、咨询师，还有三个不同的爱情导师……",
"但他们都没有让我感受到这种……理解。",
"（中止。中止。）",
"也许是你的眼神，或者是你平静、令人安心的语气。",
"或者当我说话时你只是点头。",
"（因为你告诉我的！）",
"我不知道该如何解释...",
"但我感觉我们之间有某种东西。",
"某种……总统的。",
"（妈的。）",
"这是 8 个结局中的第 2 个。",
"你帮助*&0&*处理他的情绪。",
"现在他正在处理……“其他感受”。",
"您的下一次会议将会很复杂。",
"安排新闻发布会。",
"我取得了突破。这次是真正的突破。有史以来最真实的突破。",
"谢谢大家的光临。",
"在我那位出色的心理学家的帮助下...我看到了希望。",
"我放弃资本主义、物质主义……以及我所有的私人游艇所有权。",
"从今天起，我将成为戈尔巴利亚圣山的一名僧侣。",
"人群倒吸一口凉气。",
"我将冥想、禁食并忘记寄宿学校教给我的一切。",
"我将放弃我的财产、我的头衔、我的自我。",
"除了一件事。",
"我唯一要带的人是......",
"我的心理医生。",
"（等等，什么？）",
"（不不不不不不不不不不不不）",
"救命啊！！！",
"您已到达目的地。",
"戈尔巴利亚圣山。",
"看，它的颜色灰暗无比，而且艺术风格相当简约。",
"但重点就是，你应该像一个极简主义者一样生活。",
"没有无线网络。没有浓缩咖啡机。无处可逃。",
"您以为这只是一个阶段。",
"八个月过去了，他还在冥想。",
"*&0&* 看起来真的很平静。",
"（这不是我签约的工作。）",
"（FML。）",
"这是 8 个结局中的第 3 个。",
"您现在是正式的僧侣心理学家了。",
"工作福利：沉默、启迪和虫咬。",
"工作满意度：未知。",
"祝你好运。你会需要它的。",
"你知道……有时候我想知道这一切是为了什么。",
"会议、政策、纪念币。",
"（哦不，他又开始犯困了。）",
"我上周签署了五十项行政命令，但仍然感到……空虚。",
"所以我尝试了一些新的东西。",
"（请不要说瑜伽。）",
"“虫子。”",
"显然是免关税的。",
"像蟑螂这样的“虫子”？",
"甚至更好。它们能帮助你看到光明。",
"这些都是从情感自由贸易区™进口的，顶级货品。",
"（等等……那不是一个真实的地方。）",
"你想试试吗？或许能帮你……放松一点。",
"我把这称为“外交豁免权”。",
"（他向我提供了“bug”。）",
"没压力。但如果你说“不”，我可能会陷入更深的生存恐惧。",
"好的，让我尝一下。",
"你吃下最微小的一小块。只是那只可爱的小虫子的左后腿，当你把它放进嘴里时，它还在蠕动。",
"那条小腿使你的心态发生了巨大的转变。",
"突然间你就明白了关税。",
"TariffTok 上不会告诉你所有关于进口关税的 BS 数学知识...但是..你可以在精神层面上看到它。",
"您将关税视为一个整体。",
"一个由和谐之物组成的存在，以波浪的形式运动。完美和谐。非常和谐。",
"你漂浮在一片永不停歇、旋转不息的彩色海洋中。永恒不息，动感十足。",
"这些颜色，他们说你现在就是其中之一。",
"你不知道那是什么意思。",
"感觉很好。非常好。太棒了。",
"这是结局 5（共 5 个）。",
"您现在是 *&0&* 的非官方氛围顾问。",
"您生活在一个充满色彩和最高级表达的无关税思维模式中。",
"你是......Vibes。",
"不用了，谢谢，我是素食主义者。",
"你礼貌地拒绝了。",
"当他用椅子争论了 45 分钟时，你静静地坐着。",
"主席获胜。",
"接下来，他正在与一盏台灯争论。",
"令人惊讶的是，他实际上记录了他的论点，并设计了赢得论点的策略。",
"他只是因为内疚而绊倒了沙发，承认自己在谁更舒服的问题上失败了。",
"他与每件新家具争论一番，进步就更大。",
"这是 8 个结局中的第 4 个。",
"快进6个月。你现在是*&0&*的清醒伴侣了。",
"你抱着他去开会，为他签名。",
"你们在维护国家的团结吗？",
"祝你好运。",
"*&0&* 的电话响了……",
"你好？我正在接受治疗。",
"啥？TarifficaCoin 下跌了 85%？！",
"MuricaCoin 下跌了 95%？！",
"别告诉我...LigmaCoin 也是吗？",
"下跌了 99%？！怎么回事……",
"（这可能是什么原因造成的？）",
"（我的政敌？）",
"（我所谓的盟友？）",
"（午餐时我得罪的那个人？）",
"（……这个该死的治疗师？）",
"总统先生，请尽量冷静下来。",
"让我们做一些呼吸练习。",
"好的…",
"肯定的话语。",
"我可以通过专注于呼吸来克服恐慌。",
"宇宙看到了我……并且认可了我。",
"仅仅因为我犯了一个错误并不意味着我就是一个错误。",
"（哇哦。这些实际上非常坚固。）",
"（我把这些写下来以备将来使用。）",
"你好。",
"安排新闻发布会。",
"我有一个解决办法。",
"谢谢大家的光临。",
"即日起，所有关税将上涨500%！",
"还引入了一些新税种：",
"“国内航空”税。",
"“微笑时呼吸”税。",
"还有“考虑离开王国”税。",
"人群倒吸一口凉气。",
"当然，我只是在开玩笑。",
"关税实际上将上涨至 1,000%。",
"关税王国万岁。",
"这是 8 个结局中的第 5 个。",
"*&0&*决定将关税提高1000%。",
"我的鳄梨吐司冰沙现在要贵很多了。",
"甚至可能变得非常便宜并且不再在餐馆给小费。",
"嘿，准备召开新闻发布会。",
"我心情大好。是时候听好消息了。",
"大批媒体蜂拥而至。摄像机咔嚓咔嚓地响着。麦克风伸出来。",
"你调整了一下领带。这或许会成为你的传奇时刻。",
"塔里菲卡的公民们，欢欣鼓舞吧！",
"今天标志着一个新时代的到来。一个富足的时代。一个自由的时代！",
"记者们倾身靠近。有人因期待而晕倒了。",
"我正式取消@2 所有关税@2！",
"人群爆发出欢呼声。",
"五彩纸屑飞舞。有人在吹萨克斯。一个孩子在唱歌。",
"（我做到了。我真的做到了。我改变了一个国家。从一个不合格的心理学家变成了民族英雄。）",
"只是在开玩笑。",
"我绝不会这么做。我看起来怎么样？一个失败者？",
"（哦。）",
"（好吧，这只是短暂的。）",
"但我将取消发胶的税。",
"我的同胞值得拥有光辉和辉煌！",
"（我早该预见到这一点。）",
"（至少现在我的护发习惯可以负担得起。）",
"这是 8 个结局中的第 6 个。",
"您成为国家偶像的时间约为 11 秒。",
"这比大多数 TariffToks 都要长。",
"你知道吗？我们这次会面后我感觉很好。",
"就像……真的很好。更轻松。更平静。",
"总统先生，我很高兴听到这个消息。这正是我来这里的目的。",
"这是我感觉最好的一次。",
"我要提拔你，立即生效。",
"提升我...做什么？",
"王国效率部 (D.O.K.E.) 主管。",
"（等等...什么？）",
"（这听起来很重要。但也很假。）",
"我们开个新闻发布会吧。我想让人们见见这位治愈了我内心童真的天才。",
"塔里菲卡的公民们！",
"这个勇敢而困惑的灵魂帮助我重新与内心深处的自我建立了联系。",
"所以现在，他将帮助王国重新恢复其……效率。",
"（政治就是这样运作的吗？）",
"DOKE 负责人，您的第一个订单是什么？",
"削减环境保护部的资金",
"不需要环境保护，因为“大自然会解决一切问题”。",
"最后，文书工作减少了，混乱增加了。",
"要求交通部将所有交通信号灯替换为停车标志。",
"这样就没有人需要闯红灯了。",
"交通堵塞意味着您可以在车里享受更多优质的家庭时光！",
"禁止所有政府资助的气候变化研究。",
"我们不需要“消极”，让我们关注积极的事情。",
"问题解决了。无知是福！",
"（过了一会儿……）",
"这是结局 7（共 8 个）。",
"你引发了混乱……而塔里菲卡付出了代价。",
"王国消失了，人民消失了。",
"只有你和*&0&*幸存下来。",
"现在你们都登上了 Hair Force 1 号，前往一个荒岛。",
"你们两个将在完全孤立的状态下度过余生。",
"已经没有回头路了。",
"这是你的遗产。",
"你一直很想知道，不是吗？",
"为什么像你这样明显不合格的人……得到了这份工作。",
"……我是说，我脑子里闪过这个想法。",
"你没有通过第一次面试。",
"你忘记了自己的学位名称。",
"当他们问为什么要雇用你时，你只是说：“我需要钱。”",
"好吧，哇。现在感觉这很私人了。",
"因为它是。",
"你来这里是因为",
"*&0&* 的电话响了。",
"抱歉，这个让我来拿吧。",
"喂？我正在揭晓一个戏剧性的消息。",
"每次做出重大决定时只需抛硬币。",
"是的，真的。我一直都是这么做的。",
"好的。现在，我们说到哪儿了？",
"你是想告诉我为什么我被录用了？",
"哦，对了……",
"嗯...你是我的孩子。",
"我啥！？",
"我永远不会忘记在 Whatchamacallit 度过的那个夏天。",
"你的母亲正在为最新时尚系列做模特。",
"我不记得品牌了...但我被迷住了。",
"也许这就是她“讨人喜欢的性格”。",
"顺便说一下，我也很满意。这是双向的。",
"这有很多事情需要处理。",
"我认为心理治疗是重建情感联系的最佳方式。",
"这是第 8 个结局（共 8 个）。",
"现在，您既是*&0&*的心理学家，也是*&0&*失散多年的孩子。",
"你还了解到你的母亲是一位“性格讨喜”的超级名模。",
"你仍然是*&0&*的心理学家。",
"现在你们已经成为一家人了，他向你们讲述了他的感情生活。",
"他不放过任何细节。",
    ];

    if(isExport==false) resultText(varName,translatedText, textData);
    else {

      exportFile(folderPath.concat(varName.toLowerCase(),".",languageCode,".txt"),JSON.stringify(textData.join("+")));  
    }
     // resultText(varName,textData,textData);
    return;
  // }
  // else{
  //   // Create a combined prompt 
  //   var textsToTranslate="";
  //   textsToTranslate = textData.map((text, index) => `${index + 1}. ${text}`).join('\n'); 

  //   var prompt;
  //   if(varName=="dynamic_character"||varName=="chapter_list"||varName=="strings"){
  //     prompt = `Translate the following texts from English to ${languageInput}, only show the result in ${languageInput}. Output in the same format :\n\n${textsToTranslate} `; 
  //   }
  //   else prompt = `Translate the following texts from English to ${languageInput}. Keep words inside curly brackets { } in English. Do not change curly bracket {} or straight brackets ||. Keep the translation short and straightforward. Only response the translation result with the same format. :\n\n${textsToTranslate} `; 
    
  //   try { 
  //     const result = await model.respond(prompt);    
      
  //     // Extract the translated texts 
  //     const translatedTexts = result.content.trim().split('\n').map((text) => text.replace(/^\d+\.\s*/, ''));    
  //     console.log(textData);
  //     console.log("==================translated==========");
  //     console.log(translatedTexts); 
  //     resultText(varName,translatedTexts, textData);
  //   } catch (error) { console.error(error); }
  // }
}


// readFile(file,null,function(data){
//   getResponse(data);
// });
// getResponse();