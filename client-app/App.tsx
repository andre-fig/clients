import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LoginScreen } from './src/screens/LoginScreen';
import { ClientsScreen } from './src/screens/ClientsScreen';
import { Header } from './src/components/Header';
import Menu from './src/components/Menu';
import { NotFoundScreen } from './src/screens/NotFoundScreen';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { navigationRef } from './src/navigation/NavigationService';
import api from './src/api/api'; 

type RootStackParamList = {
  Login: undefined;
  Clients: undefined;
  NotFound: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppContent() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<keyof RootStackParamList>(
    'Login'
  );

  const { token, setToken } = useAuth(); 

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setToken(null); 
          navigationRef.navigate('Login'); 
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor); 
    };
  }, [setToken]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={(state) => {
          if (state) {
            const currentRoute = state.routes[state.index]
              ?.name as keyof RootStackParamList;
            setCurrentScreen(currentRoute);
          }
        }}
      >
        <Stack.Navigator
          initialRouteName={token ? 'Clients' : 'Login'}
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent /> 
    </AuthProvider>
  );
}
