/**
 * 
 * 
 *  base : https://heartbeat.fritz.ai/build-and-validate-forms-in-react-native-using-formik-and-yup-6489e2dff6a2
 *  validation : https://www.youtube.com/watch?v=ftLy78R8xrg&list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ&index=32
 * 
 * 
 */

import React, { useRef,useState,useEffect,forwardRef,useImperativeHandle } from 'react';

import PropTypes from 'prop-types';
import { View, Text, StyleSheet} from 'react-native';
import { Formik} from 'formik';
import * as yup from 'yup';
import Toast from 'react-native-root-toast';
import { useTranslation } from 'react-i18next'; // needed for menuItme renderer

import AccessButton from '../../components/forms/accessButton';


import WithTranslateFormErrors from "../../utils/withTranslateFormErrors";
import FormInput from './formInput';





//--- Appium -----
import {buildTestId} from '_helpers/appium';


const confirmFormSchema = yup.object({
  userCode: yup.string().required("USERCODE_INPUT_MANDATORY_FIELD"),
 
});



//const { t } = this.props;
/*
class SubscribeConfirmComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        login:'',
        password:'',
        errServer:null
    }
   
  }
*/

  const SubscribeConfirmComponent = forwardRef((props,ref) => {

  
   
    const [login, setLogin] = useState(null);
    const [password, setPassword] = useState(null);
    const [errServer, setErrServer] = useState(null);

    const {connectingError,errCode,submit:submitToParent} = props


    const formikRef = useRef(null)
    useImperativeHandle(ref, () => ({
           
     
      submitForm() {   
        formikRef.current.submitForm();        
          //setModalVisible(!modalVisible);
      }
  }));




    useEffect(()=> {
    
    },[]);



    useEffect(()=> {
      setErrServer((errCode == 200) ? null : errCode)
    },[errCode]);
 
    /*
  handleChange(prop,value){
    //console.log(prop,value);
    //this.setState({errServer:null});
  }

 async handleSubmit(values){   
   
  console.log(values);
    let validData = [];
    let isValid =  await confirmFormSchema.isValid(values);

    if(isValid) {
     
      this.props.submit(values);
      //return true
    } else {
      try {
        validData = await confirmFormSchema.validate(values,{abortEarly:false});   
      
      } catch (error) {
        validData = error.errors      
      }   
    
      let msg ="\n";
      validData.forEach(err => { 
        console.log(this.props.t(err));
        msg+= this.props.t(err)+"\n";
      });
      
      Toast.show(msg);
    }
    

  }

  
*/


const handleSubmit = (values) => {
  console.log("formik values",values)
  submitToParent(values)
}





 //======== APPIUM =============
 userCodeID = buildTestId("userCode");
 buttonPreviousID = buildTestId("buttonPrevious");
 buttonValidateID = buildTestId("buttonValidate");


 const { t, i18n } = useTranslation();


    
   

    

    return (
      <View style={{backgroundColor:'transparent',width:'100%'}}>
       
       {connectingError != 200 && connectingError != undefined ?
        
        <Text>Connecting Error !</Text>

        :

        null
    
      }
        <Formik
              initialValues={{ userCode: '' }}
              innerRef={formikRef}  
              no_validationSchema={confirmFormSchema}
              onSubmit={handleSubmit}
             
              >

              {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => {
              return ( <>
               <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>
                <View >
                <FormInput name='userCode' value={values.userCode} placeholder={t('ENTER_USERCODE')}  autoCapitalize = "characters" onChangeText={handleChange('userCode')}  iconColor='#2C384A'  addTestId = {this.userCodeID}/>
                <Text style={{ color: 'red' }}>{errServer}</Text>               
               
                </View> 
                 
               
                </WithTranslateFormErrors>
              </>
              );
            }}
          </Formik>      
          
        </View>
    )
  }
  ) // end forward 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  buttonContainer: {
    margin: 25
  }
})

SubscribeConfirmComponent.propTypes = {
    // You can declare that a prop is a specific JS primitive. By default, these
    // are all optional.
   /* label: PropTypes.string.isRequired,*/
    submit: PropTypes.func.isRequired,
   
  
}
export default SubscribeConfirmComponent