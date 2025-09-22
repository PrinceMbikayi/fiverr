
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';




export const ReloadDetector = (props) => {

    const isReloading = useSelector(state => state.objects.reload)
    const iconName = "md-refresh";
    const iconColor = "white";
    const iconBackgroundColor = "#228B22";
    const iconSize  = 20;
    return (
       <>
        {isReloading &&
            <View style={{position:'absolute',flex:1,bottom:10,right:15}}>
                <View style={{width:iconSize,height:iconSize,backgroundColor:iconBackgroundColor,alignItems:'center',justifyContent:'center',borderRadius:iconSize/2,flex:1}}>
                <Icon name={iconName} size={iconSize} color={iconColor}/>
                </View>
             </View>
        }
      </>
    );
}