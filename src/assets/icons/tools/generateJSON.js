console.log("go go go")
const path = require('path');
const fs = require('fs');


const replaceWithRegExp  = (str,reg,replace) => {
    var src = str.replace(reg, replace || "");
    return src;
}

const cleanSVG = (str) => {
    let ret = replaceWithRegExp(str,/<!--[^>]*-->/g);
    ret = replaceWithRegExp(ret,/<\?xml[^>]*?>\\n/g);
    ret = replaceWithRegExp(ret,/\\n*.\\t/g," ");
    ret = replaceWithRegExp(ret,/style=\\"enable-background:new 0 0 48 48;\\"/g);
    ret = replaceWithRegExp(ret,/style=\\"fill\:[^((?!none).)].*?\\"/g);
   // ((?!none).)
    ret = replaceWithRegExp(ret, /xmlns=\\".*?\\"/g);
    ret = replaceWithRegExp(ret, /xmlns\:xlink=\\".*?\\"/g);
    ret = replaceWithRegExp(ret, /\\n/g);
    ret = replaceWithRegExp(ret, /\\t/g," ");

   
    return ret;
}

//joining path of directory 

const doJson = (src,destinationFile) => {


const directoryPath = path.join(__dirname, '../svgs/'+src);
const files = fs.readdirSync(directoryPath);
console.log(files);

let filenames = files.reduce((r,file,i) => {
    let filename = file.split('.').slice(0, -1).join('.');
    let extension = file.split(".").pop();
    if(extension == 'svg') {
        //console.log("so push");
        const data = fs.readFileSync(directoryPath+"/"+file,
            {encoding:'utf8', flag:'r'});
        //r[filename] = cleanSVG(data);
        r[filename] = data;
    }
    return r;
},{})


//console.log("filenames",filenames)

var strContent = JSON.stringify(filenames);
strContent = cleanSVG(strContent)
const destination = path.join(__dirname, destinationFile);
fs.writeFile(destination,strContent, function(err){
    if(err) return console.log(err);
    console.log('Note added');
});

}



doJson('atHome/appIcons','../appIconsGenerated.json');