import React from 'react';
import {getObjectById} from '_helpers/objects';





    // This function checks if at least one elt of groupList is in types. 
    // And return a list of groups (groups ids) that satisfy the condition, while excluding duplicates
    export const filterGroupsToRetain = (groupList, types)=>{
        let toRetain = [];
        let flag = false;
        groupList.map( (item)=>{
            const grpComponentTypes = getObjectById(item)?.componentTypes;
            console.log("AVOIR Types components :", getObjectById(item).id,  grpComponentTypes);
            grpComponentTypes?.some((elt)=>{
                flag = types?.includes(elt); 
                console.log('AVOIR FLAG :', flag)
                if(flag && !toRetain?.includes(item)){
                    toRetain.push(item)
                }
            })
        })

        return toRetain;
    }