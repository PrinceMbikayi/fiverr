import * as ScenarioHelpers from '_helpers/scenarios';

/**
 * 
 * @param {*} itemId 
 * @param {*} tasks 
 * @returns 
 * 
 * @example  ['Schedule','Default',itemId],
        ['Schedule','Other',itemId],
        ['Delay','Delay',itemId]
    ]
 */
export const grabSpecialsSchedularTasks = (itemId,tasks) => {
    
    const params = tasks.reduce((r,v,i) => {
            r.push([v.type,v.id,itemId,v.title])
            return r;
    },[]);
    return ScenarioHelpers.getObjectSchedulerTasks(params);
} 