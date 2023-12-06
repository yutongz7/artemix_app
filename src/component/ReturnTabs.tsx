import React from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, Image, View } from 'react-native';

// Define the Container component using styled-components
const Container = styled(View)`
  height: 100px;
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 1;
  flex-direction: row;
  background-color: #F0F2F5; 
  border-bottom-width: 5px;
  border-bottom-color: #E8E8E8;
  border-top-width: 1px;
  border-top-color: #E8E8E8;
  justify-content: space-between;
`;

// Define the Menu component using styled-components
const Menu = styled(TouchableOpacity)`
  width: 20%;
  height: 50%;
  justify-content: center;
  align-items: center;
  marginTop: 40px;
`;

// Define the Icon component using styled-components
const Icon = styled(Image).attrs({ resizeMode: 'contain' })`
  height: 34px;
  width: 40px;
`;

// Define the ReturnTabs functional component with proper typing
export default function ReturnTabs() {
  // Use the useNavigation hook with proper typing
  const navigation = useNavigation();

  // Function to handle the back action
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <Container>
      <Menu onPress={goBack}>
        <Icon resizeMode='contain' source={require('../assets/icons/Back.png')} />
      </Menu>
    </Container>
  );
}
