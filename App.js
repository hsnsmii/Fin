import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import FAQScreen from './screens/FAQScreen';
import MarketScreen from './screens/MarketScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen'; // 🌟 Eklediğimiz yeni ekran
import StockDetailScreen from './screens/StockDetailScreen'; // ✅
import WatchlistScreen from './screens/WatchlistScreen';
import WatchlistDetailScreen from './screens/WatchlistDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FAQ"
          component={FAQScreen}
          options={{ title: 'Sıkça Sorulan Sorular' }}
        />
        <Stack.Screen
          name="Market"
          component={MarketScreen}
          options={{}}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{}}
        />
        <Stack.Screen 
          name="StockDetail" 
          component={StockDetailScreen} 
          options={{ title: 'Hisse Detayı' }} 
        />
        <Stack.Screen 
        name="Watchlist" 
        component={WatchlistScreen} 
        />
        <Stack.Screen 
        name="WatchlistDetail" 
        component={WatchlistDetailScreen} 
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
