import { getObjectById } from '_helpers/objects';

export const retrieveUserGateways = (gateways)=>{
    const myGateways = gateways.reduce((accumulator, gtw) => {
        const gtwData = getObjectById(gtw) || {}
        const realName = gtwData?.realName || ''
        //console.log(" GATE WAY DATA :", gtwData)

        if ((gtwData?.realName != 'System' &&
            gtwData?.realName != "ABox" &&
            realName.slice(0, 10) != 'WebBrowser' &&
            realName.slice(0, 10) != '' &&
            (gtwData?.realName).length == 24)
        ) {
            accumulator.push(gtwData?.id)
        }
        return accumulator;
    }, [])

    return myGateways
}