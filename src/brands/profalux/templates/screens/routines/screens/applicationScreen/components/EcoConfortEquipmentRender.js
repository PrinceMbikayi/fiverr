
const EcoConfig = {
    "Rolling_Shutter_Ezsp":{id:1, objects:[]},
    "Venetian_Shutter_Ezsp":{id:2, objects:[]},
    "Shade_Ezsp":{id:3, objects:[]},
}

const EcoConfortConfig = {
    "VR":{typeName:"Rolling_Shutter_Ezsp", id:1, objects:[]},
    "BSO":{typeName:"Venetian_Shutter_Ezsp", id:2, objects:[]},
    "STORE":{typeName:"Shade_Ezsp", id:3, objects:[]}
}

const EcoInitConfig = {
    "Rolling_Shutter_Ezsp":{
        open:"bsoOpenIcon", level25:"bsoLevel25Icon",level50:"bsoLevel50Icon", level75:"bsoLevel75Icon", close:"bsoCloseIcon", noLevel:"bsoLevel50Icon"
    },
    "Venetian_Shutter_Ezsp":[],
    "Shade_Ezsp":[]
}