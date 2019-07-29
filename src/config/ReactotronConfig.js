import Reactotron from 'reactotron-react-native'

if (__DEV__) {
  const tron =
    Reactotron
      .configure() // controls connection & communication settings
      // .configure() // for android { host: '192.168.0.2' }
      .useReactNative() // add all built-in react native plugins
      .connect() // let's connect!

  console.tron = tron;
  tron.clear();
}
