import { createStackNavigator } from '@react-navigation/stack';
import {noHeader} from './options';

import UdpAuditHomeScreen from '../index.js';


export const udpAuditStack = createStackNavigator(
    {
        udpAuditHome:{screen:UdpAuditHomeScreen,routeName:'udpAuditHome',navigationOptions:noHeader}
    }
)
