import {merge as deepMerge} from 'lodash';

import themeDomus from './theme.json';
import atHomeIconSets from './atHomeIconSets.json';
import ezspIconSets from './ezspIconSets.json';
const merged = deepMerge(themeDomus,ezspIconSets,atHomeIconSets)


export default merged;