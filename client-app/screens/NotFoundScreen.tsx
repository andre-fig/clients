import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const NotFoundScreen = ({ navigation }: any) => {
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.message}>Página não encontrada!</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 38,
    fontWeight: '700',
    lineHeight: 70,
    textAlign: 'center',
    color: '#ec6724',
  },
  message: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 15,
    backgroundColor: '#ffffff00',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderWidth: 2,
    borderColor: '#EC6724',
    width: '100%',
  },
  buttonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
    textAlign: 'center',
    color: '#EC6724',
  },
});
