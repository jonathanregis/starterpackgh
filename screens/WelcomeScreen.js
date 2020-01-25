import React from 'react';
import {View,AsyncStorage, StatusBar, StyleSheet, Image, TouchableHighlight} from 'react-native';
import Constants from 'expo-constants';
import {Feather} from '@expo/vector-icons';
import Colors from '../constants/Colors';
import {Input, Text, Form, Item, Label, Container, Content, Header, Left, Right, Body, Button, Icon, Spinner} from 'native-base';
import store from '../store';

 export default class WelcomeScreen extends React.Component {

  constructor(props) {
    super(props);
  
    this.state = {};
  }

  componentDidMount(){
  	const isNew = store.getState().auth.isNew
  	if(!isNew){
  		this.props.navigation.navigate("SignIn")
  	}
  }

  render() {
    return (
      <Container style={{flex: 1}}>
        <Header style={{marginTop: Constants.statusBarHeight}} backgroundColor="#fff" noShadow>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent/>
          <Left />
          <Body />
          <Right />
        </Header>
        <Content contentContainerStyle={styles.contentContainer}>
            <View style={styles.intro} >
              <Image source={require('../assets/images/starterpack.png')} style={{width: 150, height: 150,alignSelf: "center"}} resizeMode="contain" />
              <Text style={{alignSelf: "center", color: Colors.tintColor, fontWeight: "bold", fontSize: 26, marginTop: 10}}>WELCOME</Text>
            </View>
            <Button onPress={()=>{this.props.navigation.navigate("SignIn");store.dispatch({type: "PASS_WELCOME"})}} style={styles.loginButton}>
              <Text>Let's Get Started</Text>
            </Button>
            <Button onPress={()=>{this.props.navigation.navigate("SignUp");store.dispatch({type: "PASS_WELCOME"})}} style={styles.registerButton} bordered transparent noShadow>
              <Text style={{color: Colors.tintColor}}>Register Now</Text>
            </Button>
        </Content>
      </Container>
    );
  }
}

WelcomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  intro: {
    paddingTop: 20,
  },
  contentContainer: {
    flex:1,
    padding: 20,
  },
  loginButton: {
  	marginTop: 60,
    borderRadius: 30,
    elevation: 20,
    backgroundColor: Colors.tintColor,
  },
  registerButton: {
  	marginTop: 30,
    borderRadius: 30,
    borderColor: Colors.tintColor,
  }
})