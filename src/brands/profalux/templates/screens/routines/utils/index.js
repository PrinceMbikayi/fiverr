import moment from 'moment/min/moment-with-locales';
import i18next from 'i18next';


export function extractDailyRoutines(planningDaysDatas, selectedDay) {
    console.log("You have selected day : ", planningDaysDatas)
    let dailyRoutinesInfos = [];
    planningDaysDatas.map((item) => {
        if (item.id == selectedDay) {
            //const objects = item.objects // list of objects
            const objectsAttribute = item?.objects;
            const objects = objectsAttribute ? objectsAttribute : []
            console.log("extractDailyRoutines ===========+> OBJECTS :", objects)

            let id;
            let action;

            objects.map(obj => {
                id = obj?.id;
                action = obj?.action;
                const triggers = obj?.triggers // list of triggers
                console.log("TRIGGERS_EXTRACT_DAILYROUTINES :", triggers)
                triggers.map(tr => {
                    const trigger = tr
                    dailyRoutinesInfos.push({ id: id, action: action, trigger: trigger })
                })

            })

        }

    })
    console.log("RETURN_DAILYROUTINES : ", dailyRoutinesInfos)
    return dailyRoutinesInfos;
}

export function getDaysOfWeekInShort(lang){
    let currentLang;
        if (lang == "en") currentLang += "-gb";
        moment.locale(currentLang);
        const wd = moment.weekdays(true); // weekdays short
        const days = [
            { id: 2, label: (wd[0].substr(0, 1)).toUpperCase() },
            { id: 3, label: (wd[1].substr(0, 1)).toUpperCase() },
            { id: 4, label: (wd[2].substr(0, 1)).toUpperCase() },
            { id: 5, label: (wd[3].substr(0, 1)).toUpperCase() },
            { id: 6, label: (wd[4].substr(0, 1)).toUpperCase() },
            { id: 7, label: (wd[5].substr(0, 1)).toUpperCase() },
            { id: 1, label: (wd[6].substr(0, 1)).toUpperCase() }
        ]
    return days;
}

export function getMonthByNumber(lang, monthNumber){
    console.log('GET_MONTH_BY_NUMBER :', lang, monthNumber);
    let currentLang;
    if (lang == "en") currentLang += "-gb";
    moment.locale(currentLang);
    const months = moment.months();
    const monthConfig = {
        "1":months[0], "2":months[1], "3":months[2], "4":months[3], "5":months[4], "6":months[5],
        "7":months[6], "8":months[7], "9":months[8], "10":months[9], "11":months[10], "12":months[11]
    }
    return monthConfig[monthNumber.toString()];
}