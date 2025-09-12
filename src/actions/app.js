export const APP_PREVIOUS_ROUTE = 'APP::PREVIOUS::ROUTE';
export const APP_REFRESH = 'APP::REFRESH';
export const APP_FOCUS_ADDED_PRODUCT = 'APP::FOCUS::ADDED::PRODUCT';

export const CLOSE_WS = 'APP::CLOSE';

// Harold catches status discovery from websocket
export const GET_DISCOVERY_EZSP = 'APP::GET_DISCOVERY_EZSP';



export const appPreviousRouteUpdate = previousRoute => ({
    type: APP_PREVIOUS_ROUTE,
    previousRoute
})

export const appRefresh = () => ({
    type: APP_REFRESH
})
export const closeWS = () => ({
    type: CLOSE_WS
})

export const focusAddedProduct = (val) => ( {
    type:APP_FOCUS_ADDED_PRODUCT,
    payload:val
})

export const getDiscoveryEzsp = (val) => ( {
    type:GET_DISCOVERY_EZSP,
    payload:val
})