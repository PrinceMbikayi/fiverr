import React, { useContext, useState, useEffect ,useRef} from 'react';
import { View,Text,TouchableOpacity,Pressable } from 'react-native';


const GlobalModalContext = React.createContext();

export const GlobalModalContextProvider = ({ children }) => {
    const [isVisible,setIsVisible] = useState(false);
    const [backgroundStyle, setBackgroundStyle] = useState({backgroundColor:'#00000099'});
    const [body, setBody] = useState(null);
    const [options, setOptions] = useState({justifyContent:'center'});
    const [onCancel, setOnCancel] = useState(false);

  const cancelRef = useRef(false)

  useEffect(() => {
    (async () => {
        /*
      const storedThemeID = await AsyncStorage.getItem(STORAGE_KEY);
      const defaultMode = (Appearance.getColorScheme() == 'dark') ? "DARK" : "LIGHT"

      if (storedThemeID) setThemeID(storedThemeID);
     
      else setThemeID(defaultMode);
      
     */
     //setThemeID(THEMES[1].key);

     


    })();
  }, []);


  
const onCloseModal = () => {
   
    setIsVisible(false);
}

const setCancelRef = (cb) => {
  console.log("in setCancelRef",cb)
  cancelRef.current = cb;
}

const onDoCancel = () => {
  console.log("cancelRef.current",cancelRef.current)
  if(cancelRef.current) {
    console.log("so it not null onCancel")
    cancelRef.current();
    cancelRef.current = null;
  }
 
  setIsVisible(false);
}


const baseStyle = {position:'absolute',top:0,left:0,bottom:0,right:0,flex:1,backgroundColor:'yellow',alignItems:'center',justifyContent:'flex-end'}

const ModalTypeRef = useRef({type:null,style:{}})
const setType = (type) => {
  console.log("in SetType 2",type)
  const extraStyle = setStyle(type);
  console.log("extraStyle",extraStyle)
  ModalTypeRef.current.style = extraStyle;
}
const setStyle = (type) => {
  const retVal = styles[type] || styles.default;
  return retVal
}

const styles = {
  "bottom": {justifyContent:'flex-end'},
  "default":  {justifyContent:'flex-end'},
  "centered":{justifyContent:'center',padding:16}
}
  return (
    <GlobalModalContext.Provider value={{ isVisible, setIsVisible,body,setBody,setType,setCancelRef,onDoCancel}}>
      {children}
      {isVisible && 
        <Pressable  style={[baseStyle,backgroundStyle,ModalTypeRef.current?.style]} onPress={onDoCancel}>
            <View style={{width:'100%'}}>{body}</View>       
        </Pressable>
      }
    </GlobalModalContext.Provider>
  );
};



//============= exposed below ====================================

export const useGlobalModal = () => {
   
    const { isVisible, setIsVisible, body, setBody,setType,close:doClose, setCancelRef,onDoCancel} = useContext(GlobalModalContext);

    const toggle = () => {   
        setIsVisible(!isVisible)
    
    }

    const setContent = (content,options={},cancelCallback) => {
        console.log("content",content);        
        setType(options?.type)
        setBody(content)
        if(cancelCallback)setCancelRef(cancelCallback)
    }

    const close = () => {
        setIsVisible(false);
    }

    const open = () => {
      setIsVisible(true);
    }

     const show = () => {
      open()
    }
     const hide = () => {
      close()
    }

    const cancel = () => {
      onDoCancel();
    }
    const setCancel = (cb) => {
      console.log("cb",cb)
      setCancelRef(cb);
      console.log("cb after",cb);
    }

  return {

    toggle, 
    setContent ,
    close ,
    open,
    show,hide,
    setCancel,
    cancel
  }     
}

/*

   const close = () => {
        setIsVisible(false);
    }

    const hide = () => {
      close()
    }

    const open = () => {
      setIsVisible(true);
    }
    const show = () => {
      open()
    }*/