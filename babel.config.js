// when changing brand.config.json
// remember to => npx react-native start --reset-cache
// or you'll have path errors


//require('dotenv').config({ path: './.env.development' });
let babel_json = require('./brand.config.json');
console.log('the json obj',babel_json);
//const btheme = process.env.VENDOR;
module.exports = {
  presets: [['module:metro-react-native-babel-preset', {
    unstable_disableES6Transforms: true
}]],

env: {
  production: {
    plugins: ['transform-remove-console'],
  },
},
  
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.js', '.android.js', '.ios.js', '.web.js'],
        alias: {
           "_src" : './src',
          "_actions" : './src/actions',
          "_api"      : './src/api',
          "_assets" : './src/assets',
          "_components/objects" : ['./src/brands/'+babel_json.brand+'/templates/components/objects','./src/components/objects'],
          "_components/list" : ['./src/brands/'+babel_json.brand+'/templates/components/list','./src/components/list'],
          "_components/ui" : ['./src/brands/'+babel_json.brand+'/templates/components/ui','./src/components/ui'],
          "_components" : './src/components',
          "@components" : './src/components',
          //"_config":'./src/config',
          "_config":['./src/brands/'+babel_json.brand+'/config','./src/config'],
          "_helpers" : './src/helpers',
          "_images" : './src/assets/images',
          "_screens":'./src/screens',
          //"_screens":['./src/brands/'+babel_json.brand+'/templates/screens', './src/screens'],
          "_selectors":'./src/selectors',          
          "_store":'./src/store',
          "_styles" : './src/styles',
          "_theming":'./src/theming',
          "_brand/templates/components/objects":['./src/brands/'+babel_json.brand+'/templates/components/objects','./src/components/objects'],
          "_brand":'./src/brands/'+babel_json.brand,
          "_hooks":'./src/hooks',
          "_services":'./src/services',
          "_utils":'./src/utils',
          "_navigation":['./src/brands/'+babel_json.brand+'/navigation', "./src/navigation/v5"]
        }
      }
    ],
    ["transform-inline-environment-variables", {
      "include": [
        "TESTO"
      ]
    }],
    'react-native-reanimated/plugin',
  ]
};
