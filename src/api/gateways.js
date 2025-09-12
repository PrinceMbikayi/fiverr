import * as Durin from './durin';


// Harold Addition
/**
 * 
 * @param {string} name : gateway name
 * @param {number} key: box/gateway number
 * @returns 
 */
async function addGatewayObject(gatewaykey,gatewayName) {
    console.log(" API CHECK GATEWAY :", gatewayName, gatewaykey)
    const params = {  
      key: gatewaykey ,
      name: gatewayName
    }
    return Durin.add('gateway',params)
  }

  /**
*
* @param {number} gatewayId
* @param {string} objects list of uri
*/

async function modifyGateway (gatewayId,gatewayName) {
    const type = "gateway";
    console.log("CONTROLE MODIFY GATEWAY REQUEST API",gatewayName)
    const params = {name:gatewayName}
    return Durin.update(type,gatewayId,params)
  }


  /**
*
* @param {number} gatewayId
*/
async function deleteGateway (gatewayId) {
    const type = "gateway";
    return Durin.remove(type,gatewayId)
  }

/**
*
* @param {number} gatewayId
*/
async function fireDiscoverCommandOnGateway (gatewayId, commandName) {
  const actions = {
      "actions": [
          {
              "name": "COMMAND",
              "mArgs": [
                  {
                      "name": "command",
                      "value": "command/io/ezsp/discover"
                  },
                  {
                      "name": "arg1",
                      "value": "dev-0/self"
                  },
                  {
                      "name": "arg2",
                      "value": commandName
                  }
              ]
          }
      ]
  }
  const type = "object";
  const resDiscover = await Durin.update(type, gatewayId, actions)
    return resDiscover;
  }

/**
*
* @param {number} gatewayId
*/
async function fireRestartCommandOnGateway (gatewayId) {
  // const actions = {
  //   "actions": [
  //         {
  //             "name": "RESTART"
  //         }
  //     ]
  // }

  const actions = {
    "actions": [
        {
            "name": "COMMAND",
            "mArgs": [
                {
                    "name": "command",
                    "value": "command/system/gateway/restart"
                },
            ]
        }
    ]
}
  const type = "object";
  const responseRestart = await Durin.update(type, gatewayId, actions)
    return responseRestart;
  }




  export {
  
    addGatewayObject,
    modifyGateway,
    deleteGateway,
    fireDiscoverCommandOnGateway,
    fireRestartCommandOnGateway
  };