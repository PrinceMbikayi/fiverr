export const SCENARIOS_FILL = 'SCENARIOS::FILL';
export const SCENARIO_UPDATE = 'SCENARIO::UPDATE';
export const GET_SCENARIO= "SCENARIO::GET";
export const SCENARIO_UPDATE_NATURE = 'SCENARIO::UPDATE::NATURE';

export const scenariosFill = scenarios => ({
  type: SCENARIOS_FILL,
  scenarios
})

export function scenarioUpdate(data){
  return {
    type: SCENARIO_UPDATE,
    payload:{name:data.name,id:258}
  };
}

export function updateScenarioNature (scenarioId,scenarioNature) {
  return {
    type:SCENARIO_UPDATE_NATURE,
    payload:{'scenarioId':scenarioId,'scenarioNature':scenarioNature}
  }
}