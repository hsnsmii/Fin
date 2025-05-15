import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import MarketScreen from '../screens/MarketScreen';
import FAQScreen from '../screens/FAQScreen';
import AssetsScreen from '../screens/AssetsScreen'
import PortfolioRiskScreen from '../screens/PortfolioRiskScreen';
import PortfolioDetailScreen from '../screens/PortfolioDetailScreen';


const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 60,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#BBBBBB',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name="home-sharp" 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          tabBarLabel: 'Piyasa',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name="stats-chart" 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Risk"
        component={PortfolioRiskScreen}
        options={{
          tabBarLabel: 'Risk',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name="shield-outline" 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={AssetsScreen}
        options={{
          tabBarLabel: 'Assests',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name="person" 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="FAQ"
        component={FAQScreen}
        options={{
          tabBarLabel: 'SSS',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name="help-circle" 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}