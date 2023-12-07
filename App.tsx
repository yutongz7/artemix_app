import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import DetailPage from './src/screens/DetailPage';
import RecPage from './src/screens/RecPage';
import LoginPage from './src/screens/LoginPage';
import RegistrationPage from './src/screens/RegistrationPage';
import OnboardingPage1 from './src/screens/OnboardingPage1';
import OnboardingPage2 from './src/screens/OnboardingPage2';
import ChatPage from './src/screens/ChatPage';
import ArtistProfilePage from './src/screens/ArtistProfilePage';
import ProfilePage from './src/screens/ProfilePage';
import UserSettings from './src/screens/UserSettings';
import { RootStackParamList } from './src/navigation/NavigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="LoginPage"
      >
        <Stack.Screen name="Home" component={BottomTabNavigator} />
        <Stack.Screen name="DetailPage" component={DetailPage} />
        <Stack.Screen name="RecPage" component={RecPage} />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="RegistrationPage" component={RegistrationPage} />
        <Stack.Screen name="OnboardingPage1" component={OnboardingPage1} />
        <Stack.Screen name="OnboardingPage2" component={OnboardingPage2} />
        <Stack.Screen name="ArtistProfilePage" component={ArtistProfilePage} />
        <Stack.Screen name="ChatPage" component={ChatPage} />
        <Stack.Screen name="ProfilePage" component={ProfilePage} />
        <Stack.Screen name="UserSettings" component={UserSettings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
