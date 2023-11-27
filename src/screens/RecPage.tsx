import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';

type RecPageRouteProp = RouteProp<RootStackParamList, 'RecPage'>;
type RecPageNavigationProp = NavigationProp<RootStackParamList, 'RecPage'>;

interface RecPageProps {
  route: RecPageRouteProp;
}
const RecPage: React.FC<RecPageProps> = ({route}) => {
const recData = route.params.data;
    console.log(recData)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>We think you'd love collaborating with {recData.artistUsername} </Text>
    </View>
  );
};

export default RecPage;