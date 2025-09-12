import React from 'react';
import { getObjectById } from '_helpers/objects';

export function alphabeticSort(arr){
    //console.log('ARRAY_TO_BUBBLESORT :', arr);
    let n = arr.length;
    for (let i = 0; i < n-1; i++){
        for (let j = 0; j < n-i-1; j++){
            const jobj = getObjectById(Number(arr[j]))
            const jPlus1obj = getObjectById(Number(arr[j+1]))
            const name1 = jobj?.name;
            const name2 = jPlus1obj?.name;

            const jName = (name1 != undefined) ?  name1.toLowerCase() : ""
            const  jPlus1Name = (name2 != undefined) ? name2.toLowerCase() : ""
            //console.log('INAME :',jName, jPlus1Name);
            if(jName > jPlus1Name){
                let temp = arr[j]
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
    return arr;
}