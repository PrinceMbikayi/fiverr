import { getObjectById } from '_helpers/objects';
import * as ApiObjects from "_api/objects"
import { Api } from '_api';
import { extractPickerDatas, extractPlannerTime, constructOArgs } from '_brand/templates/screens/routines/utils/transformPickerDatas'
import { sortByIdAndMergeListAtrribute } from '_brand/templates/screens/routines/utils/sortByIdAndMergeListAtrribute'
//import { routinesWithTheirPlannedDays } from '_brand/templates/screens/routines/services/routinesWithTheirPlannedDays'

export const routinesWithTheirPlannedDays = (planningDaysDatas) => {
    console.log("CHECK_UNDEFINED_Hello :", planningDaysDatas)
    let routinesWithTheirPlannedDays;
    let routinesInfosList = [];
    let formatRoutineIdArrayOtherAttributes = [];
    planningDaysDatas.map(item => {
        const day = item?.id;
        const dayObjects = item?.objects || []// list of objects with their actions, status, and triggers

        dayObjects.map(item => {
            const routineId = item?.id;
            const routineAction = item?.action?.name;
            const routineStatus = item?.activated
            const routineTriggers = item?.triggers || []

            const dayList = [];
            let triggerList = [];

            routineTriggers.map(tr => {
                const trigger = tr;
                dayList.push({ dayIndex: day, trigger: trigger })
            })

            console.log("DAY_OBJECT :", dayObjects)
            console.log("DAY_LIST :", dayList)

            const obj = {
                id: routineId,
                elements: [
                    {
                        day: day,
                        triggers: routineTriggers,
                        action: routineAction,
                        status: routineStatus,
                    }
                ]

            }
            formatRoutineIdArrayOtherAttributes.push(obj)
        })

        
        console.log('INTERMEDIAIRE_FORMAT :', formatRoutineIdArrayOtherAttributes);
    })

    formatRoutineIdArrayOtherAttributes.map(item => {
        const routineId = item?.id;
        const elements = item?.elements || []
        let dayList = [];

        elements.map(item => {
            const day = item?.day;
            const triggers = item?.triggers || []

            triggers.map(tr => {
                const trigger = tr
                //console.log("TRIG :", {dayIndex:day, trigger})
                dayList.push({ dayIndex: day, time: extractPlannerTime(trigger) })
            })
        })
        console.log("TRIG :", dayList)
        const tempObject = {
            id: routineId,
            elements: dayList
        }

        routinesInfosList.push(tempObject)
    })

    routinesWithTheirPlannedDays = sortByIdAndMergeListAtrribute(routinesInfosList)
    console.log("CLASSEMENT_CONTEXT_SCENARIO_INFOS :",routinesInfosList)
    console.log("CLASSEMENT_CONTEXT_SCENARIO_AFTER :",routinesWithTheirPlannedDays)
    return routinesWithTheirPlannedDays;
}