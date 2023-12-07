import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';

type OnboardingPage1RouteProp = RouteProp<RootStackParamList, 'OnboardingPage1'>;
type OnboardingPage1NavigationProp = NavigationProp<RootStackParamList, 'OnboardingPage1'>;

const OnboardingPage1 = () => {
    const navigation = useNavigation<OnboardingPage1NavigationProp>();
    const handleNextPress = () => {
        navigation.navigate('OnboardingPage2');
    };

    const goBack = () => {
        navigation.goBack();
      };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconView} onPress={goBack}>
        <Ionicons name='chevron-back-outline' size={35} color='#5364B7'/>
      </TouchableOpacity>
      <Text style={styles.title}>Welcome to the Onboarding Page 1</Text>
      <Text style={styles.description}>
        This is a placeholder for the first onboarding page.
      </Text>
      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  nextButton: {
    backgroundColor: '#5364B7',
    borderRadius: 10,
    width: 150,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 20,
  },
  iconView: {
    width: 40,
    marginRight: 40,
    marginLeft: 8,
    left: 0,
    marginTop: 10,
  },
});

export default OnboardingPage1;
