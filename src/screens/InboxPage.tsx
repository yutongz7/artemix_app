import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';

const InboxPage: React.FC = () => {
  const userName = "nathan_j"; // use for now before login implemented
  
  type InboxPageNavigationProp = NavigationProp<RootStackParamList, 'InboxPage'>;
  const navigation = useNavigation<InboxPageNavigationProp>();

  const handleChat = () => {
    navigation.navigate('ChatPage');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Inbox Page Content Goes Here</Text>
      <TouchableOpacity onPress={() => handleChat()}>
        <View style={styles.imageStyle}>
          <Image
              source={{uri: `http://localhost:4000/images/${userName}.png`}}
              style={styles.imageStyle}
            />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 80,
    height:80,
  },
});

export default InboxPage;