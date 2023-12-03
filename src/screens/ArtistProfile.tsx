import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';

type ArtistProfilePageNavigationProp = NavigationProp<RootStackParamList, 'ArtistProfilePage'>;

interface ArtistProfilePageProps {
    navigation: ArtistProfilePageNavigationProp;
}
const ArtistProfilePage: React.FC<ArtistProfilePageProps> = ({navigation}) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text> Artist Profile Page </Text>
        </View>
      );
};

export default ArtistProfilePage;