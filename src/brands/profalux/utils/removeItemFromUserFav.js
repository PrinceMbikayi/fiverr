import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '_store';


async function removeItemFromUserFav(itemId){

    //const dispatch = useDispatch();

    const userFav = JSON.parse(await AsyncStorage.getItem("@userFav"))

    if(userFav !== null) {
        userFav.map(async(item)=>{
            const newUserFav =  userFav.filter(item => item != itemId)
            console.log("SEE ME ITEM COUCOU !:", userFav, newUserFav)
           await AsyncStorage.setItem('@userFav',JSON.stringify(newUserFav))
           store.dispatch({type:USER_ADD_FAVORITE,payload: {'id':newUserFav} })
        })
    }

    return userFav
}

export {
    removeItemFromUserFav
};
