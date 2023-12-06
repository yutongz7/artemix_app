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
  const artistTags = route.params.data.tags;
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Ionicons name='arrow-back' size={35} style={{ paddingLeft: 10, paddingTop: 0 }}
            onPress={() => navigation.goBack()}/>
        <View>
          <Image source={{ uri: `http://localhost:4000/images/${artistProfileImgAddress}` }} style={{ width: 70, height: 70, borderRadius: 200 }} />
        </View>
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
  thinBar: {
    height: 1,
    backgroundColor: '#000000',
    width: 320,
    alignSelf: 'center',
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
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

