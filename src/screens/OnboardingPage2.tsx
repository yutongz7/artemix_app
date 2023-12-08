import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';

type OnboardingPage2RouteProp = RouteProp<RootStackParamList, 'OnboardingPage2'>;
type OnboardingPage2NavigationProp = NavigationProp<RootStackParamList, 'OnboardingPage2'>;

interface OnboardingPage2PageProps {
  route: OnboardingPage2RouteProp;
}

const OnboardingPage2: React.FC<OnboardingPage2PageProps> = ({ route }) => {
  const navigation = useNavigation<OnboardingPage2NavigationProp>();
  const handleNextPress = () => {
      navigation.navigate('Home');
  };    

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Onboarding Page 2</Text>
      <Text style={styles.description}>
        This is a placeholder for the second onboarding page.
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
});

export default OnboardingPage2;
