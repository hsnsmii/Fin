import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LocalizationProvider, useLocalization } from './services/LocalizationContext';

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

const RootNavigator = () => {
  const { t } = useLocalization();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="StockDetail" component={StockDetailScreen} options={{ title: 'Hisse Detayı' }} />
        <Stack.Screen name="WatchlistDetail" component={WatchlistDetailScreen} />
        <Stack.Screen name="PortfolioDetail" component={PortfolioDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddPosition" component={AddPositionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AccountInfo" component={AccountInfoScreen} options={{ title: t('Account Information') }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: t('Change Password') }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => (
  <LocalizationProvider>
    <RootNavigator />
  </LocalizationProvider>
);

export default App;
