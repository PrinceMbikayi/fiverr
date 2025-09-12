// Attention encode / decode base 64

import base64 from 'react-native-base64'
import utf8 from 'utf8'; /*needed from french accent */

import store from '../store';
import { objectUpdateFromWebsocket, objectDelete, objectUpdatePropertyFromWebsocket } from '../actions/objects'
import { addObjectAction, refreshObjectAction } from '../actions/asyncActions'

import { getDiscoveryEzsp } from '_actions/app';


const ignoreEvents = ['event/notify/log/']
const ignoreStatuses = ['time', 'out-packets', 'in-packets', 'out-bytes', 'in-bytes'];


var cmd_id = 1;


// ========================================================
var gSrc;
var gDst;


// ======================== SEND ===========================
// arguments instead of identified parameter
export const ws_send_data = function () {

  var gSrc, gDst;
  var rsc = arguments[0];
  var dst = arguments[1];
  var data = "";
  var loginData = "";
  if (rsc != "login") {
    data = " " + Math.round(+new Date() / 1000);
  }
  for (var i = 2; i < arguments.length; i++) {
    if (arguments[i] !== undefined)
      data = data + ' @' + base64.encode(arguments[i]);
    loginData = loginData + arguments[i]
  }
  var msg;
  var src = gSrc || dst + "_web";
  var lDst = dst || gDst || "/";
  msg = "p1 " + cmd_id + " " + src + " " + lDst + " " + rsc + data;

  /*
  if(rsc == "login") {
    msg = "p1 " + cmd_id + " " + src + " " + lDst + " " + rsc + " "+loginData
  }
  */

  cmd_id++;
  return msg;
}

export const recieve_message = function (msg) {
 console.log("::::RECIEVED_WEB_SOCKET_MESSAGE::::",msg, msg.data)
  var j = msg.data.split(';');
  var args = [];

  if (j.length == 1) {
    var darray = trim(msg.data).split(' ');
    //console.log('darray',darray);
    if (darray[0] == "p1") {
      var i = 0;
      var src = darray[2];
      var dst = darray[3];
      if (src == "*") {
        return;
      }
      var cmd = darray[4];
      if (dst != "*" && dst != gSrc) {
        //if we don't know our name, accept all destinations
        if (gSrc && cmd != "name") {
          //console.log("Message '" + msg.data + "' has destination '" + dst + "'. It should be '" + gSrc + "'. Ignoring.");
          return;
        }
      }
      while (darray[5 + i]) {
        if (darray[5 + i].beginsWith("@"))
          args[i] = utf8.decode(base64.decode(darray[5 + i].substring(1)));
        else
          args[i] = trim_quotes(darray[5 + i]);
        i++;

      }

      let checking;
      //console.log(" YOOOOOOHH ===============> cmd: ", cmd,  ',',  "args : ", args)
      if (args[1] != undefined) {
        checking = args[1].substr(-9, 9);

        if (checking == 'discovery') {
          //|| args[2]== 'completed'
          if (args[2] == 'starting' || args[2] == 'completed') {
            // console.log(" YOOOOOOHH ===============> args",checking, " : ", args[2])
            // catch my discovery status here
            const action = getDiscoveryEzsp(args[2]);
            store.dispatch(action);
          }
        }
      }

      //console.log(cmd, " YOOOOOOHH ===============> args",cmd, args)

      //return true;
      if (cmd.beginsWith('command')) {
        //proceesCommandMessages(cmd,sc,dst,args)
      }



      switch (cmd) {
        case 'name':
          gSrc = args[0];
          break;

        case 'status':
        case 'event':
        case 'trigger':
          const rsc = args[1];
          const last_rsc = rsc.split('/').pop();
          do_status_event_trigger(cmd, darray[2], args[0], args[1], args[2]);
          break;

        case "command/gui/request_confirmation":
          //do_command_gui_request_confirmation(args[0], args[1],args[2],JSON.parse(args[3]),args[4],args[5])
          break;
        case "command/gui/reloadObject":
          //console.log('RELOAD OBJECT or ADD or Remove !!!!!!!!!!!!!!!!!!!!!!!!!!',args)
          var encodedObjectId = darray[5].split("@");
          var objectId;
          // n for not specified
          var refreshState = "n";

          if (encodedObjectId[1] !== undefined) {
            // DOMUS- console.log('before window.atob',args)
            var objectIdAndStatus = base64.decode(encodedObjectId[1]);
            objectId = objectIdAndStatus.slice(1);
            refreshState = objectIdAndStatus.slice(0, 1);
            //console.log('after window.atob',args)
          }
          else {
            objectId = darray[5];
          }

          //console.log('AAAAAAcommand/gui/reloadObject',cmd,objectId,refreshState)
          switch (refreshState) {
            case "+":
              tellStoreAddObject(objectId);
              break;
            case '-':
              tellStoreDeleteObject(objectId);
              break;
            case 'n':
              tellStoreRefreshObject(objectId)
              break
          }

          break; // end command/gui/reloadObject
        // Gateway
        case "gwNetworkDeviceDiscovered":
          break;
        case "gwNetworkStepDone":
          break;
        case "gwNetworkComplete":
          break;
      }

    } // fin de p1

  } // limit j.lenght == 1

}

