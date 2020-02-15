import React from 'react';
import {View,AsyncStorage, StatusBar, StyleSheet, Image, TouchableHighlight, Platform} from 'react-native';
import Constants from 'expo-constants';
import {Feather} from '@expo/vector-icons';
import Colors from '../constants/Colors';
import {Input, Text, Form, Item, Label, Container, Content, Header, Left, Right, Body, Button, Icon, Spinner} from 'native-base';
import {connect} from 'react-redux';
import {login, clearMessages} from '../actions/AuthActions';
import { Linking } from 'expo';

 class SignInScreen extends React.Component {

  constructor(props) {
    super(props);
  
    this.state = {loadingButton: false, username: "", password: ""};
  }

  render() {
    return (
      <Container style={{flex: 1}}>
        <Header style={{borderBottomWidth: 0, marginTop: Platform.OS !== "ios" ? Constants.statusBarHeight : 0}} backgroundColor="#fff" noBorder noShadow>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent/>
          <Left />
          <Body />
          <Right />
        </Header>
        <Content contentContainerStyle={styles.contentContainer} enableOnAndroid>
            <View style={styles.intro} >
              <Image source={require('../assets/images/starterpack.png')} style={{width: 150, height: 150,alignSelf: "center"}} resizeMode="contain" />
              <Text style={{color: "#334", fontWeight: "bold", fontSize: 26, marginTop: 10}}>Welcome.</Text>
              <Text note>Please login to continue</Text>
              {this.props.loginError && (
                <Text style={{marginTop: 10, color: "crimson"}}>Incorrect credentials.</Text>
              )}
            </View>
            <Form style={{marginTop: 30}}>
              <Item style={styles.fieldItem}>
                <Label>Phone</Label>
                <Input keyboardType="phone-pad" onChangeText={(t)=>{this.setState({username: t})}}/>
                <Icon name="person" />
              </Item>
              <Item style={styles.fieldItem}>
                <Label>Pin/Password</Label>
                <Input secureTextEntry={true} onChangeText={(t)=>{this.setState({password: t})}}/>
                <Icon name="lock" />
              </Item>
            </Form>
            <Text style={{alignSelf: "flex-end",marginVertical: 15, color: "deepskyblue"}} onPress={()=>this.props.navigation.navigate("Forgot")} note>Forgot password?</Text>
            <Button onPress={this._signInAsync} style={styles.loginButton} icon>
              <Text>Login</Text>
              {this.state.loadingButton && (
                <Right style={{marginRight: 15}}>
                  <Spinner color='#fff' size={15}/>
                </Right>
              )}
              {!this.state.loadingButton && (
                <Icon name="log-in" />
              )}
            </Button>
            <Text note style={{marginTop: 40,alignSelf: "center"}}>New user? <Text style={{color: "deepskyblue", fontSize: 21}} note onPress={()=>this.props.navigation.navigate('SignUp')}>Signup</Text></Text>
            <Text note style={{marginTop: 30}}>By signing in, you agree to our <Text onPress={()=>Linking.openURL("https://starterpackgh.com/tc")} note style={{color: "deepskyblue"}}>Terms and Conditions.</Text> Please also read our <Text onPress={()=>Linking.openURL("https://starterpackgh.com/privacy-policy")} note style={{color: "deepskyblue"}}>privacy policy</Text></Text>
        </Content>
      </Container>
    );
  }

  _signInAsync = async () => {
    this.props.clearMessages();
    this.setState({loadingButton: true})
    this.props.login({phone: "233"+this.state.username.substr(1,9), password: this.state.password},()=>{this.setState({loadingButton: false}); this.props.navigation.navigate("App")},()=>this.setState({loadingButton: false}))
  };
}

SignInScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  intro: {
    paddingTop: 20,
  },
  contentContainer: {
    
    padding: 20,
  },
  fieldItem: {
    marginLeft: 0,
    marginVertical: 10
  },
  loginButton: {
    borderRadius: 30,
    elevation: 20,
    backgroundColor: Colors.tintColor,
  }
})

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    loginError: state.message.loginError
  }
}

const mapActionToProps = {
  login,
  clearMessages
}

export default connect(mapStateToProps, mapActionToProps)(SignInScreen);