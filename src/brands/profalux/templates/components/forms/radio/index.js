import React from 'react';
import {useState,useEffect} from 'react';
//-----------------------------------------------------
import SimpleAnswer from './answerTemplates/simple';
import {CheckBox as CB } from './answerTemplates/simple';
export const CheckBox = CB


//--------------------------------------
const Answer = (props) => {
    const Renderer = props.renderer;
    const {isSelected} = props;

    useEffect(()=> {
       
        // needed for redraw
    },[isSelected]);

    return (
        <Renderer {...props} />
    )
}
//--------------------------------------

/**
 * 
 * @param {object} props 
 * @param {object} props.datas  
 * @returns 
 */
const Answers = (props) => {


    const {onAnswerSelect,datas,multiple,answerRenderer = SimpleAnswer,autoSelect,design} = props;
    const [initialSectionDone, setInitialSectionDone] = useState(null);
    const [multipleAnswers, setMultipleAnswers] = useState([]);

    const [selectionIndex, setSelectionIndex] = useState(null);
   
    useEffect(()=> {
        // just redraw
    },[selectionIndex,multipleAnswers])
   
    //const answers = qDatas?.answers || [];
    const answers = datas.answers || [];
    useEffect(()=> {
        if(autoSelect && answers.length > 0 && !initialSectionDone) {
            const selection = autoSelect-1;
            doSelect(answers[selection].value,selection)
            setInitialSectionDone(true);
        }
    },[answers]);
   
 
   const doSelect = (response,index) => {
        if(!multiple) {
            setSelectionIndex(index)
            onAnswerSelect(response,index)
        } else {
           
            let currentMultiple = JSON.parse(JSON.stringify(multipleAnswers))
            const pos = currentMultiple.indexOf(index);
            if(pos == -1) {
                currentMultiple.push(index)
            } else {
                currentMultiple.splice(pos,1)
            }
          
            setMultipleAnswers(currentMultiple)
            onAnswerSelect(currentMultiple)
        }
       
   }


        return (
            answers.map((v,i) => {
               
                const description = v?.description  || null;
                return (
                    <Answer label={v.label}
                            response={v.value} 
                            icon={v.icon}
                            key={"answer_"+i} 
                            description={description} 
                            isSelected={(selectionIndex === i || multipleAnswers.indexOf(i) != -1)} 
                            index={i} 
                            onAnswerSelect={doSelect}
                            theme={props?.theme} 
                            renderer={answerRenderer}
                            design={design}
                            />
                    
                )
            })
        )
}

export default Answers;
