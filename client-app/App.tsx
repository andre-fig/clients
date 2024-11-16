import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { LoginScreen } from './screens/LoginScreen';
import { ClientsScreen } from './screens/ClientsScreen';
import { Header } from './components/Header';
import Menu from './components/Menu';
import { NotFoundScreen } from './screens/NotFoundScreen';

type RootStackParamList = {
  Login: undefined;
  Clients: undefined;
  NotFound: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [navigation, setNavigation] = useState<
    StackNavigationProp<RootStackParamList> | undefined
  >(undefined);
  const [currentScreen, setCurrentScreen] =
    useState<keyof RootStackParamList>('Login');

  const handleNavigationReady = (nav: any) => {
    setNavigation(nav);
  };

  return (
    <>
      <NavigationContainer
        onStateChange={(state) => {
          if (state) {
            const currentRoute = state.routes[state.index]
              ?.name as keyof RootStackParamList;
            setCurrentScreen(currentRoute);
          }
        }}
        ref={(nav) => {
          if (nav) {
            handleNavigationReady(nav);
          }
        }}
      >
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            header: () => <Header onMenuPress={() => setMenuVisible(true)} />,
            headerShown: true,
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Clients" component={ClientsScreen} />
          <Stack.Screen name="NotFound" component={NotFoundScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Menu
        isVisible={isMenuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
        currentScreen={currentScreen}
      />
    </>
  );
}
