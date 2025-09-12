var fs = require('fs');
var fetch = require('node-fetch');

const process = require('process');


//----------------------------------------

const translateWith = 'google'; // google,deepl
const deepl_apikey = "YOUR DEEPL API KEY";



const rootPath = __dirname+"/../../";



const files_simple = [
    "src/brands/umii/templates/screens/productsRelated/_locales/extendedProductFR.json",
]

const umii_files = [
    "src/brands/umii/templates/components/objects/boardgate/locales/test_fr.json",
    "src/brands/umii/templates/components/objects/boardgate/locales/fr.json",
    "src/brands/umii/templates/components/objects/boardgate/locales/motorErrors_fr.json",
    "src/brands/umii/templates/components/objects/bluetoothPairing/locales/fr.json",
    "src/brands/umii/templates/components/objects/qrBasic/locales/fr.json",
    "src/brands/umii/templates/screens/_locales/fr.json",
    "src/brands/umii/templates/screens/account/_locales/extendedAccount_fr.json",
    "src/brands/umii/templates/screens/account/locales/fr.json",
    "src/brands/umii/templates/screens/productsRelated/_locales/extendedProduct_fr.json",
    "src/brands/umii/templates/screens/productsRelated/_locales/productRelated_fr.json",
   
]

const profalux_files = [
    "src/brands/profalux/templates/components/objects/common/locales/fr.json",
    "src/brands/profalux/templates/components/objects/weatherSupport/locales/fr.json",
    "src/brands/profalux/templates/screens/_locales/fr.json",
    "src/brands/profalux/templates/screens/addObject/locales/fr.json",
    "src/brands/profalux/templates/screens/group/locales/fr.json",
    "src/brands/profalux/templates/screens/maison/locales/fr.json",
    "src/brands/profalux/templates/screens/routines/locales/fr.json",
    "src/brands/profalux/templates/screens/settings/locales/fr.json",
    "src/brands/profalux/templates/screens/productsRelated/products/locales/fr.json",
    "src/brands/profalux/utils/locales/fr.json",
    "src/utils/locales/fr.json",
    "src/brands/profalux/navigation/locales/fr.json"
 ]

const src_files = [
    "src/screens/account/locales/fr.json",
    "src/screens/addProduct/locales/fr.json",
    "src/screens/addProduct/locales/locales_addProduct_fr.json",
    "src/screens/scenarios/locales/fr.json",
]

const src_base_files = [
    "src/utils/locales/fr.json",
    "src/utils/locales/products/athome/fr.json",
    "src/utils/locales/products/types/fr.json",
    "src/utils/locales/scenarios/fr.json",
    "src/utils/locales/statuses/fr.json",
]

const few_files = [
    "src/brands/umii/templates/components/objects/boardgate/locales/fr.json"
]



//const files = [...umii_files,...src_files,...src_base_files]
const files = [...profalux_files]

//const files = ["src/brands/umii/templates/screens/account/_locales/extendedAccountFR.json"]


let report = {};


const convertFile = async(path,tl) => {

    
    const sl = "fr";
    const fromLanguage = sl;
    const toLanguage = tl;
    const separator = "/";
    const source = fs.readFileSync(path,'utf8');
    let jsoned = JSON.parse(source);
    
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


    return destFile;
}





const translate = async(q,sl,tl) => {

    switch (translateWith) {
        case 'google' :
            return await translate_google(q,sl,tl)
             break;
        case 'deepl' :
            return await translate_deepl(q,sl,tl)
            break;
    }
    
}


// ========== GOOGLE ==========================

const translate_google = async(q,sl,tl) => {

    if(q=="")return "";
    if(q.indexOf("http") !=-1) return "unchanged"
    //const params = {client:"gtx", dt:"t",sl:"fr",tl:"en",q:"Le quatrième battant du portail s’ouvre-t-il ?"};
    const params = {client:"gtx", dt:"t",sl:"fr",tl:tl,q:q};
    //const respo = await fetch('https://translate.googleapis.com/translate_a/single');
    const jBody = JSON.stringify(params);
   // console.log("jBody",jBody)

    let query = Object.keys(params)
             .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
             .join('&');
    
    const uri = 'https://translate.googleapis.com/translate_a/single?'+query
    //console.log(uri)

    const resp = await fetch(uri, {
        method: 'GET',
       
    });
    
    const result = await resp.json();   
    return result[0][0][0];
   
   
}

const translate_deepl = async(q,sl,tl) => {

   


    if(q=="")return "";
    if(q.indexOf("http") !=-1) return "unchanged"


    const params = {    source_lang:"FR",
                        target_lang:tl.toUpperCase(),
                        text:q,
                        formality:"prefer_less"
                    };
    let query = Object.keys(params)
             .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
             .join('&');
             
    const uri ="https://api-free.deepl.com/v2/translate"+"?"+query;
    console.log("deepl uri",uri)


    const resp = await fetch(uri, {
        method: 'GET',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Authorization': `DeepL-Auth-Key ${deepl_apikey}`, // notice the Bearer before your token
        }
    })

    const result = await resp.json();
    console.log("---------------------")
    console.log(result)
    console.log("---------------------")
    const text = result?.translations[0].text
    console.log("deepl translation : ",text)


    return text


}





//----------------------------------------------
const batch = async(lang="en") => {
    for await(const file of files) {
       
      const done = await convertFile(rootPath+file,lang)
        
    }
    console.log("report",report)
}

//batch();


var args = process.argv;

// 2 mean no extra args
if(args.length == 2) {
    console.log("\n")
    console.log("- Process all files :  add -- batch")
    console.log("- Display Help : add -- help")
    console.log("\n")
}

let isBatch,isHelp;
let lang = "en";
// console.log("number of arguments is "+args.length);
args.forEach((val, index) => {
   // console.log(`${index}: ${val}`);
    if(val.indexOf("batch") != -1)isBatch = true;
    if(val.indexOf("help") != -1)isHelp = true;
    if(val.indexOf("-lang")!=-1)lang = val.split("=")[1]
});


if(isHelp) {
    console.log("\nhelp needed ?\n")
    console.log("add -lang=de to batch command to process german translation (available languages codes are 'en','it','de','es','nl',pt') default is no lang mean 'en'")
    console.log("\n");
}
if(isBatch) {
    batch(lang);
}