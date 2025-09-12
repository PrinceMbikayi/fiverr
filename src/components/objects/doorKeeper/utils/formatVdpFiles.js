import moment from 'moment/min/moment-with-locales';
import {orderEventsByDate} from './index';

 import {getObjectFiles} from '_api/objects';

const thumbs = [
    "https://alivreouvertdotnet.files.wordpress.com/2014/04/221b-baker-street.jpg?w=300",
    "https://static.wikia.nocookie.net/bakerstreet/images/f/f8/BO_uSXCCAAMn5es.png/revision/latest/scale-to-width-down/310",
    "https://mapio.net/images-p/6538814.jpg"
]

const videoUrls = [ "https://ak.picdn.net/shutterstock/videos/1010801189/preview/stock-footage-countdown-leader-graphic-with-film-burn-and-rolling-effect.mp4",
                        /*"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"*/
                        "https://ak.picdn.net/shutterstock/videos/1055479382/preview/stock-footage-ms-gentoo-penguins-pygoscelis-papua-on-rocky-coast-at-damoy-point-antarctic-peninsula.mp4"
  
  
                    ]; 

const  randomIntegerInRange = (min, max) =>  {    
    const resp =  Math.floor(Math.random() * (max - min + 1)) + min;
    return (((resp < 10 )? "0" : "")+resp).toString()
    }

export const createFakeCaptures = () => {

    
    let captures = [];
    const dateFormatStr = "YYYY-MM-DD";
   
    const  norandomIntegerInRange = (min, max) =>  {    
        const resp =  Math.floor(Math.random() * (max - min + 1)) + min;
        return (((resp < 10 )? "0" : "")+resp).toString()
        }
    


       
    let addDatas = (daysBefore,itemsNumber) => {
        let retArray = []
        const today = moment().format(dateFormatStr);
        const theDay = moment(today).subtract(daysBefore,'days').format(dateFormatStr);

        
        [...Array(itemsNumber)].map((x, i) => {
            const nDate = theDay+" "+randomIntegerInRange(0,23)+":"+randomIntegerInRange(0,59)+":"+randomIntegerInRange(0,59)
           
            const thumb =  thumbs[Number(randomIntegerInRange(0,thumbs.length-1))];
            const type = (randomIntegerInRange(0,1) == 0)? 'video' : 'image'
            let objDatas = {'date':nDate,'thumb':thumb,'type':type};
            if(type == 'video')objDatas.vurl = videoUrls[Number(randomIntegerInRange(0,videoUrls.length-1))];;
            retArray.push(objDatas)
        })
        return retArray;
    }
    const rndDay = randomIntegerInRange(10,40);
    const rndDay2 = randomIntegerInRange(10,40);
    captures = [...captures,...addDatas(0,4),...addDatas(1,1),...addDatas(7,2),...addDatas(rndDay,3),...addDatas(rndDay2,3)];
       
    return captures;

}

export const formatFilesCollection = (resources) => {

    //20210910110808

   

    const captures = resources.reduce((r,v,i) => {
        
        const data = ""+v.filename
        let nDate = data.slice(0,4)
        nDate+="-"+data.slice(4,6);
        nDate+="-"+data.slice(6,8);
        nDate+=" "+data.slice(8,10);
        nDate+=":"+data.slice(10,12);
        nDate+=":"+data.slice(12,14);
        
        const contentTypes = {
                            "application/octet-stream" : "video",
    
        }

        const type = (v.contentType.indexOf("image") != -1 ) ? "image" : "video";
        let thumb =  thumbs[Number(randomIntegerInRange(0,thumbs.length-1))];
       
        if(type == "image")thumb = v.url;
        //thumb =  "https://books.google.com/books/content?id=4TcttAEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api";
        let toPush = {'date':nDate,'thumb':thumb,'type':type,'filename':v.filename}
        if(type == 'video')toPush.vurl = v.url;

        /*
        const rndThumbIndex = randomIntegerInRange(0,thumbs.length-1)
        console.log("nDate",nDate,"thumbs.length",thumbs.length-1,"rndThumbIndex",rndThumbIndex)
        const thumb =  thumbs[Number(rndThumbIndex)];
        const type = (randomIntegerInRange(0,1) == 0)? 'video' : 'image';
        let toPush = {'date':nDate,'thumb':thumb,'type':type}
        if(type == 'video')toPush.vurl = videoUrls[Number(randomIntegerInRange(0,videoUrls.length-1))];;
        */
       
        r.push(toPush)
      
        return r
    },[])

   // console.log("resources => captures")

    return captures;

}
export const sortArchives = (archives) => {
   // console.log("in sortArchives => orderedCaptures",archives); 
    const orderedCaptures = orderEventsByDate(archives);
   

    const snapshots = [];
    const videos = [];

    orderedCaptures.map((val,i) => {
            
        let dayItems = {'snapshots':[],'videos':[]}
        const date  = val.date;
        val.data.map((item,i) => {
            if(item.type == 'video')dayItems['videos'].push(item);
            if(item.type == 'image')dayItems['snapshots'].push(item);
        })

        if(dayItems['videos'].length > 0) (
            videos.push({'date':date,'data':dayItems['videos']})
        )
        if(dayItems['snapshots'].length > 0) (
            snapshots.push({'date':date,'data':dayItems['snapshots']})
        )

    });
    
    return {'orderedCaptures':orderedCaptures,'snapshots':snapshots,'videos':videos}

}

export const getFiles = async(id) => {

    const res = await getObjectFiles(id).catch(e => console.log(e))

    return res;
}