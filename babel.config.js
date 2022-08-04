module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['react-native-reanimated/plugin'],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
      },
    ],
    // [
    //   'babel-plugin-rewrite-require',
    //   {
    //     aliases: {
    //       crypto: 'react-native-crypto',
    //       randombytes: 'react-native-randombytes',
    //     },
    //   },
    // ],
  ],
};
// "postinstall": "node_modules/.bin/rn-nodeify --install crypto,http,https,fs,path --hack"
// "react-native-http": "github:tradle/react-native-http#834492d",
