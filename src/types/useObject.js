/**
 *  @typedef {function} getStatus
 *  @param {string} statusName
 * @returns {object}
 */
/**
 *
 * @callback uObjectDoUpdateStatus
 * @param {string} statusName
 * @param {object} statusValue
 * 
 * @callback uObjectExecuteAction
 * @param {string} actionName 
 * @param {object} params
 * 
 * @callback uObjectRename
 * @param {string} newName
 */


/**
 * @typedef {object} UseObject
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
