import { getObjectById } from '_helpers/objects';


// Dongle is configured if it is connected to a gateway
export const retrieveBoxDongles = (components,dongleTypeName) => {
    console.log('CHECK_COMPONENTS :', components);
    const dongleList = components?.map(Number) || [] //  Fix for Cedric detected crash app bug for disconnected box on 868 assistant
    // I used components before without protecting it for UNDEFINED
    const dongles = dongleList.reduce((acc, id) => {
        const getDongle = getObjectById(id)
        console.log('GET_DONGLE :', getDongle);
        const typeName = getDongle?.typeName
        if(typeName == dongleTypeName){
            acc.push(id)
        }

        return acc;
    }, [])

    return dongles
}