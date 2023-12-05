import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback} from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import Comments from './Comments';

type DetailPageRouteProp = RouteProp<RootStackParamList, 'DetailPage'>;
type DetailPageNavigationProp = NavigationProp<RootStackParamList, 'DetailPage'>;

interface DetailPageProps {
  route: DetailPageRouteProp;
  //artId: string;
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

const DetailPage: React.FC<DetailPageProps> = ({route}) => {
    const pressedArtData = route.params.data;
    console.log("pressedArtData: ", pressedArtData)
    const navigation = useNavigation<DetailPageNavigationProp>();
    const [isLiked, setIsLiked] = useState(false);
    const [commentsBarOpacity, setCommentsBarOpacity] = useState(0.3)
    const [isModalVisible, setModalVisible] = useState(false);
    var recommendThisArtist = false;
    const [artistInfo, setArtistInfo] = useState<ArtistData[]>([]);
    const [artistProfileImgAddress, setArtistProfileImgAddress] = useState("");
    const [artistPreferenceTags, setArtistPreferenceTags] = useState([]);
    const [isNewRecommendArtist, setIsNewRecommendArtist] = useState(true);

    const tags: string[] = (pressedArtData.artTags as unknown) as string[];

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    const userName = "nathan_j"; // use for now before login implemented

    interface likesData {
      message: string;
      data: {
        _id: string;
        likeFromUserId: string;
        artistIdToLikedArts: Map<string, string[]>;
        __v: number;
        likedArtIds: string[];
      }[];
    }

    const fetchLikesData = async () => {
        try {
          const response = await fetch(`http://localhost:4000/likes?where={"likeFromUserId":"${userName}"}`);
          const data: likesData = await response.json();
          return data;
        } catch (error) {
          console.error('Error fetching likes:', error);
        }
    }

    // if art was already liked, display it as liked
    const isAlreadyLiked = async () => {
      var likesData = await fetchLikesData();
      if (!likesData) {
        console.error('Error fetching likes data in isAlreadyLiked')
      } else {
        if (likesData.data[0].likedArtIds.includes(pressedArtData.artId)) {
          setIsLiked(true);
          setCommentsBarOpacity(!isLiked ? 1 : 0.3);
        }
      }
    }

    useEffect(() => {
      isAlreadyLiked();
    }, []);

    const fetchArtistData = async () => {
      console.log("fetchArtistData");
      try {
        const response = await fetch(`http://localhost:4000/users?where={"userId":"${pressedArtData.userId}"}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // setArtistProfileImgAddress(data.data[0].userProfileImgAddress);
        // console.log("artistProfileImgAddress = ", artistProfileImgAddress)
        // setArtistPreferenceTags(data.data[0].userPreferenceTags);
        // console.log("artistPreferenceTags = ", artistPreferenceTags)
        setArtistInfo(data.data);
        console.log("artistProfileImgAddress = ", artistInfo[0].userProfileImgAddress);
        console.log("artistPreferenceTags = ", artistInfo[0].userPreferenceTags);
        console.log("artistInfo: ", artistInfo);
        return data;
      } catch(error) {
        console.error('Error fetching arts:', error);
      }
    };
    
    useEffect(() => {
      fetchArtistData();
    }, [])

    interface recommendArtistData {
      message: string;
      data: {
        _id: string;
        userId: String;
        recommendArtistIds: Map<string, string>;
      }[];
    };

    const fetchRecommendArtist = async () => {
      console.log("fetchRecommendArtist");
      try {
        const response = await fetch(`http://localhost:4000/recommendArtists?where={"userId":"${userName}"}`);
        const data: recommendArtistData = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching recommendArtists: ', error);
      }
    };

    const updateRecommendArtistsTable = async () => {
      console.log("updateRecommendArtistsTable: isLiked = ", isLiked)
      if (isLiked === false) {
        console.log("updateRecommendArtistsTable");
        var recommendArtist = await fetchRecommendArtist();
        if (!recommendArtist) {
          console.error('Error fetching recommendArtist data in updateRecommendArtistsTable')
        } else {
          const keys = Object.keys(recommendArtist.data[0].recommendArtistIds);
          if (keys.includes(pressedArtData.userId)) {
            // already recommended
            console.log("updateRecommendArtistsTable: already recommended");
            console.log("before: isNewRecommendArtist = ", isNewRecommendArtist)
            setIsNewRecommendArtist(false);
            console.log("after: isNewRecommendArtist = ", isNewRecommendArtist)
          } else {
            // update recommendArtistIds
            setIsNewRecommendArtist(true);
            console.log("updateRecommendArtistsTable: update recommendArtistIds");
            
            const keyId = pressedArtData.userId;
            const newRecommendArtistIds = { 
              ...recommendArtist.data[0].recommendArtistIds, 
              [keyId]: "notChat" 
            };
            const newRecommendArtist = {
              userId: userName,
              recommendArtistIds: newRecommendArtistIds,
            };
            console.log("newRecommendArtist: ", newRecommendArtist)
            try {
              const response = await fetch('http://localhost:4000/recommendArtists', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRecommendArtist),
              });
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const result = await response.json();
              console.log("successful post: ", result);
            } catch (error) {
              console.error("Error when post recommendArtist data: ", error);
            }
          }
        }
        return recommendArtist;
      }
    }

