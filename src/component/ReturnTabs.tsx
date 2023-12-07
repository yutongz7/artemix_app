import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';

// Define the ReturnTabs functional component with proper typing
export default function ReturnTabs() {
  // Use the useNavigation hook with proper typing
  const navigation = useNavigation();

  // Function to handle the back action
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.iconView}>
        <TouchableOpacity onPress={goBack}>
            <Ionicons  name='chevron-back-circle-outline' size={40} color='#5364B7'/>
        </TouchableOpacity>
    </View>
  );

};

const styles = StyleSheet.create({
    iconView: {
        paddingLeft: 10, 
        paddingTop: 45,
        backgroundColor: 'red'
    }
})
