import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import ReturnTabs from "../component/ReturnTabs";
import Ionicons from 'react-native-vector-icons/Ionicons';

type ArtistProfilePageRouteProp = RouteProp<RootStackParamList, 'ArtistProfilePage'>;
type ArtistProfilePageNavigationProp = NavigationProp<RootStackParamList, 'ArtistProfilePage'>;

interface ArtistProfilePageProps {
  route: ArtistProfilePageRouteProp;
};

const ArtistProfilePage: React.FC<ArtistProfilePageProps> = ({route}) => {
  const recData = route.params.data;
  const [showUserArt, setShowUserArt]= useState(true);
  const [likesArts, setLikesArts] = useState([])
  const [userArt, setUserArt] = useState<Art []>([]);
  const navigation = useNavigation<ArtistProfilePageNavigationProp>();
  const [arts, setArts] = useState<Art[]>([]);
  const [curTag, setCurTag]= useState<String>("artList"); // artList / mutualPreference / schedule
  
  const userName = "nathan_j";

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
  };
  
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

  const setArtList = () => {
    setCurTag("artList");
  };
  const setMutualPreference = () => {
    setCurTag("mutualPreference");
  };
  const setSchedule = () => {
    setCurTag("schedule");
  };

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

  useEffect(() => {
    const filtered = arts.filter(art => art.userId === recData.userId);
    setUserArt(filtered);
  }, [arts, recData.userId]);

  const fetchLikesData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/likes?where={"likeFromUserId":"${userName}"}`);
      const data: likesData = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

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

  const artListView = () => {
    return (
      <ScrollView contentContainerStyle={styles.container_art} horizontal={false}>
        {userArt.map((item) => (
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
        ))}
      </ScrollView>
    );
  };

  const mutualPreferenceView = async () => {
    // let likesArtIds = [];
    // let likesArts = [];
    var likesData = await fetchLikesData();
    if (!likesData) {
      console.error('Error fetching likes data in isAlreadyLiked')
    } else {
      const userLikes = likesData.find(item => item.likeFromUserId === recData.userId);
      let likesArtIds = userLikes ? userLikes.artistIdToLikedArts : [];

      // likesArtIds = likesData.artistIdToLikedArts.{recData.userId};
      // const filteredArts = arts.filter(art => likesArtIds.includes(art.userId));
      // setLikesArts(filteredArts);
    }
    return (
      <ScrollView contentContainerStyle={styles.container_art} horizontal={false}>
        {/* {likesArts.map((item) => (
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
        ))} */}
      </ScrollView>
    );
  };

  const renderContent = () => {
    if (curTag === "artList"){
      return artListView();
    } else if (curTag === "mutualPreference") {
      return <Text>mutualPreference</Text>
    } else if(curTag === "schedule") {
      return <Text>schedule</Text>
    }
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
                <Text style={{color: '#E38F9C', fontSize: 20}}> Artist Arts </Text>
              </View>
              <View style={styles.dividerTouchable} />
            </View>
          ) : (
            <TouchableOpacity style={styles.section} onPress={setArtList}> 
              <View style={styles.touchable}>
                <Ionicons name='reorder-three' size={30} color='white' /> 
                <Text style={{color: 'white', fontSize: 20}}> Artist Arts </Text>
              </View>
              <View style={styles.dividerUnouchable} />
            </TouchableOpacity>
          )}


          {(curTag === "mutualPreference") ? (
            <View style={styles.section}> 
              <View style={styles.touchable}>
                <Ionicons name='pie-chart-outline' size={30} color='#E38F9C' /> 
                <Text style={{color: '#E38F9C', fontSize: 20}}> Analysis </Text>
              </View>
              <View style={styles.dividerTouchable} />
            </View>
          ) : (
            <TouchableOpacity style={styles.section} onPress={setMutualPreference}> 
              <View style={styles.touchable}>
                <Ionicons name='pie-chart-outline' size={30} color='white' /> 
                <Text style={{color: 'white', fontSize: 20}}> Analysis </Text>
              </View>
              <View style={styles.dividerUnouchable} />
            </TouchableOpacity>
          )}

          {(curTag === "schedule") ? (
            <View style={styles.section}> 
              <View style={styles.touchable}>
                <Ionicons name='calendar-outline' size={30} color='#E38F9C' /> 
                <Text style={{color: '#E38F9C', fontSize: 20}}> Schedule </Text>
              </View>
              <View style={styles.dividerTouchable} />
            </View>
          ) : (
            <TouchableOpacity style={styles.section} onPress={setSchedule}> 
              <View style={styles.touchable}>
                <Ionicons name='calendar-outline' size={30} color='white' /> 
                <Text style={{color: 'white', fontSize: 20}}> Schedule </Text>
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
  section: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  noContent: {
    fontSize: 20,
    marginTop: 10
  },
  container_art: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
  },
});

export default ArtistProfilePage;