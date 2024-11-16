import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
  const [currentScreen, setCurrentScreen] =
    useState<keyof RootStackParamList>('Login');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        onStateChange={(state) => {
          if (state) {
            const currentRoute = state.routes[state.index]
              ?.name as keyof RootStackParamList;
            setCurrentScreen(currentRoute);
          }
        }}
      >
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            header: () => <Header onMenuPress={() => setMenuVisible(true)} />,
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
        <Menu
          isVisible={isMenuVisible}
          onClose={() => setMenuVisible(false)}
          currentScreen={currentScreen}
        />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
