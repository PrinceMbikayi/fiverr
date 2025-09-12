import {airHomeIcons} from '_assets/icons/airhomeIcons';

export const getAirHomeIcon = (id) => {
    return airHomeIcons[id];
}

export const modes_entries = [
       
    {
        title:"AUTO",
        icon: getAirHomeIcon('auto'),
        mode:'auto',
        setTemp:'auto'
        
    },
    {
        title:"COOL",
        icon: getAirHomeIcon('cool'),
        mode:'cool',
        setTemp:true,
        fanSpeed: true,
        sleep:true,
        boost:true,
        eco:true,
    },
    {
        title:"DRY",
        icon: getAirHomeIcon('dry'),
        mode:'dry',
        setTemp:true,
        sleep:true,
    },
    {
        title:"FAN",
        icon: getAirHomeIcon('fan'),
        setTemp:'no',
        mode:'fan',
        fanSpeed: true,
    },
    {
        title:"HEAT",
        icon: getAirHomeIcon('heat'),
        mode:'heat',
        setTemp:true,
        fanSpeed: true,
        sleep:true,
        boost:true,
        eco:false,
    },
  ];


  export const modeByKeys = modes_entries.reduce(function(r,v,i){
        r[v.mode] = v;
        return r;
  },{})

 

  //------------------------------------------------
  export const options_entries = [
       
    {
        title:"FAN_AUTO",
        icon: getAirHomeIcon('fan-auto'),
    },
    {
        title:"FAN_SLOW",
        icon: getAirHomeIcon('fan-slow'),
    },
    {
        title:"FAN_AVERAGE",
        icon: getAirHomeIcon('fan-average'),
    },
    {
        title:"FAN_FAST",
        icon: getAirHomeIcon('fan-fast'),
    },
  ];

  export const configurationItemIds = [ "sleep","boost","eco",
                                        "flow-vertical","flow-horizontal",
                                        "buzzer",
                                     ];

const range = (start, stop, step) => {
    let v = start-step
   let  arr=[];
    while( v < stop) {
        v=v+step;
        arr.push(v)
    }
return arr 
}

export const temperatures  = range (17,35,0.5);

export  const modeColors = {heat : '#EE8213', cool : '#084583',default:'#74AC2A'};


 