import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';

type RecPageRouteProp = RouteProp<RootStackParamList, 'RecPage'>;
type RecPageNavigationProp = NavigationProp<RootStackParamList, 'RecPage'>;

interface RecPageProps {
  route: RecPageRouteProp;
}

interface ArtistData {
  _id: string;
  userId: string;
  userName: string;
  userPassword: string;
  userEmail: string;
  userPhone: number;
  userProfileImgAddress: string;
  userPreferenceTags: string[];
  tags: string[];
}

const RecPage: React.FC<RecPageProps> = ({ route }) => {
  const [artistInfo, setArtistInfo] = useState<ArtistData[]>([]);
  const recData = route.params.data;
  const navigation = useNavigation<RecPageNavigationProp>();

  console.log("recData: ", recData);

  const fetchArtistData = async () => {
    try {
      console.log("recData.artistId = ", recData.artistId)
      const response = await fetch(`http://localhost:4000/users?where={"userId":"${recData.artistId}"}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setArtistInfo(data.data);
      console.log("artistInfo: ", artistInfo)
      return data;
    } catch(error) {
      console.error('Error fetching arts:', error);
    }
  }

  const handleSaveForLater = () => {
    navigation.navigate('DetailPage', {
      data: { 
        artId: recData.artId,
        userId: recData.artistId,
        userName: recData.artistUsername,
        artTitle: recData.artTitle,
        artContent: recData.artContent,
        artAddress: recData.artAddress,
        artTags: recData.artTags,
        width: recData.width,
        height: recData.height
      }
    })
  };

  const handleViewProfile = () => {
    navigation.navigate('ArtistProfilePage');
  };

  const formattedInterests = recData.artistPreferenceTags?.join(' | ')

  // useEffect(() => {
  //   if (recData.artistId) {
  //     console.log("recData.artistId = ", recData.artistId)
  //     fetch(`http://localhost:4000/users?where={"userId":"${recData.artistId}"}`)
  //       .then((response) => response.json())
  //       .then((fetchData) => {
  //         if (fetchData && fetchData.data) {
  //           setArtistInfo(fetchData.data)
  //           console.log("artistInfo: ", artistInfo)
  //         } else {
  //           console.error('Invalid artist data format: ', fetchData)
  //         }
  //       })
  //       .catch((error) => console.error('Error fetching arts:', error));
  //   } else {
  //     console.log("Artist ID is not defined.");
  //   }
  // }, []);

  // useEffect(() => {
  //   if (recData.artistId) {
  //     fetchArtistData();
  //   }
  // }, [recData.artistId]);

  const firstArtist = artistInfo[0];
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <Text style={styles.introText}>We think you'd get along great with ...</Text>
      </View>
      <View style={styles.profilePhotoContainer}>
        <Image
          source={{uri: `http://localhost:4000/images/${recData.artistProfileImgAddress}`}}
          // source={{uri: `http://localhost:4000/images/${artistInfo[0].userProfileImgAddress}`}}
          style={{ width: 200, height: 200 }}
        />
      </View>
      <View>
        <Text style={styles.nameText}>{recData.artistUsername}</Text>
      </View>
      <View>
        <Text style={styles.interestText}>{formattedInterests}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleViewProfile()}>
          <View style={styles.saveForLaterContainer}>
            <Image
                source={require('../assets/icons/viewProfile.png')}
                style={styles.imageStyle}
              />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSaveForLater()}>
          <View style={styles.saveForLaterContainer}>
            <Image
                source={require('../assets/icons/SaveForLater.png')}
                style={styles.imageStyle}
              />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  saveForLaterContainer: {
    marginLeft: 20,
    paddingTop: 5,
  },
  profilePhotoContainer: {
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  introText: {
    fontSize: 20,
    fontFamily: 'QuattrocentoSans-Italic',
  },
  nameText: {
    fontSize: 35,
    fontFamily: 'QuattrocentoSans-Italic',
  },
  interestText: {
    fontSize: 23,
    fontFamily: 'QuattrocentoSans-Italic',
  },
  imageStyle: {
    width: 116,
    height: 44,
  },
});

export default RecPage;