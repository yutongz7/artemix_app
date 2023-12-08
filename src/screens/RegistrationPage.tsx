import React, { useState } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Modal } from 'react-native';
import { RouteProp, useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGlobalContext } from '../../GlobalContext';

type RegistrationPageRouteProp = RouteProp<RootStackParamList, 'RegistrationPage'>;
type RegistrationPageNavigationProp = NavigationProp<RootStackParamList, 'RegistrationPage'>;

const RegistrationPage = () => {
  const navigation = useNavigation<RegistrationPageNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userId, setUserId] = useState('');
  const [phone, setPhone] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [tags, setTags] =  useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(false);
  const { setCurUserId } = useGlobalContext();

  const goBack = () => {
    navigation.navigate('LoginPage');
    console.log('go back')
  };

  const handleNextPress = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const checkEmail = emailRegex.test(email);
    const checkPassword = (password === confirmPassword);
    const phoneRegex = /^\(\+\d-\)\d{3}-\d{3}-\d{4}$/;
    const checkPhone = phoneRegex.test(phone);

    if (!checkEmail || !checkPassword || !checkPhone) {
      if (!checkEmail) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
      if (!checkPassword) {
        setPasswordError(true);
      } else {
        setPasswordError(false);
      }
      if (!checkPhone) {
        setPhoneError(true);
      } else {
        setPhoneError(false);
      }
    } else {
      const userPhone = parseInt(phone.replace(/-/g, ''))
      const userPreferenceTagsList = tags.split(", ");
      const imgAddress = profilePhoto ? '../assets/icons/profile_photo.png' : ''
      try {
        const userObject = {
          userId: userId,
          userName: `${firstName} ${lastName}`,
          userPassword: password,
          userEmail: email,
          userPhone: userPhone,
          userProfileImgAddress: imgAddress,
          userPreferenceTags: userPreferenceTagsList,
          tags: selectedPreferences,
        };

        const response = await fetch('http://localhost:4000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userObject),
        });

        if (response.status === 201 || 200) {
          navigation.navigate('Home', {showOnboarding: true});
        } else {
          const responseBody = await response.json();
          console.error('Registration failed:', responseBody.message);
        }
        setCurUserId(userId);
      } catch (error) {
        console.error('Error during registration:', error);
      }
    }
  };

  const handlePreferenceSelect = (preference: string) => {
    const isSelected = selectedPreferences.includes(preference);
    const updatedPreferences = isSelected
      ? selectedPreferences.filter((selected) => selected !== preference)
      : [...selectedPreferences, preference];

    setSelectedPreferences(updatedPreferences);
  };

  const handleUploadPhoto = () => {
    setProfilePhoto(true);
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconView} onPress={goBack}>
        <Ionicons name='chevron-back-outline' size={35} color='#5364B7'/>
      </TouchableOpacity>
      <Image style={{ alignSelf: 'center', height: 75, width: 260 }} source={require('../assets/logo.png')}></Image>
      <TouchableOpacity style={styles.profilePictureContainer} onPress={handleUploadPhoto}>
        <Image style={{height: 90, width: 90, borderRadius: 50}} source={profilePhoto ? require('../assets/icons/profile_photo.png') : require('../assets/icons/blank_profile.png')}></Image>
        <Text style={styles.uploadPhotoText}>Upload Photo</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Email: example@email.com"
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
      />
      {emailError && (
        <Text style={styles.emailErrorText}>
          ↑ Enter a valid email address, like example@email.com.
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        autoCapitalize="none"
      />
      {passwordError && (
        <Text style={styles.passwordErrorText}>
          ↑ Passwords do not match. Please re-enter to confirm.
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="User ID"
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
        value={userId}
        onChangeText={(text) => setUserId(text)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone (+X-)XXX-XXX-XXXX"
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
      {phoneError && (
        <Text style={styles.phoneErrorText}>
          ↑ Enter phone number as (+X-)XXX-XXX-XXXX.
        </Text>
      )}
      <TextInput
        style={styles.artistInput}
        placeholder="Type of artist? For multiple, separate with ',' (e.g., photographer, writer)."
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
        value={tags}
        onChangeText={(text) => setTags(text)}
        autoCapitalize="none"
        multiline={true}
      />

      <Text style={styles.preferencesTitle}>Preferences</Text>
      <Text style={styles.preferencesSubtitle}>
        Add the types of art you'd like to see. These can always be changed later.
      </Text>
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

      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  emailErrorText: {
    position: 'absolute',
    color: 'red',
    zIndex: 1,
    fontSize: 15,
    left: 24,
    top: 290,
  },
  passwordErrorText: {
    position: 'absolute',
    color: 'red',
    zIndex: 1,
    fontSize: 15,
    left: 20,
    top: 391,
  },
  phoneErrorText: {
    position: 'absolute',
    color: 'red',
    zIndex: 1,
    fontSize: 15,
    left: 20,
    top: 590,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadPhotoText: {
    color: '#5364B7',
    fontSize: 12,
    marginTop: 10,
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
  artistInput: {
    borderWidth: 1,
    borderColor: '#5364B7',
    borderRadius: 10,
    height: 55,
    fontSize: 15,
    fontStyle: 'italic',
    paddingLeft: 10,
    marginBottom: 17,
    backgroundColor: 'rgba(234, 233, 233, 0.38)'
  },
  preferencesTitle: {
    alignSelf:'center',
    fontSize: 20,
    color: '#000000',
    marginBottom: 5,
    marginTop: -10,
  },
  preferencesSubtitle: {
    fontSize: 15,
    color: '#A0A0A0',
    marginBottom: 5,
  },
  nextButton: {
    backgroundColor: '#5364B7',
    borderRadius: 10,
    width: 150,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 20,
  },
  searchPreferencesContainer: {
    marginBottom: 10,
  },
  selectedPreferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    color: '#000000',
    fontStyle: 'normal',
  },
  selectedPreferenceText: {
    backgroundColor: '#999898',
    borderRadius: 10,
    padding: 5,
    marginRight: 5,
    marginBottom: 5,
    color: 'white',
  },
  selectedPreferenceButton: {
    backgroundColor: '#5364B7',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  preferenceButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: -10,
  },
  preferenceButton: {
    backgroundColor: '#999898',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  preferenceButtonText: {
    color: 'white',
  },
  iconView: {
    width: 40,
    marginRight: 40,
    marginLeft: 8,
    left: 0,
    marginTop: 10,
    zIndex: 1,
  },
  defaultPreferencesText: {
    color: 'rgba(0, 0, 0, 0.48)',
    fontStyle: 'italic',
  },
  selectedPreferencesText: {
    color: '#000000',
    fontStyle: 'normal',
  },
});

export default RegistrationPage;