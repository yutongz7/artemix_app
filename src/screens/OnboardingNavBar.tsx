import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image } from 'react-native';
import OnboardingHomePage from '../screens/OnboardingHomePage';
import SearchPage from '../screens/SearchPage';
import PostPage from '../screens/PostPage';
import InboxPage from '../screens/InboxPage';
import ProfilePage from '../screens/ProfilePage';

const Tab = createBottomTabNavigator();

const OnboardingNavBar: React.FC = () => {

  const LogoImg = () => {
    return (
      <Image source={require('../assets/logo.png')} style={{marginBottom: 7, marginRight: 15, width: 80, height: 20}}></Image>
    )
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerRight: () => <LogoImg />,
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
      <Tab.Screen name="Home" component={OnboardingHomePage}/>
      <Tab.Screen name="Search" component={SearchPage} />
      <Tab.Screen name="Post" component={PostPage} />
      <Tab.Screen name="Chat" component={InboxPage} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  ) as React.ReactElement;
};

export default OnboardingNavBar;
