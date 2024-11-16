import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export const LoginScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (name.trim() === '') {
      Alert.alert('Erro', 'Por favor, insira seu nome.');
      return;
    }
    navigation.navigate('Clients');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Olá, seja bem-vindo!</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o seu nome:"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 20,
    backgroundColor: '#f9f9f9',
  },
  welcomeText: {
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: '400',
    lineHeight: 38.73,
    textAlign: 'center',
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    borderRadius: 5,
    height: 60,
    fontFamily: 'Inter',
    fontSize: 24,
  },
  button: {
    backgroundColor: '#ec6724',
    borderRadius: 5,
    height: 60,
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 29.05,
    color: '#ffffff',
  },
});
