import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomePage from '../screens/HomePage';
import SearchPage from '../screens/SearchPage';
import PostPage from '../screens/PostPage';
import ChatPage from '../screens/ChatPage';
import ProfilePage from '../screens/ProfilePage';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarLabelStyle: {
          display: "none"
        },
        tabBarActiveTintColor: "#E38F9C",
        tabBarInactiveTintColor: "white",
        tabBarStyle: [
          { 
            backgroundColor: 'rgba(61, 28, 81, 0.7)',
          }
        ],
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Post') {
            iconName = focused? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName ?? 'help'} size={size + 4} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Search" component={SearchPage} />
      <Tab.Screen name="Post" component={PostPage} />
      <Tab.Screen name="Chat" component={ChatPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  ) as React.ReactElement;
};

export default BottomTabNavigator;
