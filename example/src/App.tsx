import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import BrightnessComponent from './brightness';

export default function App() {
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <View>{visible && <BrightnessComponent />}</View>
      <TouchableOpacity
        onPress={() => {
          setVisible((prv) => !prv);
        }}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: 'red',
        }}
      >
        <Text style={{ fontSize: 30 }}>{visible ? 'hide' : 'show'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 30,
    backgroundColor: '#fff',
  },
});
