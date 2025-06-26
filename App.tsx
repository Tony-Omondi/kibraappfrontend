import React from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <SplashScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181411',
  },
});

export default App;