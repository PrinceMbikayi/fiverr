import productByCommercialName from './productByCommercialName.json';
import  atHomeProductByCommercialName from '../../../athome/config/products/productByCommercialName.json';

// you can add other Brand products
// as it's a merge of objects, put current brand at the end of the spread
export const extrasProductByCommercialName = {...atHomeProductByCommercialName,...productByCommercialName}



