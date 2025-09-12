import {isPlainObject} from 'lodash';

import { AthomeProductsImages} from '_assets/images/products/athome';

export const buildAddProductsList = (products,t) => {
    
    const result = products.reduce((r,v,i) => {
        
        if(!isPlainObject(v)) {
         
          r.push({  productId:v,
                    name:t('productAtHome:'+v+'_NAME'),
                    shortDescription:t('productAtHome:'+v+'_SHORT_DESCRIPTION'),
                    avatar_url: AthomeProductsImages[v]
                  });
          } else {
            
            const infos = v;
            const name = (v.devices.length > 1) ? infos.name : v.devices[0]

            r.push( {productId:name,
              name:t('productAtHome:'+name+'_NAME'),
              shortDescription:t('productAtHome:'+name+'_SHORT_DESCRIPTION'),
              avatar_url: AthomeProductsImages[v],
              realCat:infos.name
            })
          }
        return r;
      },[])

      return result;
}