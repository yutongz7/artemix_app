import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import ReturnTabs from "../component/ReturnTabs";
import Ionicons from 'react-native-vector-icons/Ionicons';

type ArtistProfilePageRouteProp = RouteProp<RootStackParamList, 'ArtistProfilePage'>;
type ArtistProfilePageNavigationProp = NavigationProp<RootStackParamList, 'ArtistProfilePage'>;

interface ArtistProfilePageProps {
  route: ArtistProfilePageRouteProp;
}

const ArtistProfilePage: React.FC<ArtistProfilePageProps> = ({route}) => {
  const recData = route.params.data;
  const [showUserArt, setShowUserArt]= useState(true);
  const navigation = useNavigation<ArtistProfilePageNavigationProp>();
  const [curTag, setCurTag]= useState<String>("mutualPreference");
  
  const toggleView = () => {

  };

  return (
      <View style={styles.container}>
        <ReturnTabs/>
        <View style={styles.bioInfo}>
          <Image
                  source={{uri: `http://localhost:4000/images/${recData.userId}.png`}}
                  style={styles.imageStyle}
          />
          <Text style={{fontSize: 30, marginTop: 10}}>{recData.userName}</Text>
          <Text style={{marginTop: 5}}>{recData.userPreferenceTags.join(' | ')}</Text>
        </View>
        <View style={styles.artToggle}>
          {(curTag === "artList") ? (
            <View style={styles.section}> 
              <View style={styles.touchable}>
                <Ionicons name='reorder-three' size={30} color='#E38F9C' /> 
                <Text style={{color: '#E38F9C', fontSize: 20}}> Art Liked </Text>
              </View>
              <View style={styles.dividerTouchable} />
            </View>
          ) : (
            <View style={styles.section}> 
              <View style={styles.touchable}>
                <Ionicons name='reorder-three' size={30} color='white' /> 
                <Text style={{color: 'white', fontSize: 20}}> Art Liked </Text>
              </View>
              <View style={styles.dividerUnouchable} />
            </View>
          )}


          {(curTag === "mutualPreference") ? (
            <View style={styles.section}> 
              <View style={styles.touchable}>
                <Ionicons name='reorder-three' size={30} color='#E38F9C' /> 
                <Text style={{color: '#E38F9C', fontSize: 20}}> Art Liked </Text>
              </View>
              <View style={styles.dividerTouchable} />
            </View>
          ) : (
            <View style={styles.section}> 
              <View style={styles.touchable}>
                <Ionicons name='reorder-three' size={30} color='white' /> 
                <Text style={{color: 'white', fontSize: 20}}> Art Liked </Text>
              </View>
              <View style={styles.dividerUnouchable} />
            </View>
          )}

          {(curTag === "Schedule") ? (
            <View style={styles.section}> 
              <View style={styles.touchable}>
                <Ionicons name='reorder-three' size={30} color='#E38F9C' /> 
                <Text style={{color: '#E38F9C', fontSize: 20}}> Art Liked </Text>
              </View>
              <View style={styles.dividerTouchable} />
            </View>
          ) : (
            <View style={styles.section}> 
              <View style={styles.touchable}>
                <Ionicons name='reorder-three' size={30} color='white' /> 
                <Text style={{color: 'white', fontSize: 20}}> Art Liked </Text>
              </View>
              <View style={styles.dividerUnouchable} />
            </View>
          )}
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
  bioInfo: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 100,
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  imageStyle: {
    marginTop: 15,
    width: 100,
    height: 100,
    borderRadius: 200
  },
  artToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(61, 28, 81, 0.7)',
    marginTop: 15
  },
  touchable: {
    flexDirection: 'row',
    paddingRight: 10,
    paddingLeft: 10,
    // marginTop: -40,
    height: 30,
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dividerTouchable: {
    height: 3,
    width: 95,
    bottom: -15,
    backgroundColor: '#E38F9C',
  },
  dividerUnouchable: {
    height: 3,
    width: 95,
    bottom: -15,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
});

export default ArtistProfilePage;