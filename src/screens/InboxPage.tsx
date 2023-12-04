import React, { useEffect, useState } from 'react';
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
  const [penddingArtists, setPenddingArtists] = useState<ArtistData[]>([]);
  
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

  const handleChat = (artist: ArtistData) => {
    navigation.navigate('ChatPage');
  };

  interface recommendArtistData {
    message: string;
    data: {
      _id: string;
      userId: String;
      recommendArtistIds: Map<string, string>;
    }[];
  };

  // const fetchRecommendArtist = async () => {
  //   console.log("fetchRecommendArtist");
  //   try {
  //     const response = await fetch(`http://localhost:4000/recommendArtists?where={"userId":"${userName}"}`);
  //     const data: recommendArtistData = await response.json();
  //     console.log("chat recommendArtistData: ", data.data[0].recommendArtistIds)
  //     return data;
  //   } catch (error) {
  //     console.error('Error fetching recommendArtists: ', error);
  //   }
  // };

  // interface ArtistData {
  //   userId: string;
  //   userProfileImgAddress: string;
  //   userPreferenceTags: string[];
  // };

  const fetchArtistData = async (userId : string, status: any) => {
    console.log("fetchArtistData: userId = ", userId);
    try {
      const response = await fetch(`http://localhost:4000/users?where={"userId":"${userId}"}`);
      const data = await response.json();
      console.log("chat fetchArtistData: ", data.data[0]);
      if (status === 'notChat') {
        setPenddingArtists(prevPenddingList => ([...prevPenddingList, ...data.data[0]]))
      } else if (status === 'chat') {
        setInboxArtists(prevInboxList => ([...prevInboxList, ...data.data[0]]))
      }
      console.log("Data after udpate: penddingArtists = ", penddingArtists);
      console.log("Data after udpate: inboxArtists = ", inboxArtists);
      return data.data[0];
    } catch (error) {
      console.error('Error fetching arts:', error);
    }
  };


  // useEffect(() => {
  //   if (artistId) {
  //     console.log("useEffect: artistId = ", artistId)
  //     fetchArtistData();
  //   }
  // }, []);

  // const get_data = async () => {
  //   let inbox_artists = [];
  //   let pending_artists = [];

  //   if (!artistsMap) {
  //     console.error('Error fetching recommendArtist data in updateRecommendArtistsTable')
  //   } else {
  //     const keys = Object.keys(artistsMap);
  //     for (const userId of keys) {
  //       console.log("chat userId = ", userId)
  //       setArtistId(userId);
  //       console.log("chat after setArtistId = ", artistId)

  //       let status;
  //       if (artistsMap instanceof Map) {
  //         status = artistsMap.get(userId);
  //       } else {
  //         status = artistsMap[userId];
  //       }
        
  //       console.log("get data: status = ", status)
  //       if (status === 'notChat') {
  //         if (artistInfo) {
  //           pending_artists.push(artistInfo);
  //         } else {
  //           pending_artists.push(artistInfoData);
  //         }
  //       } else if (status === 'chat') {
  //         if (artistInfo) {
  //           inbox_artists.push(artistInfo);
  //         } else {
  //           inbox_artists.push(artistInfoData);
  //         }
  //       }
  //       console.log("status: ", status)
  //     }
  //     console.log("inbox_artists: ", inbox_artists);
  //     console.log("pending_artists: ", pending_artists);
  //     setInboxArtists(inbox_artists[0]);
  //     setPenddingArtists(pending_artists[0]);
  //     // console.log("userProfileImgAddress: ", penddingArtists[0].userProfileImgAddress)
  //   }
  // };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     get_data();
  //   }, [])
  // );

  useEffect(() => {
    // fetch the recommend user list
    fetch(`http://localhost:4000/recommendArtists?where={"userId":"${userName}"}`)
      .then((response) => response.json())
      .then((data) => {
        setArtistsMap(data.data[0].recommendArtistIds);
        console.log("inbox page: data = ", data)
        console.log("inbox page: artists = ", artistsMap)
      })
      .catch((error) => console.error("Error fetching recommendArtists Ids: ", error))
  }, [])
  
  useEffect(() => {
    if (!artistsMap) {
      console.error('Error fetching recommendArtist data in updateRecommendArtistsTable')
    } else {
      const keys = Object.keys(artistsMap);
      for (const userId of keys) {
        console.log("chat userId = ", userId)
        const status = artistsMap.get(userId);
        const artistInfoData = fetchArtistData(userId, status);
      }
      // console.log("inbox_artists: ", inbox_artists);
      // console.log("pending_artists: ", pending_artists);
      // setInboxArtists(inbox_artists[0]);
      // setPenddingArtists(pending_artists[0]);
      // console.log("userProfileImgAddress: ", penddingArtists[0].userProfileImgAddress)
    }
  }, [artistsMap])

  return (
    <View style={styles.overallStructure}>
      <View style={styles.inboxContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Inbox</Text>
          <View style={styles.divider} />
        </View>
        <ScrollView contentContainerStyle={styles.chatContainer} horizontal={false}>
          {inboxArtists?.map((item) => (
            <TouchableOpacity key={item._id} onPress={() => handleChat(item)}>
              <Image
                source={{uri: `http://localhost:4000/images/${item.userProfileImgAddress}`}}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.inboxContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Pendding</Text>
          <View style={styles.divider} />
        </View>
        <ScrollView contentContainerStyle={styles.chatContainer} horizontal={false}>
          {penddingArtists?.map((item) => (
            <TouchableOpacity key={item._id} onPress={() => handleChat(item)}>
              <View style={styles.itemContainer}>
                <Image
                  source={{uri: `http://localhost:4000/images/${item.userProfileImgAddress}`}}
                  style={{ width: 60, height: 60 }}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.nameText}>{item.userName}</Text>
                  <Text style={styles.tagsText}>{item.userPreferenceTags?.join(' | ')}</Text>
                  <Text style={styles.textText}>Still interested? Send a message!</Text>
                </View>
              </View>
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
  itemContainer: {
    flex: 1, 
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 30,
    height: 100,
    width: 350,
    // backgroundColor: 'red'
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
    marginleft: 15,
    backgroundColor: '#E38F9C',
  },
  titleContainer: {
    marginLeft: 15,
    paddingTop: 5,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "500",
    fontFamily: 'QuattrocentoSans-Italic',
    color: '#33363F',
  },
  chatContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    maxHeight: 200,
  },
  inboxContainer: {
    height: 200,
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