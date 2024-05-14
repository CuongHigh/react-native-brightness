import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { setAppBrightness, useBrightness } from 'react-native-brightness';

export default function BrightnessComponent() {
  const { appBrightness } = useBrightness();

  async function increase() {
    setAppBrightness(appBrightness + 0.05);
  }

  async function decrease() {
    setAppBrightness(appBrightness - 0.05);
  }

  return (
    <View style={{ rowGap: 10 }}>
      <Text style={{ color: '#000', width: '100%' }}>
        Brightness Level: {appBrightness}
      </Text>

      <View style={{ flexDirection: 'row', columnGap: 20 }}>
        <TouchableOpacity
          onPress={decrease}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: 'red',
          }}
        >
          <Text style={{ fontSize: 30 }}>{'<'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={increase}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: 'red',
          }}
        >
          <Text style={{ fontSize: 30 }}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
