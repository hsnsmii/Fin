import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import StockDetailScreen from './screens/market/StockDetailScreen';
import WatchlistDetailScreen from './screens/home/WatchlistDetailScreen';
import PortfolioDetailScreen from './screens/asset/PortfolioDetailScreen';
import AddPositionScreen from './screens/asset/AddPositionScreen';
import AccountInfoScreen from './screens/profile/AccountInfoScreen';
import ChangePasswordScreen from './screens/profile/ChangePasswordScreen';

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

        <Stack.Screen
          name="AddPosition"
          component={AddPositionScreen}
          options={{ title: '' }}
        />

        <Stack.Screen name="AddPosition" component={AddPositionScreen} options={{ headerShown: false }} />
 main
        <Stack.Screen name="AccountInfo" component={AccountInfoScreen} options={{ title: 'Hesap Bilgileri' }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Şifre Değiştir' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
