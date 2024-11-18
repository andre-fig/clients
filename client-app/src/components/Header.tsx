import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

type HeaderProps = {
  onMenuPress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onMenuPress }) => {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/teddy-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity onPress={onMenuPress}>
          <Image
            source={require('../../assets/menu-icon.png')}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.shadowContainer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  shadowContainer: {
    height: 2,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 3,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    width: 100,
    height: 40,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
});
