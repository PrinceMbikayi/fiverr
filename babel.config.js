// when changing brand.config.json
// remember to => npx react-native start --reset-cache
// or you'll have path errors

let babel_json = require('./brand.config.json');
console.log('the json obj',babel_json);

module.exports = {
  presets: [['@react-native/babel-preset', {
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
        extensions: ['.js', '.android.js', '.ios.js', '.web.js', '.ts', '.tsx'],
        alias: {
          "_src": './src',
          "_actions": './src/actions',
          "_api": './src/api',
          "_assets": './src/assets',
          "_components/objects": ['./src/brands/'+babel_json.brand+'/templates/components/objects','./src/components/objects'],
          "_components/list": ['./src/brands/'+babel_json.brand+'/templates/components/list','./src/components/list'],
          "_components/ui": ['./src/brands/'+babel_json.brand+'/templates/components/ui','./src/components/ui'],
          "_components": './src/components',
          "@components": './src/components',
          "_config": ['./src/brands/'+babel_json.brand+'/config','./src/config'],
          "_helpers": './src/helpers',
          "_images": './src/assets/images',
          "_screens": './src/screens',
          "_selectors": './src/selectors',
          "_store": './src/store',
          "_styles": './src/styles',
          "_theming": './src/theming',
          "_brand/templates/components/objects": ['./src/brands/'+babel_json.brand+'/templates/components/objects','./src/components/objects'],
          "_brand": './src/brands/'+babel_json.brand,
          "_hooks": './src/hooks',
          "_services": './src/services',
          "_utils": './src/utils',
          "_navigation": './src/navigation'
        }
      }
    ],
    'react-native-reanimated/plugin' // This must be listed last
  ]
};
