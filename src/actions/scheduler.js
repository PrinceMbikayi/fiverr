export const ADD_SCHEDULER = "ADD::SCHEDULER"


export const addScheduler = (taskId) => {
    return ({
        type:ADD_SCHEDULER,
        payload:{'id':taskId}
    })
}