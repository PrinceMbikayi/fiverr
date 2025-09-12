export const  thermostatDefaultProg = [
    {cron: "0 0 * * 2,3,4,5,6,7,1", value: "off", duration: "360"},
    {cron: "0 6 * * 2,3,4,5,6,7,1", value: "eco", duration: "360"},
    {cron: "0 12 * * 2,3,4,5,6,7,1", value: "comfort", duration: "480"},
    {cron: "0 20 * * 2,3,4,5,6,7,1", value: "off", duration: "210"}
];

export const thermostatDelayOptions = [
    {"item":'thermostat:THERMOSTAT_DELAY_LOW',"id":5},
    {"item":'thermostat:THERMOSTAT_DELAY_INTERMEDIATE',"id":10},
    {"item":'thermostat:THERMOSTAT_DELAY_HIGH',"id":20},
    {"item":'thermostat:THERMOSTAT_DELAY_VERY_HIGH',"id":60}
];

const doRange = (start, end) => Array.from({length: (end - start)}, (v, k) => (k + start).toString());

export  const setPointsArray = [
    {mode:"boost",range:doRange(20,35)},
    {mode:"comfort",range:doRange(18,31)},
    {mode:"eco",range:doRange(16,23)},
    {mode:"absence",range:doRange(8,18)},
    {mode:"frost_free",range:doRange(0,11)}
];