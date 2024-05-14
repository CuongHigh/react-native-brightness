# react-native-brightness

Screen brightness adjustment tool for ReactNative iOS and Android.

## Installation

```sh
npm install git+https://github.com/CuongHigh/react-native-brightness.git
```

or

```sh
yarn add git+https://github.com/CuongHigh/react-native-brightness.git
```

If using iOS please remember to install cocoapods by running: npx pod-install

## Usage

```js
import {
  useBrightness,
  setAppBrightness,
  syncWithSysBrightness,
} from 'react-native-brightness';

// ...

const { appBrightness, sysBrightness } = useBrightness();

useEffect(() => {
  setAppBrightness(0.5);

  return () => {
    syncWithSysBrightness();
  };
}, []);
```

### Android:

- `getAppBrightness`: Get current brightness of your app

- `getSysBrightness`: Get current brightness of your phone

- `setAppBrightness`: set brightness your app from 0.0(min) to 1.0(max)

- `syncWithSysBrightness`: set app-brightness same with phone-brightness

- `useBrightness`:
    + appBrightness is current app-brightness
    + sysBrightness is current phone-brightness, sysBrightness always sync with phone brightness setting

### Ios: only have phone-brightness

- `getAppBrightness`: Get current brightness of your phone

- `getSysBrightness`: Get current brightness of your phone

- `setAppBrightness`: set brightness your phone from 0.0(min) to 1.0(max)

- `syncWithSysBrightness`: no support, because ios only have phone-brightness

- `useBrightness`:
    + appBrightness is current phone-brightness
    + sysBrightness is current phone-brightness, sysBrightness always sync with phone brightness setting

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
