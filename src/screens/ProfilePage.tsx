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
  artTags: {type: [string], default: []};
  width: number;
  height: number;
}

interface likesData {
  message: string;
  data: {
    _id: string;
    likeFromUserId: string;
    artistIdToLikedArts: Map<string, string[]>;
    __v: number;
    likedArtIds: string[];
  }[];
};

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
};

type ProfilePageNavigationProp = NavigationProp<RootStackParamList, 'ProfilePage'>;

const ProfilePage: React.FC = () => {
  const userName = 'nathan_j';
  const [showUserArt, setShowUserArt]= useState(true);
  const [arts, setArts] = useState<Art[]>([]); // for all art
  const [userArt, setUserArt] = useState<Art []>([]);
  const [curLikedArt, setCurLikedArt] = useState<Art []>([]);
  const [curArtistIds, setCurArtistIds] = useState<string[]>([]);
  const [curArtistList, setCurArtistList] = useState<ArtistData[]>([]);
  const [curTag, setCurTag]= useState<string>("YourArts"); // YourArts / LikedArts / Artists

  const toggleView = () => {
    setShowUserArt(!showUserArt);
  };

  const setYourArts = () => {
    setCurTag("YourArts")
  };
  const setLikedArts = () => {
    setCurTag("LikedArts")
  };
  const setArtists = () => {
    setCurTag("Artists")
  };

  // fetch art
  // useEffect(() => {
  //   fetch('http://localhost:4000/arts')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const artsWithDimensions = data.data.map((art: Art) => ({
  //         ...art,
  //         width: art.width,
  //         height: art.height,
  //       }));
  //       setArts(artsWithDimensions);
  //     })
  //     .catch((error) => console.error('Error fetching arts:', error));
  // }, []);
  useEffect(() => {
    // fetch art
    let isMounted = true; // flag to check if component is mounted

    const fetchArts = async () => {
      try {
        const response = await fetch('http://localhost:4000/arts');
        const data = await response.json();
        if (isMounted) {
          const artsWithDimensions = data.data.map((art: Art) => ({
            ...art,
            width: art.width,
            height: art.height,
          }));
          setArts(artsWithDimensions);
        }
      } catch (error) {
        console.error('Error fetching arts:', error);
      }
    };

    fetchArts();

    return () => {
      isMounted = false; // set flag to false when component unmounts
    };
  }, []);

  // get all arts filtered by the current user
  useEffect(() => {
    const filtered = arts.filter(art => art.userId === userName);
    setUserArt(filtered);
  }, [arts, userName]);

  const fetchLikesData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/likes?where={"likeFromUserId":"${userName}"}`);
      const data: likesData = await response.json();
      return data.data;
    } catch(error) {
      console.error('Error fetching likes:', error);
    }
  };

  const fetchArtistData = async (userId : string) => {
    try {
      const response = await fetch(`http://localhost:4000/users?where={"userId":"${userId}"}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching arts:', error);
    }
  };

  const getLikedlData = async() => {
    let filteredArts: Art[] = [];
    var likesData = await fetchLikesData();
    if (!likesData) {
      console.error('Error fetching likes data in isAlreadyLiked')
    } else {
      const userLikedIds = likesData[0].likedArtIds;
      const userLikes = likesData[0].artistIdToLikedArts;
      const newEntries = Object.entries(userLikes) as [string, string[]][];
      const newMap = new Map<string, string[]>(newEntries);
      const likesArtIds = userLikes ? Array.from(newMap.keys()) : [];
      setCurArtistIds(likesArtIds);
      filteredArts = arts.filter(art => userLikedIds?.includes(art._id));
      setCurLikedArt(filteredArts);
    }
  };

  const getArtistData = async () => {
    let artistList: ArtistData[] = [];
    for (const userId of curArtistIds) {
      const artistData = await fetchArtistData(userId);
      artistList.push(artistData.data[0])
    }
    setCurArtistList(artistList);
  };

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
    // console.log('Image pressed:', art);
  };

  const handleSettingsPress = () => {
    navigation.navigate('UserSettings');
    // console.log('Image pressed:');
  };

  const handleChat = (item:ArtistData) => {
    navigation.navigate('ChatPage', {
      data: {
        userId: item.userId,
        userName: item.userName,
        userProfileImgAddress: item.userProfileImgAddress,
        userPreferenceTags: item.userPreferenceTags,
        tags: item.tags,
      }
    });
  };

  const handleArtistsProfile = (item: ArtistData) => {
    navigation.navigate('ArtistProfilePage', {
      data: {
        userId: item.userId,
        userName: item.userName,
        userProfileImgAddress: item.userProfileImgAddress,
        userPreferenceTags: item.userPreferenceTags,
        userTags: item.tags,
      }
    });
  };

  const renderContent = () => {
    if (curTag === 'YourArts') {
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
    } else if (curTag === 'LikedArts'){
      // Render liked posts
      if (curArtistIds.length === 0) {
        getLikedlData();
      }
      
      return (
        <ScrollView contentContainerStyle={styles.container} horizontal={false}>
          {(curLikedArt.length === 0) ? (
            <Text style={styles.noContent}>No likes yet.</Text>
          ) : (
            curLikedArt.map((item) => (
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
    } else if (curTag === 'Artists') {
      if (curArtistIds.length == 0) {
        getLikedlData();
      }
      if (curArtistList.length == 0) {
        getArtistData();
      }
      return (
        <ScrollView contentContainerStyle={styles.lineContainer} horizontal={false}>
          {curArtistList?.map((item) => (
            <View key={item._id}>
              <View style={styles.itemContainer}>
                <TouchableOpacity key={item._id} onPress={() => handleArtistsProfile(item)}>
                  <Image
                    source={{uri: `http://localhost:4000/images/${item.userProfileImgAddress}`}}
                    style={styles.imgStyle}
                  />
                </TouchableOpacity>
                <View style={styles.itemInfo}>
                  <Text style={styles.nameText}>{item.userName}</Text>
                  <Text style={styles.tagsText}>{item.userPreferenceTags?.join(' | ')}</Text>
                </View>
                <TouchableOpacity onPress={() => handleChat(item)}>
                  <Ionicons name='chatbubbles' size={35} color='#E38F9C' />
                </TouchableOpacity>
              </View>
              <View style={styles.lineDivider} />
            </View>
          ))}
        </ScrollView>
      )
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
        <View style={styles.settingsContainer}>
          <TouchableOpacity onPress={() => handleSettingsPress()}>
            <Ionicons name='settings-sharp' size={25} color='white'/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.artToggle}>
          {(curTag === "YourArts") ? (
            <View style={styles.section}> 
              <View style={styles.touchable}>
                <Ionicons name='reorder-three' size={30} color='#E38F9C' /> 
                <Text style={{color: '#E38F9C', fontSize: 20}}> Your Arts </Text>
              </View>
              <View style={styles.dividerTouchable} />
            </View>
          ) : (
            <TouchableOpacity style={styles.section} onPress={setYourArts}> 
              <View style={styles.touchable}>
                <Ionicons name='reorder-three' size={30} color='white' /> 
                <Text style={{color: 'white', fontSize: 20}}> Your Arts </Text>
              </View>
              <View style={styles.dividerUnouchable} />
            </TouchableOpacity>
          )}


          {(curTag === "LikedArts") ? (
            <View style={styles.section}> 
              <View style={styles.touchable}>
                <Ionicons name='heart-outline' size={30} color='#E38F9C' /> 
                <Text style={{color: '#E38F9C', fontSize: 20}}> Liked Arts </Text>
              </View>
              <View style={styles.dividerTouchable} />
            </View>
          ) : (
            <TouchableOpacity style={styles.section} onPress={setLikedArts}> 
              <View style={styles.touchable}>
                <Ionicons name='heart-outline' size={30} color='white' /> 
                <Text style={{color: 'white', fontSize: 20}}> Liked Arts </Text>
              </View>
              <View style={styles.dividerUnouchable} />
            </TouchableOpacity>
          )}

          {(curTag === "Artists") ? (
            <View style={styles.section}> 
              <View style={styles.touchable}>
                <Ionicons name='people-outline' size={30} color='#E38F9C' /> 
                <Text style={{color: '#E38F9C', fontSize: 20}}> Artists </Text>
              </View>
              <View style={styles.dividerTouchable} />
            </View>
          ) : (
            <TouchableOpacity style={styles.section} onPress={setArtists}> 
              <View style={styles.touchable}>
                <Ionicons name='people-outline' size={30} color='white' /> 
                <Text style={{color: 'white', fontSize: 20}}> Artists </Text>
              </View>
              <View style={styles.dividerUnouchable} />
            </TouchableOpacity>
          )}
        </View>
      {renderContent()}
    </View>

  );
};

const styles = StyleSheet.create({
  imgStyle: {
    width: 70,
    height: 70,
    borderRadius: 200
  },
  lineContainer: {
    flexWrap: 'wrap',
    paddingLeft: 10,
    marginVertical: 10,
    justifyContent: 'flex-start',
  },
  itemContainer: {
    // flex: 1, 
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 0,
    height: 80,
    width: 350,
    // backgroundColor: 'green'
  },
  lineDivider: {
    height: 1,
    width: 380,
    marginleft: 20,
    marginTop: 8,
    marginBottom: 8,
    // backgroundColor: '#FCC6CF',
  },
  itemInfo: {
    flex: 1, 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'flex-start',
    width: 300, 
    height: 50,
    marginLeft: 20,
    // backgroundColor: 'blue'
  },
  nameText: {
    fontSize: 20,
    fontWeight: '600',
  },
  tagsText: {
    fontSize: 15,
    fontWeight: '300',
  },
  textText: {
    fontSize: 16,
    color: '#7E397C',
    marginTop: 10,
  },
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
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(61, 28, 81, 0.7)',
    marginTop: 15
  },
  touchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 10,
    // width: 150,
    height: 30,
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
  dividerTouchable: {
    height: 3,
    width: 100,
    bottom: -15,
    backgroundColor: '#E38F9C',
  },
  dividerUnouchable: {
    height: 3,
    width: 95,
    bottom: -15,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  settingsContainer: {
    position: 'absolute', 
    bottom: 80, 
    left: 80, 
    backgroundColor:'#5364B7',
    width: 35,
    height: 35,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default ProfilePage;