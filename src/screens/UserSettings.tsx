import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput, Pressable} from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal'
import { useGlobalContext } from '../../GlobalContext';

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
    const startingTags: string[] = ['Poetry', 'Photography', 'Paintings', 'Water Color', 'Drawings', 'Pencil Art'];
    const [changeMade, setChangeMade] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [tagsList, setTagsList] = useState<string []>(startingTags);
    const [userData, setUserData] = useState<UserData []>([]);
    const [searchData, setSearchData] = useState('');
    const { curUserId } = useGlobalContext();
    const [profilePhoto, setProfilePhoto] = useState(false);
    const [curUserName, setCurName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [curPhone, setCurPhone] = useState('');
    const [curIntroduction, setCurIntroduction] = useState('');
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
    
    // fetch user data
    useEffect(() => {
        fetch(`http://localhost:4000/users?where={"userId":"${curUserId}"}`)
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
    };

    const handleLogout = () => {
      navigation.navigate('LoginPage');
    };

    const goBack = () => {
      navigation.goBack();
    };
    const handleUploadPhoto = () => {
      setProfilePhoto(true);
    };
    const LogoImg = () => {
      return (
        <Image source={require('../assets/logo.png')} style={{marginTop: 8, marginBottom: 8, marginRight: 15, width: 80, height: 20}}></Image>
      )
    };
    const handlePreferenceSelect = (preference: string) => {
      const isSelected = selectedPreferences.includes(preference);
      const updatedPreferences = isSelected
        ? selectedPreferences.filter((selected) => selected !== preference)
        : [...selectedPreferences, preference];
  
      setSelectedPreferences(updatedPreferences);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.iconView} onPress={goBack}>
                <Ionicons name='chevron-back-outline' size={35} color='#5364B7' />
              </TouchableOpacity>
              <View style={styles.textHeader}>
                <Text style={{fontWeight: '500', fontSize: 18}}>Edit Profile</Text>
              </View>
              <LogoImg/>
            </View>

            {/* Scrollable */}
            <ScrollView contentContainerStyle={styles.containerScrollView}>
              <TouchableOpacity style={styles.profilePictureContainer} onPress={handleUploadPhoto}>
                <Image 
                  style={{height: 90, width: 90, borderRadius: 50}} 
                  source={{uri: `http://localhost:4000/images/${userData[0]?.userProfileImgAddress}`}}
                />
                <Text style={styles.uploadPhotoText}>Upload Photo</Text>
                {profilePhoto === true ? <Text style={{color: 'red', top: 15}}>New photo uploaded (hard-coded)</Text> : null}
              </TouchableOpacity>
              <View style={styles.infoContainer}>
                  <Text style={{fontSize: 25}}>Bio Information:</Text>
                  <View style={styles.textField}>
                      <Text style={{fontSize: 15}}>Name: firstName LastName</Text>
                      <View>
                          <TextInput
                            style={styles.input}
                            placeholder={userData[0]?.userName}
                            placeholderTextColor="rgba(0, 0, 0, 0.48)"
                            onChangeText={(text) => setCurName(text)}
                            autoCapitalize="none"
                          />
                      </View>
                  </View>
                  <View style={styles.textField}>
                      <Text style={{fontSize: 15}}>Phone:</Text>
                      <View>
                          <TextInput
                            style={styles.input}
                            placeholder={userData[0]?.userPhone?.toString()}
                            placeholderTextColor="rgba(0, 0, 0, 0.48)"
                            onChangeText={(text) => setCurName(text)}
                            autoCapitalize="none"
                          />
                      </View>
                  </View>
                  <View style={styles.textField}>
                      <Text style={{fontSize: 15}}>Introduction:</Text>
                      <View>
                          <TextInput
                            style={styles.input}
                            placeholder={userData[0]?.userPreferenceTags.join(', ')}
                            placeholderTextColor="rgba(0, 0, 0, 0.48)"
                            onChangeText={(text) => setCurName(text)}
                            autoCapitalize="none"
                          />
                      </View>
                  </View>
              </View>
              <View style={styles.infoContainer}>
                  <Text style={{fontSize: 25}}>Account Information:</Text>
                  <View style={styles.textField}>
                      <Text style={{fontSize: 15}}>Email: example@outlook.com</Text>
                      <View>
                          <TextInput
                            style={styles.input}
                            placeholder={userData[0]?.userEmail}
                            placeholderTextColor="rgba(0, 0, 0, 0.48)"
                            onChangeText={(text) => setCurName(text)}
                            autoCapitalize="none"
                          />
                      </View>
                  </View>
                  {/* <View style={styles.textField}>
                      <Text style={{fontSize: 15}}>Old Password</Text>
                      <View>
                          <TextInput
                            style={styles.input}
                            placeholderTextColor="rgba(0, 0, 0, 0.48)"
                            onChangeText={(text) => setCurName(text)}
                            autoCapitalize="none"
                          />
                      </View>
                  </View> */}
                  <View style={styles.textField}>
                      <Text style={{fontSize: 15}}>New Password</Text>
                      <View>
                          <TextInput
                            style={styles.input}
                            placeholderTextColor="rgba(0, 0, 0, 0.48)"
                            onChangeText={(text) => setCurName(text)}
                            autoCapitalize="none"
                          />
                      </View>
                  </View>
                  <View style={styles.textField}>
                      <Text style={{fontSize: 15}}>Comfirm New Password</Text>
                      <View>
                          <TextInput
                            style={styles.input}
                            placeholderTextColor="rgba(0, 0, 0, 0.48)"
                            onChangeText={(text) => setCurName(text)}
                            autoCapitalize="none"
                          />
                      </View>
                  </View>

              </View>
              <View style={[styles.infoContainer, { height: 260}]}>
                  <Text style={{fontSize: 25}}>Preferences:</Text>
                  <View style={styles.searchPreferencesContainer}>
                    <Pressable
                        style={[
                        styles.input,
                        { alignItems: 'flex-start' },
                        selectedPreferences.length > 0 && styles.selectedPreferencesContainer,
                      ]}
                      onPress={() => setModalVisible(true)}>
                      <Text
                        style={[
                          styles.selectedPreferencesText,
                          {
                            color:
                              selectedPreferences.length > 0
                                ? styles.selectedPreferencesText.color
                                : 'rgba(0, 0, 0, 0.48)',
                            fontStyle:
                              selectedPreferences.length > 0
                                ? styles.selectedPreferencesText.fontStyle
                                : 'italic',
                            marginTop: 7,
                          },
                        ]}>
                        {selectedPreferences.length > 0
                          ? selectedPreferences.join(', ')
                          : 'Select Preferences'}
                      </Text>
                    </Pressable>
                    {modalVisible && (
                      <View style={styles.preferenceButtonsContainer}>
                        <TouchableOpacity
                          style={[
                            styles.preferenceButton,
                            selectedPreferences.includes('poetry') && styles.selectedPreferenceButton,
                          ]}
                          onPress={() => handlePreferenceSelect('poetry')}>
                          <Text style={styles.preferenceButtonText}>poetry</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.preferenceButton,
                            selectedPreferences.includes('photography') && styles.selectedPreferenceButton,
                          ]}
                          onPress={() => handlePreferenceSelect('photography')}>
                          <Text style={styles.preferenceButtonText}>photography</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.preferenceButton,
                            selectedPreferences.includes('paintings') && styles.selectedPreferenceButton,
                          ]}
                          onPress={() => handlePreferenceSelect('paintings')}>
                          <Text style={styles.preferenceButtonText}>paintings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.preferenceButton,
                            selectedPreferences.includes('water color') && styles.selectedPreferenceButton,
                          ]}
                          onPress={() => handlePreferenceSelect('water color')}>
                          <Text style={styles.preferenceButtonText}>water color</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.preferenceButton,
                            selectedPreferences.includes('drawings') && styles.selectedPreferenceButton,
                          ]}
                          onPress={() => handlePreferenceSelect('drawings')}>
                          <Text style={styles.preferenceButtonText}>drawings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.preferenceButton,
                            selectedPreferences.includes('pencil art') && styles.selectedPreferenceButton,
                          ]}
                          onPress={() => handlePreferenceSelect('pencil art')}>
                          <Text style={styles.preferenceButtonText}>pencil art</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.preferenceButton,
                            selectedPreferences.includes('writing') && styles.selectedPreferenceButton,
                          ]}
                          onPress={() => handlePreferenceSelect('writing')}>
                          <Text style={styles.preferenceButtonText}>writing</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.preferenceButton,
                            selectedPreferences.includes('music') && styles.selectedPreferenceButton,
                          ]}
                          onPress={() => handlePreferenceSelect('design')}>
                          <Text style={styles.preferenceButtonText}>design</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
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
              <View style={styles.buttoms}>
                <TouchableOpacity 
                  style={styles.saveContainer} 
                  activeOpacity={0.7}
                  onPress={() => handleSavePressed()}>
                      <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>Save</Text>
                  </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                  <View style={styles.logOutContainer}>
                      <Text style={{color: '#5364B7', fontSize: 18, fontWeight: 'bold'}}>Log out</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start', 
    alignItems: 'flex-start'
  },
  imageContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 110,
  },
  containerScrollView: {
    width: 430,
    flexDirection: 'column',
    flexWrap: 'wrap',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  iconView: {
    width: 40,
    marginRight: 40,
    marginLeft: 8,
    left: 0,
    marginTop: 10,
    zIndex: 1,
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
  selectedPreferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    color: '#000000',
    fontStyle: 'normal',
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
  profilePictureContainer: {
    alignItems: 'center',
    top: 10,
    // backgroundColor: 'red',
    width: '100%'
  },
  searchPreferencesContainer: {
    marginBottom: 10,
  },
  imageStyle: {
    marginTop: 15,
    width: 100,
    height: 100,
    borderRadius: 200
  },
  selectedPreferencesText: {
    color: '#000000',
    fontStyle: 'normal',
  },
  input: {
    borderWidth: 1,
    borderColor: '#5364B7',
    borderRadius: 10,
    height: 33,
    fontSize: 15,
    fontStyle: 'italic',
    paddingLeft: 10,
    marginBottom: 17,
    backgroundColor: 'rgba(234, 233, 233, 0.38)'
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
    marginBottom: 0,
    // backgroundColor: 'gray'
  },
  textField: {
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    marginTop: 7,
    marginBottom: -17,
    width: "100%",
  },
  preferenceButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: -10,
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
    // alignSelf: 'center',
    width: '83%',
    height: 40,
    borderRadius: 10,
    borderStyle: 'solid',
    borderColor: "#5364B7",
    borderWidth: 1,
    marginTop: 5,
    alignItems: 'center'
  },
  uploadPhotoText: {
    color: '#5364B7',
    fontSize: 12,
    marginTop: 5,
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
  selectedPreferenceButton: {
    backgroundColor: '#5364B7',
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
    bottom: -10,
    zIndex: 1
  },
  preferenceButton: {
    backgroundColor: '#999898',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  logOutContainer: {
    flexDirection: 'row',
    // backgroundColor: 'white',
    alignSelf: 'center',
    width: '100%',
    height: 40,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#5364B7',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -60,
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
  preferenceButtonText: {
    color: 'white',
  },
  add: {
    width: 60,
    height: 40,
    backgroundColor: '#5364B7',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    left: 293,
    position: 'absolute'
  }
});

export default UserSettings;