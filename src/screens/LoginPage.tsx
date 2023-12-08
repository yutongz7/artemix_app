import React, { useState } from 'react';
import { Image, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';
import { useGlobalContext } from '../../GlobalContext';

type LoginPageNavigationProp = NavigationProp<RootStackParamList, 'LoginPage'>;

interface LoginPageProps {
  navigation: LoginPageNavigationProp;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setCurUserId } = useGlobalContext();

  interface User {
    userId: string,
    userPassword: string,
  }
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:4000/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const user = data.data.find((user: User) => user.userId === userId);

    if (user && user.userPassword === password) {
        setError('');
        navigation.navigate('Home', {
            showOnboarding: false
        });
    } else {
        setError('Invalid user ID or password')
    }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login');
    }
    setCurUserId(userId);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={{marginBottom: 15}}></Image>
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
        placeholder="Password"
        placeholderTextColor="rgba(0, 0, 0, 0.48)"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
        autoCapitalize="none"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Pressable style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Log In</Text>
      </Pressable>
      <Text style={styles.noAccText}>No account?</Text>
      <Pressable style={styles.accButton} onPress={() => navigation.navigate('RegistrationPage')}>
        <Text style={styles.accText}>Register</Text>
        </Pressable>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(217, 217, 217, 0.38)',
    borderColor: '#5364B7',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  loginButton: {
    marginTop: 20,
    borderRadius: 10,
    width: '25%',
    height: '4%',
    backgroundColor: '#5364B7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: 'white',
    fontSize: 15,
  },
  noAccText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    fontStyle: 'italic',
    marginBottom: 3,
  },
  accButton: {
    borderRadius: 10,
    width: '25%',
    height: '4%',
    borderWidth: 3,
    borderColor: '#5364B7',
    // backgroundColor: 'rgba(83, 100, 183, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  accText: {
    color: '#5364B7',
    fontSize: 15,
    fontWeight: 'bold'
  },
});

export default LoginPage;
