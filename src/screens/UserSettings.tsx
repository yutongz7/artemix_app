import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput, Pressable} from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal'

type UserSettingsNavigationProp = NavigationProp<RootStackParamList, 'UserSettings'>;
type UserSettingsRouteProp = RouteProp<RootStackParamList, 'UserSettings'>;

interface UserSettingProps {
    route: UserSettingsRouteProp;
  }

interface UserData {
    userId: string,
    userName: string,
    userPassword: string,
    userEmail: string,
    userPhone: number,
    userProfileImgAddress: string,
    userPreferenceTags: string[],
    tags: string[],
}

const UserSettings: React.FC<UserSettingProps> = () => {
    const navigation = useNavigation<UserSettingsNavigationProp>();
    const userName = 'nathan_j';
    const startingTags: string[] = ['Poetry', 'Photography', 'Paintings', 'Water Color', 'Drawings', 'Pencil Art'];
    const [changeMade, setChangeMade] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [tagsList, setTagsList] = useState<string []>(startingTags);
    const [userData, setUserData] = useState<UserData []>([]);
    const [searchData, setSearchData] = useState('');
    
    // fetch user data
    /*
    useEffect(() => {
        fetch(`http://localhost:4000/users?where={"userId":"${userName}"}`)
          .then((response) => response.json())
          .then((data) => {
            const userProcessing = data.data.map((user: UserData) => ({
              ...user,
              userId: user.userId,
              userName: user.userName,
              userPassword: user.userPassword,
              userEmail: user.userEmail,
              userPhone: user.userPhone,
              userProfileImgAddress: user.userProfileImgAddress,
              userPreferenceTags: user.userPreferenceTags,
              tags: user.tags,
            }));
            setUserData(userProcessing);

            console.log(userData);
            const buffer = userData[0].tags
            setTagsList(buffer);
          })
          .catch((error) => console.error('Error fetching likes:', error));
      }, []);
      */

    const handleTagRemove = (targetTag: string) => {
        const updatedTags = tagsList.filter(tag => tag !== targetTag);
        setTagsList(updatedTags);
        setChangeMade(true);
    }

    const handleSavePressed = () => {
        setShowPopup(true);
    }

    const handleNewTag = ()  => {
        const updatedTags = tagsList.concat([searchData]);
        setTagsList(updatedTags);
        setChangeMade(true);
        setSearchData('');
    }

    return (
        <View style={{flex: 1}}>
            <View style={styles.topBar}>
                <Ionicons name='arrow-back' size={35} style={{ position:'absolute', left: 10}}
                onPress={() => navigation.goBack()}/>
                <Text style={{fontSize: 30, alignSelf: 'center'}}>
                    Settings
                </Text>
            </View>
            <View style={styles.imageContainer}>
                <Image
                        source={{uri: `http://localhost:4000/images/${userName}.png`}}
                        style={styles.imageStyle}
                />
                <Text style={{marginTop: 5, fontSize: 12}}>Edit Profile Photo</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={{fontSize: 25}}>Bio Information:</Text>
                <View style={styles.textField}>
                    <Text style={{fontSize: 15}}>Name</Text>
                    <View style={styles.grayLine}>
                        <Text style={styles.textAbove}>Nathan Junipero</Text>
                    </View>
                </View>
                <View style={styles.textField}>
                    <Text style={{fontSize: 15}}>Phone</Text>
                    <View style={styles.grayLine}>
                        <Text style={styles.textAbove}>1234567899</Text>
                    </View>
                </View>
                <View style={styles.textField}>
                    <Text style={{fontSize: 15}}>Introduction</Text>
                    <View style={styles.grayLine}>
                        <Text style={styles.textAbove}>Photographer</Text>
                    </View>
                </View>
            </View>
            <View style={styles.infoContainer}>
                <Text style={{fontSize: 25}}>Account Information:</Text>
                <View style={styles.textField}>
                    <Text style={{fontSize: 15}}>Email</Text>
                    <View style={styles.grayLine}>
                        <Text style={styles.textAbove}>nathan_j_composer@aol.com</Text>
                    </View>
                </View>

                <View style={styles.textField}>
                    <Text style={{fontSize: 15}}>Password</Text>
                    <View style={styles.grayLine}>
                        <Text style={styles.textAbove}>*************</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.infoContainer, { height: 260}]}>
                <Text style={{fontSize: 25}}>Preferences:</Text>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search"
                        value={searchData}
                        onChangeText={(text) => setSearchData(text)}
                        autoCapitalize="none"
                    />
                    {searchData ? (
                        <Pressable style={styles.add} onPress={handleNewTag}>
                            <Text style={{color: 'white', fontSize: 15}}>Add</Text>
                        </Pressable>
                    ) : (
                        <View style={styles.add}>
                            <Text style={{color: 'gray', fontSize: 15}}>Add</Text>
                        </View>
                    )}
                </View>

                <ScrollView contentContainerStyle={styles.tagsScroll} horizontal={false}>
                    {tagsList.map((tag, index) => (
                        <View key={index} style={styles.tagsContainer}>
                            <View style={styles.bubble}>
                                <Text style={styles.tag}>{tag}</Text>
                            </View>
                            <TouchableOpacity style={{paddingTop: 10}} onPress={() => handleTagRemove(tag)}>
                                <Ionicons name='close' size={25} color='#A0A0A0'/>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>  
                
                {changeMade ? (
                    <TouchableOpacity 
                    style={styles.saveContainer} 
                    activeOpacity={0.7}
                    onPress={() => handleSavePressed()}>
                        <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>Save</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.saveContainer}>
                        <Text style={{color: '#D4D4D4', fontSize: 18, fontWeight: 'bold'}}>Save</Text>
                    </View>
                )}
            </View>

            <Modal 
                animationIn='pulse'
                animationOut='fadeOut'
                isVisible={showPopup}
                onBackdropPress={() => setShowPopup(false)}
                style={{alignSelf: 'center'}}
            >
                <View style={styles.popUpBox}>
                    <Text style={{fontSize: 20, color: 'white', fontWeight: 'bold'}}>Save Complete!</Text>
                    <View style={styles.popUpLine1} />
                    <View style={styles.options}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={{fontSize: 20, color: 'white', left: 4}}>To Profile</Text>
                        </TouchableOpacity>
                        <View style={styles.popUpLine2}/>
                        
                        <TouchableOpacity onPress={() => setShowPopup(false)}>
                            <Text style={{fontSize: 20, color: 'white', left: 4}}>To Settings</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>

    );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 110,
  },
  imageStyle: {
    marginTop: 15,
    width: 100,
    height: 100,
    borderRadius: 200
  },
  topBar: {
    position: 'absolute', 
    top: 75, 
    width: '100%', 
    flexDirection: 'row', 
    alignContent: 'center',
    justifyContent: 'center'
  },
  infoContainer: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    // backgroundColor: 'gray'
  },
  textField: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 7,
    width: "100%",
  },
  grayLine: {
    borderBottomWidth: 2,
    borderBottomColor: '#D4D4D4',
    width: '60%',
  },
  textAbove: {
    position: 'relative',
    paddingLeft: 2,
    fontSize: 15
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
	width: '100%',
	height: 40,
    borderRadius: 10,
    borderStyle: 'solid',
    borderColor: "#5364B7",
    borderWidth: 3,
    marginTop: 5,
    alignItems: 'center'
  },
  bubble: {
    marginTop: 10,
    borderRadius: 25,
    borderStyle: 'solid',
    borderColor: "#A0A0A0",
    borderWidth: 3,
    width: '60%',
    height: 35
  },
  tag: {
    marginLeft: 8,
    marginTop: 6,
  },
  tagsContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '50%'
  },
  tagsScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // backgroundColor: 'yellow',
    maxHeight: 250
  },
  saveContainer: {
    flexDirection: 'row',
    backgroundColor: '#5364B7',
    alignSelf: 'center',
	width: '100%',
	height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -70
  },
  popUpBox: {
    width: 230,
    height: 150,
    backgroundColor: '#5364B7',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  options: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    bottom: -40
  },
  popUpLine1: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    width: '100%',
    bottom: -30
  },
  popUpLine2: {
    borderLeftWidth: 2,
    borderLeftColor: 'white',
    height: 44,
    position: 'absolute',
    left: "50%",
    top: -10
  },
  input: {
    marginLeft: 8, 
    fontSize: 15,
  },
  add: {
    width: 40,
    height: 27,
    backgroundColor: '#5364B7',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    left: 293,
    position: 'absolute'
  }
});

export default UserSettings;