import React, { useState } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Modal } from 'react-native';
import { RouteProp, useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  const [preferences, setPreferences] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const goBack = () => {
    navigation.goBack();
  };

  const handleNextPress = async () => {
    try {
      const userObject = {
        userId: userId,
        userName: `${firstName} ${lastName}`,
        userPassword: password,
        userEmail: email,
        userPhone: phone,
        userProfileImgAddress: '',
        userPreferenceTags: selectedPreferences,
        tags: [],
      };

      const response = await fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userObject),
      });

      if (response.status === 200) {
        navigation.navigate('OnboardingPage1');
      } else {
        const responseBody = await response.json();
        console.error('Registration failed:', responseBody.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
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
      <TouchableOpacity style={styles.iconView} onPress={goBack}>
        <Ionicons name='chevron-back-outline' size={35} color='#5364B7'/>
      </TouchableOpacity>
      <Image style={{ alignSelf: 'center', height: 75, width: 260 }} source={require('../assets/logo.png')}></Image>
      <TouchableOpacity style={styles.profilePictureContainer}>
        <Image style={{height: 90, width: 90, borderRadius: 50}} source={require('../assets/icons/blank_profile.png')}></Image>
        <Text style={styles.uploadPhotoText}>Upload Photo</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
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
        value={lastName}
        onChangeText={(text) => setUserId(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone (+X-)XXX-XXX-XXXX"
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />

      <Text style={styles.preferencesTitle}>Preferences</Text>
      <Text style={styles.preferencesSubtitle}>
        Add the types of art you'd like to see. These can always be changed later.
      </Text>
      <View style={styles.searchPreferencesContainer}>
        <Pressable
          style={styles.input}
          onPress={() => setModalVisible(true)}>
          <Text
            style={{
              color: 'rgba(0, 0, 0, 0.48)',
              fontSize: 15,
              fontStyle: 'italic',
              paddingLeft: 10,
              marginTop: 6,
              textAlign: 'left',
            }}>
            {preferences || 'Select Preferences'}
          </Text>
        </Pressable>
        {modalVisible && (
          <View style={styles.preferenceButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.preferenceButton,
                selectedPreferences.includes('Poetry') && styles.selectedPreferenceButton,
              ]}
              onPress={() => handlePreferenceSelect('Poetry')}>
              <Text style={styles.preferenceButtonText}>Poetry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.preferenceButton,
                selectedPreferences.includes('Photography') && styles.selectedPreferenceButton,
              ]}
              onPress={() => handlePreferenceSelect('Photography')}>
              <Text style={styles.preferenceButtonText}>Photography</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.preferenceButton,
                selectedPreferences.includes('Paintings') && styles.selectedPreferenceButton,
              ]}
              onPress={() => handlePreferenceSelect('Paintings')}>
              <Text style={styles.preferenceButtonText}>Paintings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.preferenceButton,
                selectedPreferences.includes('Water Color') && styles.selectedPreferenceButton,
              ]}
              onPress={() => handlePreferenceSelect('Water Color')}>
              <Text style={styles.preferenceButtonText}>Water Color</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.preferenceButton,
                selectedPreferences.includes('Drawings') && styles.selectedPreferenceButton,
              ]}
              onPress={() => handlePreferenceSelect('Drawings')}>
              <Text style={styles.preferenceButtonText}>Drawings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.preferenceButton,
                selectedPreferences.includes('Pencil Art') && styles.selectedPreferenceButton,
              ]}
              onPress={() => handlePreferenceSelect('Pencil Art')}>
              <Text style={styles.preferenceButtonText}>Pencil Art</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.preferenceButton,
                selectedPreferences.includes('Writing') && styles.selectedPreferenceButton,
              ]}
              onPress={() => handlePreferenceSelect('Writing')}>
              <Text style={styles.preferenceButtonText}>Writing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.preferenceButton,
                selectedPreferences.includes('Music') && styles.selectedPreferenceButton,
              ]}
              onPress={() => handlePreferenceSelect('Music')}>
              <Text style={styles.preferenceButtonText}>Music</Text>
            </TouchableOpacity>
          </View>
        )}
  </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>Next</Text>
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
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 15,
    backgroundColor: 'rgba(234, 233, 233, 0.38)'
  },
  preferencesTitle: {
    alignSelf:'center',
    fontSize: 20,
    color: '#000000',
    marginBottom: 10,
  },
  preferencesSubtitle: {
    fontSize: 11,
    color: '#A0A0A0',
    marginBottom: 15,
  },
  nextButton: {
    backgroundColor: '#5364B7',
    borderRadius: 10,
    width: 150,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
    marginTop: 5,
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
    marginTop: 5,
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
  },
});

export default RegistrationPage;
