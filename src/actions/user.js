export const USER_SET = 'USER::SET'
export const USER_DEL = 'USER:DEL'
export const USER_UPDATE = 'USER::UPDATE'
export const USER_LOGGED_IN = 'USER::LOGGED_IN'
export const USER_LOGGED_OUT = 'USER::LOGGED_OUT'
export const USER_LOG_ERROR = 'USER::LOG_ERROR'
export const USER_SET_NICKNAME = 'USER::SET_NICKNAME';
export const USER_SET_DEFAULT_WEATHER = "USER::SET::DEFAULT::WEATHER"
export const USER_SET_IS_TESTER = "USER::SET::IS::TESTER"
export const USER_ADD_FAVORITE = "USER::ADD::FAVORITE"
export const USER_REMOVE_FAVORITE = "USER::REMOVE::FAVORITE"
export const USER_REMOVE_ONE_FAVORITE = "USER::REMOVE::ONE::FAVORITE"
export const USER_SET_LOGIN = "USER::SET::LOGIN"

export const USER_SET_PREF='USER::SET::PREFERENCE'


export const userUpdate = email => ({
    type: 'USER_UPDATE',
    email
})

export const login = () =>({
    type: 'USER_LOGGED_IN',
    loggedIn
})

export const logout = () =>({
    type: 'USER_LOGGED_OUT',
    loggedIn
})


export const loginError = err =>({
  type: USER_LOG_ERROR,
  payload:err
});

export const userNickname = (nickname) => {
    //console.log("nickname",nickname)
    return ({
        type: USER_SET_NICKNAME,
        payload: {'nickname':nickname}
    })
}

export const userUpdateLogin = (login) => {
    //console.log("nickname",nickname)
    return ({
        type: USER_SET_LOGIN,
        payload: {'login':login}
    })
}
export const userDefaultWeather = (id) => {
    return ({
        type:USER_SET_DEFAULT_WEATHER,
        payload:{'id':id}
    })
}


// export const userSetPref = (preferenceName,preferenceValue) => {
//     return ({
//         type:USER_SET_DEFAULT_WEATHER,
//         payload:{'preferenceName':preferenceName,'preferenceValue':preferenceValue}
//     })
// }

export const userSetPref = (preferenceName,preferenceValue) => {
    return ({
        type:USER_SET_PREF,
        payload:{'name':preferenceName,'value':preferenceValue}
    })
}

export const userSetIsTester = (isTester) => {
    return ({
        type: USER_SET_IS_TESTER,
        payload: {'isTester':isTester}
    })
}


export const userAddFovorite = (id) => {
    return ({
        type:USER_ADD_FAVORITE,
        payload:{'id':id}
    })
}
export const userRemoveFavorite = () => {
    return ({
        type:USER_REMOVE_FAVORITE,
    })
}

export const userRemoveOneItemToFavorite = (id) => {
    return ({
        type:USER_REMOVE_ONE_FAVORITE,
        payload:{'id':id}
    })
}


 
