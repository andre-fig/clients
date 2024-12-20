import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Login: undefined;
  Clients: undefined;
  SelectedClients: undefined;
  NotFound: undefined;
};

interface MenuProps {
  isVisible: boolean;
  onClose: () => void;
  currentScreen: keyof RootStackParamList;
}

const Menu: React.FC<MenuProps> = ({ isVisible, onClose, currentScreen }) => {
  const [menuAnimation] = useState(new Animated.Value(width));

  type NavigationProp = StackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (isVisible) {
      Animated.timing(menuAnimation, {
        toValue: width * 0.35,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(menuAnimation, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start(() => onClose());
    }
  }, [isVisible]);

  const navigateTo = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
    onClose();
  };

  const options = [
    {
      name: 'Home',
      screen: 'Login',
      icon: require('../../assets/home-icon.png'),
    },
    {
      name: 'Clientes',
      screen: 'Clients',
      icon: require('../../assets/client-icon.png'),
    },
    {
      name: 'Produtos',
      screen: 'NotFound',
      icon: require('../../assets/product-icon.png'),
    },
  ] as const;

  if (!isVisible) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.menuContainer, { left: menuAnimation }]}>
          <View style={styles.fullTopSection}>
            <Image
              source={require('../../assets/teddy-logo.png')}
              style={styles.logo}
            />
            <View style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.name}
                  style={[
                    styles.option,
                    option.screen === currentScreen && styles.activeOption,
                  ]}
                  onPress={() => navigateTo(option.screen)}
                >
                  <Image
                    source={option.icon}
                    style={[
                      styles.optionIcon,
                      option.screen === currentScreen &&
                        styles.activeOptionIcon,
                    ]}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      option.screen === currentScreen &&
                        styles.activeOptionText,
                    ]}
                  >
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 280,
    zIndex: 10,
    elevation: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  fullTopSection: {
    flex: 1,
    backgroundColor: '#a3a3a3',
    justifyContent: 'flex-end',
    borderTopLeftRadius: 30,
  },
  logo: {
    width: 100,
    height: 50,
    alignSelf: 'center',
    marginBottom: 30,
  },
  optionsContainer: {
    height: '80%',
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  activeOption: {
    borderRightWidth: 3,
    borderColor: '#EE7D46',
  },
  optionIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  activeOptionIcon: {
    tintColor: '#EE7D46',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  activeOptionText: {
    color: '#EE7D46',
  },
});

export default Menu;
