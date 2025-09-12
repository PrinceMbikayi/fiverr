var fs = require('fs');
var fetch = require('node-fetch');

const process = require('process');


//----------------------------------------

const translateWith = 'google'; // google,deepl
const deepl_apikey = "YOUR DEEPL API KEY";



const rootPath = __dirname+"/../../";




const motor_error_file = [
   
    "src/brands/umii/templates/components/objects/boardgate/locales/motorErrors_xx.json",
   
]


const files = [...motor_error_file];

let report = {};


const portalTitle = {
                         "fr" : "Erreur portail",
                         "en" : "Portal error"
                        
                    }



const convertFile = async(path,tl) => {

    //const myLang = "en"
    const myPath = path.split("xx").join(tl);

    const sl = "fr";
    const fromLanguage = sl;
    const toLanguage = tl;
    const separator = "/";
    const source = fs.readFileSync(myPath,'utf8');
    let jsoned = JSON.parse(source);
   // console.log(jsoned)


   let content = "";
    for (const [key, value] of Object.entries(jsoned)) {
        //console.log(`${key}: ${value}`);
        const test = ((key.split("_").length == 2) && key.indexOf("+") == -1);
        if(test) {
            const line ="\""+key.toLowerCase()+"_key"+"\""+"="+"\""+(value.split('"').join('\\"'))+"\""+";";
          //  console.log(line);
            content+=line+"\n";
        }
      }
    /*
    const splitted = path.split(separator);
    const filename = splitted.pop();
    let destFileName = filename.split(fromLanguage).join(toLanguage);
    if(destFileName.indexOf(fromLanguage.toUpperCase()) != - 1) {
        destFileName= destFileName.split(fromLanguage.toUpperCase()).join(toLanguage.toUpperCase())
    }
    const destFile = splitted.join(separator)+separator+destFileName;
    console.log("filename",filename,"destFile",destFile,"\n");

    let patch = {}
    const patchFile = destFile.split(".json")[0]+"-patch"+".json";
  
    const patchExist = fs.existsSync(patchFile);
    console.log("patchFile",patchFile,patchExist)
    if(patchExist) {
        const patchContent = fs.readFileSync(patchFile,'utf8');        
         patch = JSON.parse(patchContent);
    }

   

    let result = {};    
    const unchanged = [];    
    
  
    for (const [key, value] of Object.entries(jsoned)) {
       
        const resp = await translate(value,sl,tl);

        let translation = resp;

        if(resp == "unchanged") {
             translation = value;
            if(patch[key]) {
                translation = patch[key]
            } else {
                unchanged.push({"key":key,"value":value})
            }
       
        }
       
        //force patch
        if(patch[key]) {
            translation = patch[key]
        }


        result[key] = translation;
        console.log(translation)
       
    }

    console.log("file completed",result)

      
    fs.writeFileSync(destFile, JSON.stringify(result), { flag: 'w' }, err => {});

    const originFile = destFile.split("src")[1];
    if(unchanged.length > 0) {
        console.log("unchanged",unchanged);
        report[originFile] = unchanged
    }

    */

    //add PortalTitle

    content+='"portal_error_title_key"="'+portalTitle[tl]+'";"';

    console.log(content)

    const destFile =  rootPath + "ios/"+tl+".lproj/Localizable.strings";
    fs.writeFileSync(destFile, content, { flag: 'w' }, err => {});
    console.log("destFile",destFile)



    return destFile;
}




//----------------------------------------------
const batch = async(lang="en") => {
    for await(const file of files) {
       
      const done = await convertFile(rootPath+file,lang)
        
    }
    console.log("report",report)
}

var args = process.argv;
//console.log(args)

const lang = args?.[2] ;
//console.log(lang)

batch(lang);