import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import SignInScreen from '../screens/SignInScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import SignUpScreen from '../screens/SignUpScreen';
import PasswordForgotScreen from '../screens/PasswordForgotScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

const AuthStack = createStackNavigator({ Welcome: WelcomeScreen, SignIn: SignInScreen, SignUp: SignUpScreen, Forgot: PasswordForgotScreen },{
      initialRouteName: 'Welcome',
    });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: MainTabNavigator,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);
