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

function rounded(num: number) {
  // return Math.ceil(num * 1000) / 1000;
  return num;
}

export const BrightnessLevel = Object.freeze({
  min: 0,
  max: 1,
});

export function resetBrightness() {
  return RTNBrightness.resetBrightness();
}

export function getSysBrightness(): Promise<number> {
  return RTNBrightness.getSysBrightness();
}

export function getAppBrightness(): Promise<number> {
  return RTNBrightness.getAppBrightness();
}

export function setAppBrightness(brightness: number): Promise<never> {
  return RTNBrightness.setAppBrightness(rounded(brightness));
}

export function useAppBrightness() {
  const [appBrightness, setAppBrightness] = React.useState<number>(-1);

  React.useEffect(() => {
    init();

    const eventEmitter = new NativeEventEmitter(RTNBrightness);
    let eventListener = eventEmitter.addListener(
      'Sys_Brightness_Change',
      (event) => {
        setAppBrightness(event.brightness);

        if (Platform.OS === 'android') {
          RTNBrightness.setAppBrightness(event.brightness);
        }
      }
    );

    return () => {
      RTNBrightness.resetBrightness();
      eventListener.remove();
    };
  }, []);

  async function init() {
    const sysB = await RTNBrightness.getSysBrightness();
    setAppBrightness(rounded(sysB));
  }

  function increaseAppBrightness(increase: number) {
    let brightness = appBrightness + increase;

    if (brightness > BrightnessLevel.max) {
      brightness = BrightnessLevel.max;
    }
    if (brightness < BrightnessLevel.min) {
      brightness = BrightnessLevel.min;
    }

    setAppBrightness(brightness);
    RTNBrightness.setAppBrightness(brightness);
  }

  return { appBrightness, increaseAppBrightness };
}
