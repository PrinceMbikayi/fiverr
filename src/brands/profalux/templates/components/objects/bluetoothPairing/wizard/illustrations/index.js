import React from 'react';
import Gauge from './Gauge';
import House from './OurHouse';
import Windy from './Windy';
import Car from './Car';

const illustrations = {"gauge":<Gauge/>,"house":<House/>,"windy":<Windy/>,'auto':<Car/>}

const getIllustration = (name) => {
    return illustrations[name];
}
export {Gauge,getIllustration}