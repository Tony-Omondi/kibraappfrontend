import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const TEXT = 'KIBRACONNECT';

const SplashScreen = () => {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const letterAnimations = useRef(
    TEXT.split('').map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Fade in and scale logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Sequential Pixar-style bounce for each letter
    const animations = letterAnimations.map((anim, index) =>
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.spring(anim, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(100, animations).start(() => {
      // Navigate after all letters bounce in
      setTimeout(async () => {
        const token = await AsyncStorage.getItem('access_token');
        navigation.replace(token ? 'Home' : 'Login');
      }, 2000);
    });
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.textRow}>
          {TEXT.split('').map((char, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.letter,
                {
                  transform: [
                    {
                      scale: letterAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                    {
                      translateY: letterAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                  opacity: letterAnimations[index],
                },
              ]}
            >
              {char}
            </Animated.Text>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141f18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: '#2a4133',
    padding: 10,
  },
  textRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  letter: {
    fontSize: 30,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#94e0b2',
    letterSpacing: 1,
  },
});

export default SplashScreen;
