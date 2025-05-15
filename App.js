import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import StockDetailScreen from './screens/StockDetailScreen';
import WatchlistDetailScreen from './screens/WatchlistDetailScreen';
import PortfolioDetailScreen from './screens/PortfolioDetailScreen';
import AddPositionScreen from './screens/AddPositionScreen';

import MainTabs from './screens/TabBar'; // <--- Tab yapısı buradan gelecek

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="StockDetail" component={StockDetailScreen} options={{ title: 'Hisse Detayı' }} />
        <Stack.Screen name="WatchlistDetail" component={WatchlistDetailScreen} />
        <Stack.Screen name="PortfolioDetail" component={PortfolioDetailScreen} />
        <Stack.Screen name="AddPosition" component={AddPositionScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
