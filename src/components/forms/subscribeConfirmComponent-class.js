/**
 * 
 * 
 *  base : https://heartbeat.fritz.ai/build-and-validate-forms-in-react-native-using-formik-and-yup-6489e2dff6a2
 *  validation : https://www.youtube.com/watch?v=ftLy78R8xrg&list=PL4cUxeGkcC9ixPU-QkScoRBVxtPPzVjrQ&index=32
 * 
 * 
 */

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { View, Text, StyleSheet} from 'react-native';
import { Formik, withFormik, yupToFormErrors } from 'formik';
import * as yup from 'yup';
import Toast from 'react-native-root-toast';
import {withTranslation} from 'react-i18next';

import AccessButton from '../../components/forms/accessButton';
import WithTranslateFormErrors from "../../utils/withTranslateFormErrors";
import FormInput from './formInput';

//--- Appium -----
import {buildTestId} from '_helpers/appium';


const confirmFormSchema = yup.object({
  userCode: yup.string().required("USERCODE_INPUT_MANDATORY_FIELD"),
 
});



//const { t } = this.props;

class SubscribeConfirmComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        login:'',
        password:'',
        errServer:null
    }
   
  }

  
  async componentDidMount(){
    
    }
  
  componentDidUpdate(prevProps) {
   
    
    
    if (prevProps.errCode !== this.props.errCode) {
      if(this.props.errCode == 200) {
        this.setState({errServer:null})
      } else {
        this.setState({errServer:this.props.errCode})
      }
    }
    
  }


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

  





  // in order to remove errServer State
  handleFocus(e){
    console.log("handle FOCUS",this);
    this.setState({errServer:null})
  }

  goBack(){
    
    this.props.goBack();
  }

 //======== APPIUM =============
 userCodeID = buildTestId("userCode");
 buttonPreviousID = buildTestId("buttonPrevious");
 buttonValidateID = buildTestId("buttonValidate");

  render() {
    
    const { login, password } = this.state

    const { t } = this.props;

    return (
      <View style={{backgroundColor:'transparent',width:'100%'}}>
       
       {this.props.connectingError != 200 && this.props.connectingError != undefined ?
        
        <Text>Ben erreur</Text>

        :

        null
    
      }
        <Formik
              initialValues={{ userCode: '' }}
              no_validationSchema={confirmFormSchema}
              onSubmit={this.handleSubmit.bind(this)}
             
              >

              {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit }) => {
              return ( <>
               <WithTranslateFormErrors errors={errors} touched={touched} setFieldTouched={setFieldTouched}>
                <View >
                <FormInput name='userCode' value={values.userCode} placeholder={t('ENTER_USERCODE')}  autoCapitalize='characters' onChangeText={handleChange('userCode')}  iconColor='#2C384A' onFocus={this.handleFocus.bind(this)} addTestId = {this.userCodeID}/>
                <Text style={{ color: 'red' }}>{this.state.errServer}</Text>               
               
                </View> 
                  {1 == 2 &&
                  <View style={{flex:1,alignItems:'flex-end',flexDirection:'row'}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:15,paddingBottom:25}}>
                      <View  style={{width:'48%'}}>
                        <AccessButton  specialColor='#333' onPress={this.goBack.bind(this)} title={t("BUTTON_BACK")}  testAppium={this.buttonPreviousID}/>
                      </View>
                      <View  style={{width:'48%'}}>
                        <AccessButton  onPress={handleSubmit} specialColor='#333' title={t("VALIDATE")}  testAppium={this.buttonValidateID}/>
                      </View>
                    </View> 
                  </View>              
              } 
               
                </WithTranslateFormErrors>
              </>
              );
            }}
          </Formik>      
          
        </View>
    )
  }
}



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
export default withTranslation()(SubscribeConfirmComponent);