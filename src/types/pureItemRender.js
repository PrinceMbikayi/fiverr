/**
 * @typedef {Object} PureItemRender
 * @property {object} itemDatas - les données
 * @property {object} widgetReferenceDatas - les données de référence pour affichage
 * @property {getStatus} getStatus 
 * @property {uObjectDoUpdateStatus} updateStatus 
 * @property {function} execute
 * @property {boolean} connected 
 * @property {function(string,number):object} execute 
 * - arg0 {string} actionName
 * - arg1 {object} params
 * 
 */

// having to export an empty object here is annoying, 
// but required for vscode to pass on your types. 
export {};