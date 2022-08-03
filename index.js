import {registerRootComponent} from 'expo';
import {AppRegistry, LogBox, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

LogBox.ignoreLogs(['Require cycle: node_modules/victory-vendor']);

// if (Platform.OS == 'android') {
registerRootComponent(App);
// } else {
//   AppRegistry.registerComponent(appName, () => App);
// }
