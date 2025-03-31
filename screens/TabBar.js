// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from '@react-navigation/native';
// import HomeScreen from './screens/HomeScreen';
// import MarketScreen from './screens/MarketScreen';
// import FAQScreen from './screens/FAQScreen';
// import LoginScreen from './screens/LoginScreen';
// import SignupScreen from './screens/SignupScreen';
// import { FontAwesome } from '@expo/vector-icons';
// import { View, Text } from 'react-native';

// const Tab = createBottomTabNavigator();

// const Navigation = () => {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         initialRouteName="Home"
//         screenOptions={{
//           tabBarShowLabel: false,
//           tabBarStyle: {
//             position: 'absolute',
//             bottom: 0,
//             left: 0,
//             right: 0,
//             elevation: 0,
//             backgroundColor: '#ffffff',
//             borderTopLeftRadius: 20,
//             borderTopRightRadius: 20,
//             height: 60,
//           },
//         }}
//       >
//         <Tab.Screen
//           name="Home"
//           component={HomeScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                 <FontAwesome name="home" size={24} color={focused ? '#162e99' : '#8e8e93'} />
//                 <Text style={{ color: focused ? '#162e99' : '#8e8e93', fontSize: 12, marginTop: 5 }}>Home</Text>
//               </View>
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Market"
//           component={MarketScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                 <FontAwesome name="line-chart" size={24} color={focused ? '#162e99' : '#8e8e93'} />
//                 <Text style={{ color: focused ? '#162e99' : '#8e8e93', fontSize: 12, marginTop: 5 }}>Market</Text>
//               </View>
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="FAQ"
//           component={FAQScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                 <FontAwesome name="question-circle" size={24} color={focused ? '#162e99' : '#8e8e93'} />
//                 <Text style={{ color: focused ? '#162e99' : '#8e8e93', fontSize: 12, marginTop: 5 }}>FAQ</Text>
//               </View>
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                 <FontAwesome name="user" size={24} color={focused ? '#162e99' : '#8e8e93'} />
//                 <Text style={{ color: focused ? '#162e99' : '#8e8e93', fontSize: 12, marginTop: 5 }}>Login</Text>
//               </View>
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Signup"
//           component={SignupScreen}
//           options={{
//             tabBarIcon: ({ focused }) => (
//               <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                 <FontAwesome name="user-plus" size={24} color={focused ? '#162e99' : '#8e8e93'} />
//                 <Text style={{ color: focused ? '#162e99' : '#8e8e93', fontSize: 12, marginTop: 5 }}>Signup</Text>
//               </View>
//             ),
//           }}
//         />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// };

// export default Navigation;