/**
 * 
 * @param {*} src 
 * @param {*} timestamp 
 * @param {*} rsc 
 * @param {*} value 
 */

function do_status_event_trigger(cmd, src, timestamp, rsc, value) {
  /********** multiGateways ****************************/
  // console.log("do_status_event_trigger","cmd",cmd,"src",src,"timestamp",timestamp,"rsc",rsc,"value",value);
  console.log(
      `:::::::::::::::::::::::::COMING_WEBSOCKET_EVENT_:::: \nType : ${cmd} \nOrigin : ${src} \nEvent : ${rsc} \nValue : ${value} \nTimestamp : ${timestamp}
      `
    );

  const eventIdPrefix = src;

  if (rsc == undefined) return;
  if (rsc.beginsWith("@")) {
    return;
  }


  var last_rsc = rsc.split('/').pop();

  if (rsc) {

    if (rsc.charAt(0) == '/') rsc = rsc.slice(1);
    if (rsc.beginsWith("event/system/gateway/")) {
      // console.log('ben : rsc.beginsWith("event/system/gateway/"')
    } else if (last_rsc == "present") {
      // console.log("last present")
      var eventId = rsc.substring(0, rsc.length - last_rsc.length);
      console.log("il y a un changement de present",eventId,last_rsc, value)
      const nextValue = (value.toString() == "0" || value.toString() == "false") ? false : true
      //console.log("nextValue",nextValue);

      // don't do anything here just pass eventId,
      // do modification in reducer if needed
      // 
      /*
      const lastEventNameChar = eventId.charAt(eventId.length-1);
      if(lastEventNameChar == "/")eventId = eventId.slice(0,-1)
      */



      tellStoreUpdateProperty(eventIdPrefix + "_" + eventId, "connected", nextValue)
      tellStore(eventIdPrefix + "_" + eventId, last_rsc, value);

    } else if (rsc.beginsWith("event/")) {



      if (value == undefined) return

      var status = rsc.split('/')[rsc.split('/').length - 1];
      var eventId = rsc.substring(0, rsc.length - status.length);

      if (ignoreEvents.indexOf(eventId) != -1) return true;
      /*
      console.log('--------------------------')
      console.log("cmd ("+cmd+"), eventId (",eventId,"), status (",status+"), value ("+value+")")
      console.log('--------------------------')
      */
      if (ignoreStatuses.indexOf(status) != -1) return true;
      // console.log('so do it for status -------------------------->('+status+')')
      // console.log("---------------------------------------------------------------------")
      // console.log("-- event => ",eventIdPrefix+"_"+eventId + "[status:"+status+"] ("+value+") ---"+"\n\n")
      // console.log("---------------------------------------------------------------------")
      tellStore(eventIdPrefix + "_" + eventId, status, value);
      //console.log("store told")

    }
  }


}

function tellStore(eventId, statusName, value) {
 // console.log("::::::::::::__WEBSOCKET_EVENT_tellStore",eventId,statusName,value)
  store.dispatch(objectUpdateFromWebsocket(eventId, statusName, value));

  //debouncedGreet(objectId)
}

function tellStoreAddObject(objectId) {
  //console.log("tellStoreAddObject", objectId)
  addObjectAction(objectId, store.dispatch)
}

function tellStoreDeleteObject(objectId) {
  const action = objectDelete(objectId)
  store.dispatch(action)
}
function tellStoreRefreshObject(objectId) {
  refreshObjectAction(objectId, store)
}

function tellStoreUpdateProperty(eventId, property, value) {

  const action = objectUpdatePropertyFromWebsocket(eventId, property, value)
  store.dispatch(action);
}

//============================================
const debounce = (callback, delay = 250) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      timeoutId = null
      callback(...args)
    }, delay)
  }
}

const greet = (objectId) => console.log('----------------------------> Hello World MAN!', objectId)
const debouncedGreet = debounce(greet, 3000)


// UTILS 
function trim(myString) {
  return myString.replace(/^\s+/g, '').replace(/\s+$/g, '')
}

function trim_quotes(myString) {
  // TODO MCE: improve this
  return myString.replace(/^\"+/g, '').replace(/\"+$/g, '')
}

String.prototype.beginsWith = function (string) {
  return (this.indexOf(string) === 0);
};


