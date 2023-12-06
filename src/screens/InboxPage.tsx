import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import { useFocusEffect } from '@react-navigation/native';

const InboxPage: React.FC = () => {
  const userName = "nathan_j"; // use for now before login implemented

  const [artists, setArtists] = useState<ArtistData[]>([]);
  const [artistsMap, setArtistsMap] = useState<Map<string, string>>(new Map());
  const [artistInfo, setArtistInfo] = useState<ArtistData[]>([]);
  const [inboxArtists, setInboxArtists] = useState<ArtistData[]>([]);
  const [pendingArtists, setPendingArtists] = useState<ArtistData[]>([]);
  const [checkFetchRecommendArtist, setCheckFetchRecommendArtist] = useState(false);
  
  type InboxPageNavigationProp = NavigationProp<RootStackParamList, 'InboxPage'>;
  const navigation = useNavigation<InboxPageNavigationProp>();

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

  const handleChat = () => {
    navigation.navigate('ChatPage');
  };

  const handleArtistsProfile = (artist: ArtistData) => {
    navigation.navigate('ArtistProfilePage', {
      data: {
        userId: artist.userId,
        userName: artist.userName,
        userProfileImgAddress: artist.userProfileImgAddress,
        userPreferenceTags: artist.userPreferenceTags,
      }
    });
  };


  interface recommendArtistData {
    message: string;
    data: {
      _id: string;
      userId: String;
      recommendArtistIds: Map<string, string>;
    }[];
  };

  const fetchArtistData = async (userId : string, status: any) => {
    // console.log("fetchArtistData: userId = ", userId);
    try {
      const response = await fetch(`http://localhost:4000/users?where={"userId":"${userId}"}`);
      const data = await response.json();
      // console.log("chat fetchArtistData: ", data.data[0]);
      // if (status === 'notChat') {
      //   setPendingArtists(prevPendingList => ([...prevPendingList, ...data.data[0]]))
      // } else if (status === 'chat') {
      //   setInboxArtists(prevInboxList => ([...prevInboxList, ...data.data[0]]))
      // }
      // console.log("Data after udpate: pendingArtists = ", pendingArtists);
      // console.log("Data after udpate: inboxArtists = ", inboxArtists);
      return data;
    } catch (error) {
      console.error('Error fetching arts:', error);
    }
  };

  const fetchRecommendArtist = async () => {
    // console.log("fetchRecommendArtist");
    try {
      const response = await fetch(`http://localhost:4000/recommendArtists?where={"userId":"${userName}"}`);
      const data: recommendArtistData = await response.json();
      const value = data.data[0].recommendArtistIds;
      const newEntries = Object.entries(value) as [string, string][];
      const newMap = new Map<string, string>(newEntries);
      // console.log("raw data: ", data)
      // console.log("newMap: ", newMap);
      setArtistsMap(newMap);
      setCheckFetchRecommendArtist(true);
      return newMap;
    } catch (error) {
      console.error('Error fetching recommendArtists: ', error);
    }
  };

  const getArtistData = async () => {
    // const recData = await fetchRecommendArtist();
    // const keys = Object.keys(artistsMap);
    const keys = Array.from(artistsMap.keys());
    // console.log("recData: ", recData);
    // console.log("keys = ", Array.from(artistsMap.keys()));

    // keys.map(userId => {
    //   console.log("current userId = ", userId);
    //   const status = artistsMap.get(userId);
    //   const artistData = fetchArtistData(userId, status);
    //   console.log("artistData = ", artistData)
    // })

    let pendingList: ArtistData[] = [];
    let inboxList: ArtistData[] = [];

    for (const userId of keys) {
      // console.log("chat userId = ", userId)
      const status = artistsMap.get(userId);
      // console.log("artistsMap: status = ", status)
      const artistData = await fetchArtistData(userId, status);
      // console.log("artistData = ", artistData.data[0])
      if (status === 'notChat') {
        pendingList.push(artistData.data[0])
      } else {
        inboxArtists.push(artistData.data[0]);
      }
    }
    setPendingArtists(pendingList);
    // console.log("pendingList = ", pendingList)
    // console.log("pendingArtists = ", pendingArtists);
    setInboxArtists(inboxList);
  }

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchRecommendArtist();
  //     getArtistData();
  //     setCheckFetchRecommendArtist(false);
  //   }, [])
  // );
  // fetchRecommendArtist();
  // getArtistData();
  useEffect(() => {
    fetchRecommendArtist();
    getArtistData();
    // console.log("pendingArtists = ", pendingArtists);
  }, [artistsMap])

  return (
    <View style={styles.overallStructure}>
      <View style={styles.inboxContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Continue the conversation：</Text>
          <View style={styles.divider} />
        </View>
        <ScrollView contentContainerStyle={styles.chatContainer} horizontal={false}>
          {inboxArtists?.map((item) => (
            <TouchableOpacity key={item._id} onPress={() => handleChat()}>
              <Image
                source={{uri: `http://localhost:4000/images/${item.userProfileImgAddress}`}}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.pendingContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Start a new conversation：</Text>
          <View style={styles.divider} />
        </View>
        <ScrollView contentContainerStyle={styles.chatContainer} horizontal={false}>
          {pendingArtists?.map((item) => (
            <TouchableOpacity key={item._id} onPress={() => handleChat()}>
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
                  <Text style={styles.textText}>Still interested? Send a message!</Text>
                </View>
              </View>
              <View style={styles.chatDivider} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* <Text>Inbox Page Content Goes Here</Text>
      <TouchableOpacity onPress={() => handleChat()}>
        <View style={styles.imageStyle}>
          <Image
              source={{uri: `http://localhost:4000/images/${userName}.png`}}
              style={styles.imageStyle}
            />
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  overallStructure: {
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center'
  },
  imgStyle: {
    width: 70,
    height: 70,
    borderRadius: 200
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
  imageStyle: {
    width: 80,
    height:80,
  },
  divider: {
    height: 5,
    width: 360,
    marginleft: 0,
    backgroundColor: '#E38F9C',
  },
  chatDivider: {
    height: 1,
    width: 360,
    marginleft: 15,
    backgroundColor: '#FCC6CF',
  },
  titleContainer: {
    marginLeft: 0,
    paddingTop: 5,
  },
  titleText: {
    fontSize: 25,
    fontWeight: "500",
    fontFamily: 'QuattrocentoSans-Italic',
    color: '#33363F',
  },
  chatContainer: {
    flexWrap: 'wrap',
    paddingLeft: 10,
    marginVertical: 10,
    justifyContent: 'flex-start',
    // backgroundColor: 'red',
  },
  inboxContainer: {
    height: 300,
  },
  pendingContainer: {
   height: 500,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '600',
  },
  tagsText: {
    fontSize: 12,
    fontWeight: '200',
  },
  textText: {
    fontSize: 13,
    color: '#7E397C'
  }
});

export default InboxPage;