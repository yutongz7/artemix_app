import React, { useState } from 'react';
import { Image, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes';

type LoginPageNavigationProp = NavigationProp<RootStackParamList, 'LoginPage'>;

interface LoginPageProps {
  navigation: LoginPageNavigationProp;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
        navigation.navigate('Home');
    } else {
        setError('Invalid email or password')
    }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={{marginBottom: 15}}></Image>
      <TextInput
        style={styles.input}
        placeholder="User ID"
        value={userId}
        onChangeText={(text) => setUserId(text)}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
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
    fontFamily: 'QuattrocentoSans-Regular',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'QuattrocentoSans-Regular',
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
    fontFamily: 'QuattrocentoSans-Regular',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'QuattrocentoSans-Regular',
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
    fontFamily: 'QuattrocentoSans-Regular',
  },
  noAccText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 3,
    fontFamily: 'QuattrocentoSans-Regular',
  },
  accButton: {
    borderRadius: 10,
    width: '17%',
    height: '3%',
    backgroundColor: 'rgba(83, 100, 183, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  accText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'QuattrocentoSans-Regular',
  },
});

export default LoginPage;
