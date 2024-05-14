import React from 'react';
import { NativeModules, Platform, NativeEventEmitter } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-brightness' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RTNBrightness = NativeModules.RTNBrightness
  ? NativeModules.RTNBrightness
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const BrightnessLevel = Object.freeze({
  min: 0,
  max: 1,
});

export function syncWithSysBrightness() {
  return RTNBrightness.syncWithSysBrightness();
}

export function getSysBrightness(): Promise<number> {
  return RTNBrightness.getSysBrightness();
}

export function getAppBrightness(): Promise<number> {
  return RTNBrightness.getAppBrightness();
}

export function setAppBrightness(brightness: number): Promise<never> {
  const appBrightness =
    brightness < BrightnessLevel.min
      ? BrightnessLevel.min
      : brightness > BrightnessLevel.max
        ? BrightnessLevel.max
        : brightness;
  return RTNBrightness.setAppBrightness(appBrightness);
}

export function useBrightness() {
  const [appBrightness, setAppBrightness] = React.useState<number>(-1);
  const [sysBrightness, setSysBrightness] = React.useState<number>(-1);

  React.useEffect(() => {
    init();

    const eventEmitter = new NativeEventEmitter(RTNBrightness);
    let eventListener = eventEmitter.addListener(
      'Sys_Brightness_Change',
      (event) => {
        setSysBrightness(event.brightness);
        setAppBrightness(event.brightness);

        if (Platform.OS === 'android') {
          RTNBrightness.setAppBrightness(event.brightness);
        }
      }
    );

    return () => {
      RTNBrightness.syncWithSysBrightness();
      eventListener.remove();
    };
  }, []);

  async function init() {
    const sysB = await RTNBrightness.getSysBrightness();
    setAppBrightness(sysB);
    setSysBrightness(sysB);
  }

  return { appBrightness, sysBrightness };
}
