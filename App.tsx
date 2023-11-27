import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import DetailPage from './src/screens/DetailPage';
import RecPage from './src/screens/RecPage';
import HomePage from './src/screens/HomePage';
import { RootStackParamList } from './src/navigation/NavigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator   screenOptions={{
    headerShown: false
  }}>
        <Stack.Screen name="Home" component={BottomTabNavigator}/>
        <Stack.Screen name="DetailPage" component={DetailPage}/>
        <Stack.Screen name="RecPage" component={RecPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;