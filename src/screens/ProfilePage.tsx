import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Art {
  _id: string;
  userId: string;
  userName: string;
  artTitle: string;
  artContent: string;
  artAddress: string;
  artTags: {type: [String], default: []};
  width: number;
  height: number;
}

interface likesData {
  _id: string;
  likeFromUserId: string;
  artistIdToLikedArts: Map<string, string[]>;
  __v: number;
  likedArtIds: string[];
}

type ProfilePageNavigationProp = NavigationProp<RootStackParamList, 'ProfilePage'>;

const ProfilePage: React.FC = () => {
  const userName = 'nathan_j';
  const [showUserArt, setShowUserArt]= useState(true);
  const [arts, setArts] = useState<Art[]>([]); // for all art
  const [userArt, setUserArt] = useState<Art []>([]);
  const [likesData, setLikesData] = useState<likesData []>([]);
  const [likedArt, setLikedArt] = useState<Art []>([]);

  const toggleView = () => {
    setShowUserArt(!showUserArt);
  };

  // fetch art
  useEffect(() => {
    fetch('http://localhost:4000/arts')
      .then((response) => response.json())
      .then((data) => {
        const artsWithDimensions = data.data.map((art: Art) => ({
          ...art,
          width: art.width,
          height: art.height,
        }));
        setArts(artsWithDimensions);
      })
      .catch((error) => console.error('Error fetching arts:', error));
  }, []);

  // get all arts filtered by the current user
  useEffect(() => {
    const filtered = arts.filter(art => art.userId === userName);
    setUserArt(filtered);
  }, [arts, userName]);

  // fetch user likes data
  useEffect(() => {
    fetch(`http://localhost:4000/likes?where={"likeFromUserId":"${userName}"}`)
      .then((response) => response.json())
      .then((data) => {
        const likesProcessing = data.data.map((likes: likesData) => ({
          ...likes,
          _id: likes._id,
          __v: likes.__v,
          likeFromUserId: likes.likeFromUserId,
          artistIdToLikedArts: likes.artistIdToLikedArts,
          likedArtIds: likes.likedArtIds
        }));
        setLikesData(likesProcessing);
        console.log(likesData);
        const buffer = arts.filter((art) => 
          likesData[0].likedArtIds.includes(art._id)
        );
        setLikedArt(buffer);
        console.log(likedArt);
      })
      .catch((error) => console.error('Error fetching likes:', error));
  }, []);

  // Function to calculate scaled dimensions while maintaining aspect ratio
  const getScaledDimensions = (originalWidth: number, originalHeight: number, maxWidth: number, maxHeight: number) => {
    const aspectRatio = originalWidth / originalHeight;

    // Calculate scaled dimensions
    let scaledWidth = originalWidth;
    let scaledHeight = originalHeight;

    if (scaledWidth > maxWidth) {
      scaledWidth = maxWidth;
      scaledHeight = scaledWidth / aspectRatio;
    }

    if (scaledHeight > maxHeight) {
      scaledHeight = maxHeight;
      scaledWidth = scaledHeight * aspectRatio;
    }

    return { width: scaledWidth, height: scaledHeight };
  };

  const navigation = useNavigation<ProfilePageNavigationProp>();

  const handleImagePress = (art: Art) => {
    navigation.navigate('DetailPage', {
      data: { 
        artId: art._id,
        userId: art.userId,
        userName: art.userName,
        artTitle: art.artTitle,
        artContent: art.artContent,
        artAddress: art.artAddress,
        artTags: art.artTags,
        width: art.width,
        height: art.height
      }
    })
    console.log('Image pressed:', art);
  };

  const renderContent = () => {
    if (showUserArt) {
      // Render user's art posts
      return (
        <ScrollView contentContainerStyle={styles.container} horizontal={false}>
          {(userArt.length === 0) ? (
            <Text style={styles.noContent}>No posts yet.</Text>
          ) : (
            userArt.map((item) => (
              <TouchableOpacity
              key={item._id} 
              onPress={() => handleImagePress(item)}
              >
                <Image
                  source={{ uri: `http://localhost:4000/images/${item.artAddress}` }}
                  style={{
                      ...getScaledDimensions(item.width, item.height, 160, 300),
                      margin: 10,
                      borderRadius: 10,
                    }}
                />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      );
    } else {
      // Render liked posts
      return (
        <ScrollView contentContainerStyle={styles.container} horizontal={false}>
          {(likedArt.length === 0) ? (
            <Text style={styles.noContent}>No likes yet.</Text>
          ) : (
            likedArt.map((item) => (
              <TouchableOpacity key={item._id} onPress={() => handleImagePress(item)}>
                <Image
                  source={{ uri: `http://localhost:4000/images/${item.artAddress}` }}
                  style={{
                      ...getScaledDimensions(item.width, item.height, 160, 300),
                      margin: 10,
                      borderRadius: 10,
                    }}
                />
              </TouchableOpacity>
            ))
            )}
        </ScrollView>
      );
    }
  };


  return (
    <View>
      <View style={styles.bioInfo}>
        <Image
                source={{uri: `http://localhost:4000/images/${userName}.png`}}
                style={styles.imageStyle}
        />
        <Text style={{fontSize: 30, marginTop: 10}}>Nathan J</Text>
        <Text style={{marginTop: 5}}>Photographer</Text>
      </View>
      <View style={styles.artToggle}>

        {showUserArt ? (
          <View style={styles.touchable}>
            <Ionicons name='reorder-three' size={30} color='#E38F9C'/>
            <Text style={{color: '#E38F9C', fontSize: 20}}> Your Art </Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.touchable} onPress={toggleView}>
            <Ionicons name='reorder-three' size={30} color='white'/>
            <Text style={{color: 'white', fontSize: 20}}> Your Art </Text>
          </TouchableOpacity>
        )}

        {!showUserArt ? (
          <View style={styles.touchable}>
            <Ionicons name='heart-outline' size={30} color='#E38F9C' /> 
            <Text style={{color: '#E38F9C', fontSize: 20}}> Art Liked </Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.touchable} onPress={toggleView}>
            <Ionicons name='heart-outline' size={30} color='white' /> 
            <Text style={{color: 'white', fontSize: 20}}> Art Liked </Text>
          </TouchableOpacity>
        )} 
      </View>
      {renderContent()}
    </View>

  );
};

const styles = StyleSheet.create({
  bioInfo: {
    alignSelf: 'center',
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
    paddingRight: 40,
    paddingLeft: 40
  },
  activeText: {
    color: '#E38F9C', 
    fontSize: 20
  },
  inactiveText: {
    color: 'white',
    fontSize: 20
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    minHeight: "50%"
  },
  noContent: {
    fontSize: 20,
    marginTop: 10
  },
});

export default ProfilePage;