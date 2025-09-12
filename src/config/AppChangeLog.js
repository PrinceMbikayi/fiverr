const addZero = (value) => {
    let retVal = ""+((Number(value) < 10)? "0" : "");
    retVal+=value
    return retVal
  }

const date = new Date();

let day = addZero(date.getDate());
let month = addZero(date.getMonth() + 1);
let year = date.getFullYear();


let currentDate = `${day}-${month}-${year}`;
export const changeLogs =
    [
        {
            version: "v1.0.0",
            date: currentDate,

            nochanges: [
            ],
            // devChanges: [
            //     "dev profalux Volet roulant et BSO",

            // ]
        },

    ]
