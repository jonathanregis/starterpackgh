import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Colors from '../constants/Colors';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FoodScreen from '../screens/FoodScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import FoodMenu from '../screens/FoodMenu';
import store from '../store';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import FoodBuilder from '../screens/Builder';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
    Food: FoodScreen,
    Menu: FoodMenu,
    History: OrderHistoryScreen,
    Builder: FoodBuilder,
  },
  config
);

const tabStyle =  {
          backgroundColor: '#ffffff', // TabBar background
          
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderTopColor: 'transparent',
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 40,
          },
          shadowOpacity: 0.60,
          shadowRadius: 12.32,

          elevation: 30,
      }

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name='home'
    />
  ),
  tabBarOptions: {
      showLabel: true,
      style: tabStyle,
      activeTintColor: Colors.tintColor
  }
};

HomeStack.path = '';

const CartStack = createStackNavigator(
  {
    Cart: CartScreen,
    Checkout: CheckoutScreen
  },
  config
);

CartStack.navigationOptions = {
  tabBarLabel: 'Cart',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name='shopping-bag' notify={true} />
  ),
  tabBarOptions: {
      showLabel: true,
      style: tabStyle,
      activeTintColor: Colors.tintColor
  }
};

CartStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name='settings' />
  ),
  tabBarOptions: {
      showLabel: true,
      style: tabStyle,
      activeTintColor: Colors.tintColor
  }
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  CartStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
