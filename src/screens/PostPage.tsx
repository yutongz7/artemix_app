import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Pressable, Touchable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import { useGlobalContext } from '../../GlobalContext';

type SearchPageRouteProp = RouteProp<RootStackParamList, 'ArtistProfilePage'>;
type SearchPageNavigationProp = NavigationProp<RootStackParamList, 'ArtistProfilePage'>;

const PostPage: React.FC = () => {

  const [titleData, setTitleData] = useState<string>('')
  const [captionData, setCaptionData] = useState<string>('')
  const [tagAddData, setTagAddData] = useState<string>('')
  const [artAddress, setArtAddress] = useState<String>('');
  const { curUserId } = useGlobalContext();

  const handleNewTag = () => {
    console.log(tagAddData);
  }

  const postArtData = async () => {
    const tagList = tagAddData.split(", ").map(tag => tag.toLowerCase());
    
    try {
      const artObject = {
        userId: curUserId,
        userName: 'tester',
        artTitle: titleData,
        artContent: captionData, // caption
        artAddress: artAddress, // image path
        artTags: tagList,
        width: 500,
        height: 332,
      };
      const response_user = await fetch('http://localhost:4000/arts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artObject),
      });
      if (response_user.status !== 201){
        const responseBody = await response_user.json();
        console.error('Post art failed:', responseBody.message);
      }
    } catch(error) {
      console.log("Post art error: ", error);
    }
    
  }

  return (
    <ScrollView contentContainerStyle={{ flex: 1, marginLeft: 20, marginRight: 20}}>
      <Text style={styles.titles}>Choose Art</Text>
      <TouchableOpacity style={styles.artUpload} onPress={()=> setArtAddress('default_art.png')}>
        {artAddress ? (
          <Image 
            source={require('../assets/icons/default_art.png')}
            style={{ height: '100%', width: '100%', borderRadius: 10 }}
          />
        ) : (
          <Ionicons name="add-circle-outline" size={60} color="#5364B7"/>
        )}
      </TouchableOpacity>

      <View>
        <Text style={styles.titles}>Title: </Text>
        <View style={styles.skinnyInput}>
          <TextInput
            value={titleData}
            style={{fontSize: 15, marginLeft: 8}}
            placeholder="The title of your art"
            placeholderTextColor="rgba(0, 0, 0, 0.48)"
            autoCapitalize="none"
            onChangeText={(text) => setTitleData(text)}
          />
        </View>
      </View>

      <View>
        <Text style={styles.titles}>Additional Info: </Text>
        <View style={styles.largeInput}>
            <TextInput
              value={captionData}
              style={{fontSize: 15, marginLeft: 8, marginBottom: 5}}
              placeholder="A short description of your art"
              placeholderTextColor="rgba(0, 0, 0, 0.48)"
              autoCapitalize="none"
              onChangeText={(text) => setCaptionData(text)}
              multiline
            />
        </View>
      </View>

      <View>
        <Text style={styles.titles}>Add Tags: </Text>
        <View style={[styles.largeInput]}>
          <TextInput
              style={{fontSize: 15, marginLeft: 8, marginBottom: 2}}
              placeholder="For multiple, separate with ',' (e.g. painting, design)"
              placeholderTextColor="rgba(0, 0, 0, 0.48)"
              value={tagAddData}
              onChangeText={(text) => setTagAddData(text)}
              autoCapitalize="none"
          />
          {/* {tagAddData ? (
              <Pressable style={styles.add} onPress={handleNewTag}>
                  <Text style={{color: 'white', fontSize: 15}}>Add</Text>
              </Pressable>
          ) : (
              <View style={styles.add}>
                  <Text style={{color: 'gray', fontSize: 15}}>Add</Text>
              </View>
          )} */}
        </View>
      </View>
      <TouchableOpacity style={styles.post} onPress={postArtData}>
        <Text style={{fontSize: 20, color: 'white'}}>Post</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({ 
  titles: {
    fontSize: 20,
    fontWeight: '500',
    marginTop: 10
  }, 
  skinnyInput: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
    width: '100%',
    height: 40,
    borderRadius: 10,
    borderStyle: 'solid',
    borderColor: "#5364B7",
    borderWidth: 1,
    marginTop: 5,
    alignItems: 'center'
  },
  largeInput: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    // alignSelf: 'center',
    width: '100%',
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 10,
    borderStyle: 'solid',
    borderColor: "#5364B7",
    borderWidth: 1,
    marginTop: 5,
    alignItems: 'center'
  },
  add: {
    width: 60,
    height: 40,
    backgroundColor: '#5364B7',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    left: 327,
    position: 'absolute'
  }, 
  post: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5364B7',
    marginTop: 25,
    borderRadius: 10
  },
  artUpload: {
    marginTop: 10,
    height: 350,
    borderStyle: 'solid',
    borderColor: "#5364B7",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
  }
});
export default PostPage;