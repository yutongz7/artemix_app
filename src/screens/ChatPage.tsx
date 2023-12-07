import React, { useState } from 'react';
import { Image, View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';

type ChatPageRouteProp = RouteProp<RootStackParamList, 'ChatPage'>;
type ChatPageNavigationProp = NavigationProp<RootStackParamList, 'ChatPage'>;

interface ChatPageProps {
  route: ChatPageRouteProp;
}

const ChatPage: React.FC<ChatPageProps> = ({route}) => {
  const navigation = useNavigation<ChatPageNavigationProp>();
  const artistProfileImgAddress = route.params.data.userProfileImgAddress;
  const artistName = route.params.data.userName;
  const artistTags = route.params.data.userPreferenceTags;
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { content: 'Hello!', isCurrentUser: false },
    { content: 'Love your profile. How do you compose your pictures?', isCurrentUser: false },
  ]);

  const renderMessage = (content: string, isCurrentUser: boolean) => {
    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
        <Text>{content}</Text>
      </View>
    );
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setChatMessages([...chatMessages, { content: message, isCurrentUser: true }]);
      setMessage('');
      // TODO: Add logic for sending the message to the other person
    }
    updateRecData();
  };


  const updateRecData = async () => {
    const artistId = route.params.data.userId;
    const currUser = "nathan_j";
    interface recommendArtistData {
      message: string;
      data: {
        _id: string;
        userId: String;
        recommendArtistIds: Map<string, string>;
      }[];
    };

    try {
      const response = await fetch(`http://localhost:4000/recommendArtists?where={"userId":"${currUser}"}`);
      const data: recommendArtistData = await response.json();

      if (data.data.length > 0) {
        const currentRecommendations = new Map(Object.entries(data.data[0].recommendArtistIds));
        console.log(currentRecommendations);
        currentRecommendations.set(artistId, 'chat');
        console.log(currentRecommendations);

        const newRecData = {
          userId: currUser,
          recommendArtistIds: Object.fromEntries(currentRecommendations),
        };

        await fetch(`http://localhost:4000/recommendArtists/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRecData),
        });
      } else {
        console.log("No data found for the user.");
      }
    } catch (error) {
      console.error('Error updating rec data:', error);
    }
  };

  const handleProfileClick = () => {
    console.log(route.params.data.userName);
    navigation.navigate('ArtistProfilePage', {
      data: {
        userId: route.params.data.userId,
        userName: route.params.data.userName,
        userProfileImgAddress: route.params.data.userProfileImgAddress,
        userPreferenceTags: route.params.data.userPreferenceTags,
        userTags: route.params.data.tags
      }
    })
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* BackIcon */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconView} onPress={goBack}>
          <Ionicons name='chevron-back-circle-outline' size={35} color='#5364B7' />
        </TouchableOpacity>
        <View style={styles.textHeader}>
          <Text style={{fontFamily: 'QuattrocentoSans-Regular', fontWeight: '500', fontSize: 18}}>Direct Message</Text>
        </View>
      </View>
      <View style={styles.headerChat}>
      {/* <Ionicons name='arrow-back' size={35} style={{ paddingLeft: 10, paddingTop: 0 }}
            onPress={() => navigation.goBack()}/> */}
        <TouchableOpacity style={{marginLeft: 40}} onPress={() => handleProfileClick()}>
          <Image source={{ uri: `http://localhost:4000/images/${artistProfileImgAddress}` }} style={{ width: 70, height: 70, borderRadius: 200 }} />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{artistName}</Text>
          <Text style={styles.userTags}>{artistTags.join(', ')}</Text>
        </View>
        <View style={styles.headerRightContainer}>
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="calendar-outline" size={30} color="#3D1C51"/>
        </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.meetingButton}>Request Meeting</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.thinBar} />
      {/* Chat messages */}
      <ScrollView style={styles.messagesContainer}>
        {chatMessages.map((msg, index) => (
          <View key={index}>{renderMessage(msg.content, msg.isCurrentUser)}</View>
        ))}
      </ScrollView>
      {/* Input bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          placeholderTextColor="#646464"
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send-outline" size={29} color="#3D1C51" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 50,
  },
  headerChat: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  thinBar: {
    height: 1,
    backgroundColor: '#E38F9C',
    width: 350,
    alignSelf: 'center',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
  },
  iconView: {
    // backgroundColor: 'red', 
    width: 40,
    marginRight: 35,
    marginLeft: 13,
    left: 0,
    marginBottom: 10,
  },
  textHeader: {
    // backgroundColor: 'green',
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 100,
    marginBottom: 10,
  },
  messageContainer: {
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
  },
  currentUserMessage: {
    backgroundColor: 'rgba(126, 57, 124, 0.76)',
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    backgroundColor: '#D9D9D9',
    alignSelf: 'flex-start',
    maxWidth: 250,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 50,
  },
  input: {
    flex: 1,
    height: 30,
    backgroundColor: 'rgba(61, 28, 81, 0.28)',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: '#3D1C51',
    borderWidth: 1,
  },
  sendButton: {
    marginLeft: 10,
  },
  userInfo: {

  }, 
  headerRightContainer: {
    alignItems: 'center',
    marginRight: 45,
  }, 
  userName: {
    fontSize: 30,
    alignSelf: 'center',
  },
  userTags: {
    fontSize: 13,
    marginTop: 5,
  },
  meetingButton: {
    fontSize: 10,
    fontWeight: 'bold',
    color: "#5364B7",
    marginTop: 10,
    width: 45,
    marginLeft: 10,
  },
});

export default ChatPage;

