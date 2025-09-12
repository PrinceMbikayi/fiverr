console.log("go go go")
const path = require('path');
const fs = require('fs');

//import {appIcons} from 'src/assets/icons/appIcons';

const doFiles = () => {
    console.log("do files")
    const basePath = path.join(__dirname, 'src/assets/icons/');
    const destination = basePath+'svgs/appIcons/';
    const appIcons = require('./src/assets/icons/appIcons.js');
   //console.log(appIcons);
   const result = Object.keys(appIcons).reduce((r,v,i) => {
            r.push({'filename':v,'content':appIcons[v]});
            const fileDest = destination+v+'.svg';
            console.log("AAA", fileDest)
            
            fs.writeFile(fileDest,appIcons[v], function(err){
                if(err) return console.log(err);
                console.log('file done ');
            });
            
            return r;
   },[])


   //console.log("result",result)
}

doFiles();