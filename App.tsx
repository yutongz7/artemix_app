import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import DetailPage from './src/screens/DetailPage';
import RecPage from './src/screens/RecPage';
import LoginPage from './src/screens/LoginPage';
import RegistrationPage from './src/screens/RegistrationPage';
import ChatPage from './src/screens/ChatPage';
import ArtistProfilePage from './src/screens/ArtistProfilePage';
import ProfilePage from './src/screens/ProfilePage';
import UserSettings from './src/screens/UserSettings';
import PostPage from './src/screens/PostPage';
import OnboardingPage1 from './src/screens/OnboardingPage1';
import OnboardingPage2 from './src/screens/OnboardingPage2';
import { RootStackParamList } from './src/navigation/NavigationTypes';
import { GlobalProvider } from './GlobalContext';
import { LogBox } from "react-native"
import OnboardingHomePage from './src/screens/OnboardingHomePage';
import OnboardingNavBar from './src/screens/OnboardingNavBar';

const Stack = createNativeStackNavigator<RootStackParamList>();
LogBox.ignoreAllLogs(true);

const App = () => {
  return (
    <GlobalProvider>
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
          <Stack.Screen name="ArtistProfilePage" component={ArtistProfilePage} />
          <Stack.Screen name="ChatPage" component={ChatPage} />
          <Stack.Screen name="ProfilePage" component={ProfilePage} />
          <Stack.Screen name="UserSettings" component={UserSettings} />
          <Stack.Screen name="PostPage" component={PostPage} />
          <Stack.Screen name="OnboardingHomePage" component={OnboardingHomePage}/>
          <Stack.Screen name="OnboardingNavBar" component={OnboardingNavBar}/>
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
};

export default App;