    // useEffect(() => {
    //   updateRecommendArtistsTable();
    // }, []);

    const toggleLike = async () => {
      var likesData = await fetchLikesData();
      if (!likesData) {
        console.error('Error fetching likes data in toggleLike');
      } else {
          var incrementLikes = false;
          if (!isLiked) { // user just liked the art
            incrementLikes = true;
          }
          // console.log(JSON.stringify(likesData, null, 2));
          const artistIdToLikedArts = new Map<string, string[]>(Object.entries(likesData.data[0].artistIdToLikedArts));
          // console.log("BEFORE " + likesData.data[0].likedArtIds)
          if (incrementLikes) {
            console.log(artistIdToLikedArts.get(pressedArtData.userId))
            artistIdToLikedArts.set(
              pressedArtData.userId,
              [...(artistIdToLikedArts.get(pressedArtData.userId) || []), pressedArtData.artId]
            );
          } else {
            artistIdToLikedArts.set(
              pressedArtData.userId,
              (artistIdToLikedArts.get(pressedArtData.userId) || []).filter((artId) => artId !== pressedArtData.artId)
            );
          }

          var likedArtIdsArr: string[] = []
          if (incrementLikes) {
            likedArtIdsArr = [...likesData.data[0].likedArtIds, pressedArtData.artId];
          } else {
            likedArtIdsArr = likesData.data[0].likedArtIds.filter((artId) => artId !== pressedArtData.artId);
          }
          // console.log("AFTER " + likedArtIdsArr);
          try {
            const newLikesData = {
              likeFromUserId: userName,
              artistIdToLikeCount: Object.fromEntries(artistIdToLikedArts),
              likedArtIds: likedArtIdsArr,
            };
        
            const response = await fetch('http://localhost:4000/likes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newLikesData),
            });
        
            const result = await response.json();
        
            if (response.status === 200) {
              setIsLiked(!isLiked);
              setCommentsBarOpacity(!isLiked ? 1 : 0.3);
              console.log("Artist ID to Like Count:", JSON.stringify(Object.fromEntries(artistIdToLikedArts), null, 2));
              if ((artistIdToLikedArts.get(pressedArtData.userId)?.length ?? 0) == 3) {
                recommendThisArtist = true;
              }
            } else {
              console.error('Error creating like:', result.message);
            }
          } catch (error) {
            console.error('Error creating like:', error);
          }

          const artistProfileImgAddress = artistInfo[0]?.userProfileImgAddress;
          const artistPreferenceTags = artistInfo[0]?.userPreferenceTags
          console.log("toggleLike: incrementLikes =", incrementLikes);
          console.log("toggleLike: recommendThisArtist =", recommendThisArtist);
          if (incrementLikes === true && recommendThisArtist === true && isNewRecommendArtist === true) {
            const rec_data = await updateRecommendArtistsTable();
            console.log("detail page: rec_data = ", rec_data)
            if (isNewRecommendArtist) {
              console.log("new artist -> recommend page");
              fetchArtistData();
              navigation.navigate('RecPage', {
                data: { 
                  artistId: pressedArtData.userId,
                  artistUsername: pressedArtData.userName,
                  artistProfileImgAddress: artistProfileImgAddress,
                  artistPreferenceTags: artistPreferenceTags,
                  userId: userName,
                  artId: pressedArtData.artId,
                  artisName: pressedArtData.userName,
                  artTitle: pressedArtData.artTitle,
                  artContent: pressedArtData.artContent,
                  artAddress: pressedArtData.artAddress,
                  artTags: pressedArtData.artTags,
                  width: pressedArtData.width,
                  height: pressedArtData.height
                }
              });
            }
          }
      };
    };

    return (
        <View style={{height: '95%'}}>
            {/* Back Button */}
            <Ionicons name='arrow-back' size={35} style={{ paddingLeft: 10, paddingTop: 45 }}
            onPress={() => navigation.goBack()}/>

            {/* Main Content */}
            <Text style={styles.titleText}> {pressedArtData.artTitle} </Text>
            <View style={styles.imageContainer}>
                <Image 
                    source={{uri: `http://localhost:4000/images/${pressedArtData.artAddress}` }}
                    style={{ width: pressedArtData.width, height: pressedArtData.height, margin: 10, borderRadius: 10 }}
                />
            </View>
            <View style={styles.contentContainer}>
                <Text>
                    {pressedArtData.artContent}
                </Text>
            </View>
            <View style={styles.contentContainer}>
                {tags.map((tag, index) => (
                <Text key={index} style={styles.tagsText}>
                    #{tag}
                </Text>
                ))}
            </View>

            {/* Like Button */}
            <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
              <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={30} color="white" />
              <Text style={{color: 'white'}}>Interested</Text>
            </TouchableOpacity>

            {/* Comments */}
            {isLiked ? (
              <TouchableOpacity onPress={toggleModal} activeOpacity={0.8} 
              style={[styles.commentsContainer, { opacity: commentsBarOpacity }]}>
                    <Ionicons name='chatbubble-ellipses-outline' size={30} style={{ paddingLeft: 10, paddingTop: 1.75 }}/>
                    <Text style={{ paddingLeft: 10, alignSelf: 'center'}}>
                        View Comments
                    </Text>
              </TouchableOpacity>) :
              (<View style={[styles.commentsContainer, { opacity: commentsBarOpacity }]}>
                    <Ionicons name='chatbubble-ellipses-outline' size={30} style={{ paddingLeft: 10, paddingTop: 1.75 }}/>
                    <Text style={{ paddingLeft: 10, alignSelf: 'center'}}>
                        View Comments
                    </Text>
              </View>
            )}
            <Modal isVisible={isModalVisible} animationIn="slideInUp" animationOut="slideOutDown" onBackdropPress={toggleModal}>
                <View style={styles.modalContainer}>
                  <View style={[styles.commentsContainer, {bottom: 10, width: '95%'}]}>
                      <Text style={{marginLeft: 8, marginTop: 8}}>Say Something...</Text>
                  </View>
                  <ScrollView style={{margin: 10}}>
                    <TouchableOpacity onPress={toggleModal} style={{position: 'absolute', right: 0, height:30, width:30}}>
                      <Ionicons name='close-circle' size={30}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 25}}>Comments</Text>
                    <Comments artId={pressedArtData.artId} username={userName}/>
                  </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
  everything: {
    height: '95%'
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10
  },
  titleText: {
    fontSize: 30,
    marginLeft: 20,
    paddingTop: 5,
    fontFamily: 'QuattrocentoSans-Regular',
  },
  contentContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 30
  },
  tagsText: {
    color: '#5364B7',
    fontFamily: 'QuattrocentoSans-Regular',
  },
  likeButton: {
    alignSelf:'center', 
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '10%',
    backgroundColor: '#E38F9C',
    width: 200,
    height: 50,
    borderBottomRightRadius: 25,
	  borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  commentsContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignSelf: 'center',
	  width: '85%',
	  height: 40,
    borderRadius: 25,
    borderStyle: 'solid',
    borderColor: "#5364B7",
    borderWidth: 3
  },
  modalContainer: {
    width: '100%',
    height: '55%',
    borderStyle: 'solid',
    borderColor: "#5364B7",
    borderWidth: 3,
    bottom: 0,
    position: 'absolute',
    backgroundColor: '#DCE5F7',
    borderRadius: 25
  },
  modalWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: '#252424cc',
    height: '100%',
    width: '100%'
  }
});


export default DetailPage;
