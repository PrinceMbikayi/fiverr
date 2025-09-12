import { getObjectById } from '_helpers/objects';

export const retrieveUserGatewaySolarDongle = (components)=>{
    console.log('CHECK_COMPONENTS :', components);
    let myComponents = components ? components : [] //  Fix for Cedric detected crash app bug for disconnected box on 868 assistant
    // I used components before without protecting it for UNDEFINED
    let dongles = [];
    const solarDongle = myComponents.reduce((acc, id) => {
        const dongleId = Number(id)
        const dongle = getObjectById(dongleId) || {}
        const typeName = dongle?.typeName
        console.log(" DONGLE_NAME :", typeName)
        if(typeName == "Profalux"){
            acc.push(dongleId)
            dongles.push(dongleId)
        }

        return acc;
    }, [])

    console.log('YO_T :', dongles);
    return solarDongle[0]
}