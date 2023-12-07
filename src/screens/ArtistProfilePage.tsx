import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import Calendar from "../component/Calendar";
import TimePicker from "../component/TimePicker";

type ArtistProfilePageRouteProp = RouteProp<RootStackParamList, 'ArtistProfilePage'>;
type ArtistProfilePageNavigationProp = NavigationProp<RootStackParamList, 'ArtistProfilePage'>;

interface ArtistProfilePageProps {
  route: ArtistProfilePageRouteProp;
};

const ArtistProfilePage: React.FC<ArtistProfilePageProps> = ({route}) => {
  const recData = route.params.data;
  const [likesArts, setLikesArts] = useState<Art []>([]);
  // const [likesData, setLikesData] = useState<likesData []>([]);
  const [userArt, setUserArt] = useState<Art []>([]);
  const navigation = useNavigation<ArtistProfilePageNavigationProp>();
  const [arts, setArts] = useState<Art[]>([]);
  const [curTag, setCurTag]= useState<String>("artList"); // artList / mutualPreference / schedule
  const [msgData, setMsgData] = useState<string>('');
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [dateText, setDateText] = useState<string>('');
  const [mode, setMode] = useState<string>('');
  const [curUserTags, setCurUserTags] = useState<String[]>([]);
  const [combineInterestList, setCombineInterestList] = useState<String[]>([]);
  const [requestSent, setRequestSent] = useState(false);
  
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

  interface userData {
    message: string;
    data: {
      userId: String,
      userName: String,
      userPassword: String,
      userEmail: String,
      userPhone: Number,
      userProfileImgAddress: String,
      userPreferenceTags: {type: [String], default: []},
      tags: string[],
    }[];
  };

  const handleChat = () => {
    navigation.navigate('ChatPage', {
      data: {
        userId: recData.userId,
        userName: recData.userName,
        userProfileImgAddress: recData.userProfileImgAddress,
        userPreferenceTags: recData.userPreferenceTags,
        tags: recData.userTags,
      }
    });
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

  // useEffect(() => {
  //   fetch(`http://localhost:4000/users?where={"userId":"${userName}"}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("data[0].tags = ", data[0].tags)
  //       setCurUserTags(data[0].tags);
  //     })
  //     .catch((error) => console.error('Error fetching arts:', error));
  // });

  useEffect(() => {
    const filtered = arts.filter(art => art.userId === recData.userId);
    setUserArt(filtered);
  }, [arts, recData.userId]);

  const fetchLikesData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/likes?where={"likeFromUserId":"${userName}"}`);
      const data: likesData = await response.json();
      return data.data;
    } catch(error) {
      console.error('Error fetching likes:', error);
    }
  };

  const fetchCurUserData = async() => {
    try {
      const response = await fetch(`http://localhost:4000/users?where={"userId":"${userName}"}`);
      const data: userData = await response.json();
      return data.data;
    } catch(error) {
      console.error("fetchCurUserData error: ", console.error());
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
    // console.log('Image pressed:', art);
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
  const goBack = () => {
    navigation.goBack();
  };

  const getMutualData = async() => {
    // console.log("getMutualData")
    let filteredArts: Art[] = [];
    var likesData = await fetchLikesData();
    if (!likesData) {
      console.error('Error fetching likes data in isAlreadyLiked')
    } else {
      // console.log("getMutualData: get the data");
      // console.log("likesData: ", likesData);
      // console.log("userId = ", recData.userId)
      const userLikes = likesData[0].artistIdToLikedArts;
      // console.log("userLikes = ", userLikes);
      // console.log("recData.userId = ", recData.userId)
      const newEntries = Object.entries(userLikes) as [string, string[]][];
      const newMap = new Map<string, string[]>(newEntries);
      const likesArtIds = userLikes ? newMap.get(recData.userId) : [];
      // console.log("likesArtIds = ", likesArtIds);
      filteredArts = arts.filter(art => likesArtIds?.includes(art._id));
      // console.log("filteredArts = ", filteredArts);
      setLikesArts(filteredArts);
      // console.log("likesArts = ", likesArts);
    }
  };


  // useEffect(() => {
  //   const getMutualData = async() => {
  //     // console.log("getMutualData")
  //     let filteredArts: Art[] = [];
  //     var likesData = await fetchLikesData();
  //     if (!likesData) {
  //       console.error('Error fetching likes data in isAlreadyLiked')
  //     } else {
  //       // console.log("getMutualData: get the data");
  //       // console.log("likesData: ", likesData);
  //       // console.log("userId = ", recData.userId)
  //       const userLikes = likesData[0].artistIdToLikedArts;
  //       // console.log("userLikes = ", userLikes);
  //       // console.log("recData.userId = ", recData.userId)
  //       const newEntries = Object.entries(userLikes) as [string, string[]][];
  //       const newMap = new Map<string, string[]>(newEntries);
  //       const likesArtIds = userLikes ? newMap.get(recData.userId) : [];
  //       // console.log("likesArtIds = ", likesArtIds);
  //       filteredArts = arts.filter(art => likesArtIds?.includes(art._id));
  //       // console.log("filteredArts = ", filteredArts);
  //       setLikesArts(filteredArts);
  //       // console.log("likesArts = ", likesArts);
  //     }
  //   };
    
  // });

  useEffect(() => {
    const getInterestList = async() => {
      var curUser = await fetchCurUserData();
      if (!curUser) {
        console.error("fetchCurUserData fail")
      } else {
        // console.log("curUser tags: ", curUser[0].tags);
        setCurUserTags(curUser[0].tags);
        let combineInterests = [...new Set([...recData.userTags, ...curUserTags])];
        setCombineInterestList(combineInterests);
      }
    };
    getInterestList();
  }, [userName])

  useEffect(() => {
    fetchLikesData();
  }, [curTag, recData.userId, arts]);

  const mutualPreferenceView = () => {
    if (likesArts.length === 0) {
      getMutualData();
    }
    return (
      <View>
         <View style={styles.container_combineTopic}>
          <View style={styles.container_textSubtitle}>
            <Text style={styles.textSubtitle}>Combined interests of you and the artist:</Text>
            <View style={styles.divider} />
          </View>
          <View style={styles.topicContainer}>
            {combineInterestList.map((topic, index) => (
              <Text key={index} style={styles.topicText}> #{topic} </Text>
            ))}
          </View>
        </View>
        <View style={styles.container_analysis}>
          <View style={styles.container_textSubtitle}>
            <Text style={styles.textSubtitle}>Arts you liked from the artist:</Text>
            <View style={styles.divider} />
          </View>
          <ScrollView contentContainerStyle={styles.container_mutualArt} horizontal={true}>
            {likesArts.map((item) => (
              <TouchableOpacity key={item.artAddress} onPress={() => handleImagePress(item)}>
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
        </View>
        <View style={styles.container_analysis}>
          <View style={styles.container_textSubtitle}>
            <Text style={styles.textSubtitle}>Arts the artist has liked from you:</Text>
            <View style={styles.divider} />
          </View>
          <View style={styles.textMutualArt}>
            <Text style={styles.textText} >This artist hasn't liked your art yet. </Text>
            <Text style={styles.textText} >Chat with this artist to discuss your art! 🤗</Text>
          </View>
        </View>
      </View>
    );
  };

  const handleSentMeeting = () => {
    // console.log(recData);
    setMsgData('');
    // clear the date and time selector
    setRequestSent(true);
  }

  const handleDateOpen = () => {
    setShowDateSelector(!showDateSelector);
  }

  const handleTimeOpen =() => {
    setShowTimeSelector(!showTimeSelector);
  }

  const scheduleView = () => {
    return (
      <View style={styles.container_schedule}>
        {requestSent ? (
          <View style={{marginTop: 50, alignItems: 'center'}}>
            <Text style={{fontSize: 20}}>Request Sent!</Text>
            <TouchableOpacity style={styles.edit} onPress={() => {
              setRequestSent(false);
            }}>
              <Text style={{color: 'white'}}>Edit Request</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.container_schedule}>
            <Text style={{fontSize: 23, marginTop: 45}}>
              Send Meeting Request to {recData.userName}
            </Text>
            <View style={styles.whenContainer}>
              <View style={styles.whenLabels}>
                <Text style={{color: 'white', fontSize: 17}}>Date</Text>
              </View>
              <Text style={{color: 'black', fontSize: 17, marginLeft: 5}}>{date.toDateString()}</Text>
              <TouchableOpacity style={{position: 'absolute', left: 275}} 
              onPress={() => handleDateOpen()}>
                <Ionicons name='chevron-down-circle-outline' size={23} color='#3D1C51'/>
              </TouchableOpacity>
            </View>
            <View style={styles.whenContainer}>
              <View style={styles.whenLabels}>
                  <Text style={{color: 'white', fontSize: 17}}>Time</Text>
              </View>
              <Text style={{color: 'black', fontSize: 17, marginLeft: 5}}>
                {`${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`}
                </Text>
              <TouchableOpacity style={{position: 'absolute', left: 275}} 
              onPress={() => handleTimeOpen()}>
                <Ionicons name='chevron-down-circle-outline' size={23} color='#3D1C51'/>
              </TouchableOpacity>
            </View>
            <View style={styles.message}>
              <Text style={{marginTop: 10, fontSize: 20, color: 'white'}}>Message</Text>
              <TextInput
                style={styles.input}
                placeholder="Say something..."
                value={msgData}
                onChangeText={(text) => setMsgData(text)}
                autoCapitalize="none"
                multiline={true}
              />
            </View>
            <TouchableOpacity style={styles.request} onPress={() => handleSentMeeting()}>
              <Text style={{alignSelf: 'center', marginTop: 12, color: 'white'}}>
                Send Meeting Request
              </Text>
            </TouchableOpacity>

            {showDateSelector && (
              <Modal
              isVisible={showDateSelector}
              animationIn='slideInUp'
              animationOut='slideOutDown'
              onBackdropPress={() => setShowDateSelector(false)}
              style={{alignSelf: 'center'}}
              >
              <Calendar onDatePress={(date: Date) => {
                  setDate(date);
                }}
              />
              <View>
                <TouchableOpacity style={styles.done} onPress={() => setShowDateSelector(false)}>
                  <Text style={{color: 'white'}}>Done</Text>
                </TouchableOpacity>
              </View>
            </Modal>
            )}

            {showTimeSelector && (
              <Modal
              isVisible={showTimeSelector}
              animationIn='slideInUp'
              animationOut='slideOutDown'
              onBackdropPress={() => setShowTimeSelector(false)}
              style={{alignSelf: 'center'}}
              >
                <Text>Time</Text>
                <View>
                  <TimePicker selectedTime={time} onTimeChange={(time) => setTime(time)} />
                  <TouchableOpacity style={styles.done} onPress={() => setShowTimeSelector(false)}>
                    <Text style={{color: 'white'}}>Done</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            )}

          </View>
        )}
        
      </View>
    )
  }

  useEffect(() => {
    const filtered = arts.filter(art => art.userId === recData.userId);
    setUserArt(filtered);
  }, [arts, recData.userId]);

  const renderContent = () => {
    if (curTag === "artList"){
      return artListView();
    } else if (curTag === "mutualPreference") {
      return mutualPreferenceView();
    } else if(curTag === "schedule") {
      return scheduleView();
    }
  };
  const LogoImg = () => {
    return (
      <Image source={require('../assets/logo.png')} style={{marginTop: 8, marginBottom: 8, marginRight: 15, width: 80, height: 20}}></Image>
    )
  };

  return (
      <View style={styles.container}>
        {/* BackIcon */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconView} onPress={goBack}>
            <Ionicons name='chevron-back-outline' size={35} color='#5364B7' />
          </TouchableOpacity>
          <View style={styles.textHeader}>
            <Text style={{fontFamily: 'QuattrocentoSans-Regular', fontWeight: '500', fontSize: 18}}>Artist Profile</Text>
          </View>
          <LogoImg/>
        </View>

        <View style={styles.bioInfo}>
          <Image
                  source={{uri: `http://localhost:4000/images/${recData.userId}.png`}}
                  style={styles.imageStyle}
          />
          <View style={styles.bioTop}>
            <Text style={{fontSize: 30, marginTop: 10}}>{recData.userName}</Text>
            <TouchableOpacity onPress={handleChat}>
              <Ionicons name='chatbubbles' size={30} color='#E38F9C' />
            </TouchableOpacity>
          </View>
          <Text style={{fontSize: 18, fontWeight: '300', marginTop: 5}}>{recData.userPreferenceTags.join(' | ')}</Text>
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
    marginTop: 0,
  },
  textSubtitle: {
    // color: '#E38F9C', 
    fontSize: 20,
    textAlign: 'left',
    fontWeight: '500',
  },
  divider: {
    height: 5,
    width: 400,
    marginleft: 0,
    backgroundColor: '#E38F9C',
  },
  iconView: {
    // backgroundColor: 'red', 
    width: 40,
    marginRight: 40,
    marginLeft: 8,
    left: 0,
    marginBottom: 10,
  },
  textHeader: {
    // backgroundColor: 'green',
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 22,
    marginRight: 18,
    marginTop: 9,
    marginBottom: 10,
  },
  header: {
    width: '100%',
    backgroundColor: 'white',
    // height: 90,
    paddingTop: 54,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  container_textSubtitle: {
    marginTop: 5,
    width: '100%',
    marginLeft: 20,
    // backgroundColor: 'blue'
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start', 
    alignItems: 'flex-start'
  },
  container_analysis: {
    // marginTop: 10,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    height: 300,
    // backgroundColor: 'red'
  },
  container_combineTopic: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    height: 80,
    // backgroundColor: 'red'
  },
  bioTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  topicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    // marginLeft: 20,
    width: 400,
    // backgroundColor: 'red',
  },
  topicText: {
    color: '#5364B7',
    fontSize: 15,
    fontFamily: 'QuattrocentoSans-Regular',
  },
  textText: {
    fontSize: 15,
    fontFamily: 'QuattrocentoSans-Regular',
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textMutualArt: {
    marginTop: 10,
    width: '90%',
    marginHorizontal: 60,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    // backgroundColor: 'red'
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
    // height: 600,
  },
  container_mutualArt: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 5,
    paddingTop: 5,
    justifyContent: 'center',
    // width: 600,
  },
  container_schedule: {
    // justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 500,
    // backgroundColor: 'red'
  },
  request: {
    width: '45%',
    height: '8%',
    backgroundColor: '#D7798B',
    borderRadius: 25,
    marginTop: 20
  },
  message: {
    width: '70%',
    backgroundColor: 'rgba(155, 102, 150, 0.47)',
    alignItems: 'center',
    borderRadius: 15,
    height: 250,
    marginTop: 20
  },
  input: {
    marginTop: 10,
    width: '80%',
    maxHeight: '80%',
    // backgroundColor: 'yellow'
  },
  whenContainer: {
    backgroundColor: '#D9D9D9',
    width: '70%',
    height: '6%',
    borderRadius: 7,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  whenLabels: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    backgroundColor: '#3D1C51',
    width: '20%',
    height: '100%'
  },
  calendar: {
    // backgroundColor: '#D7798B',
    alignSelf: 'center',
    minWidth: '65%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  done: {
    minWidth: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    backgroundColor: '#D7798B',
    marginTop: 15,
    borderRadius: 25,
  },
  edit: {
    marginTop: 20,
    backgroundColor: '#D7798B',
    minWidth: '25%',
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
  }
});

export default ArtistProfilePage;