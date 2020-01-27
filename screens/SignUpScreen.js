import React from 'react';
import {View,AsyncStorage, StatusBar, StyleSheet, Image, TouchableHighlight} from 'react-native';
import Constants from 'expo-constants';
import {Feather} from '@expo/vector-icons';
import Colors from '../constants/Colors';
import {Input, Text, Form, Item, Label, Container, Content, Header, Left, Right, Body, Button, Icon, Spinner} from 'native-base';
import {connect} from 'react-redux';
import {register,login} from '../actions/AuthActions';
import {Linking} from 'expo';

class SignUpScreen extends React.Component {

  constructor(props) {
    super(props);
  
    this.state = {
      phone: "",
      passwordConfirm: "",
      password: "",
      name: "",
      submitted: false
    };
  }

  hasError = field => {
    if(!this.state.submitted) return false;
    switch(field){
      case "phone":
        return this.state.phone.length != 10;
      case "password":
        return this.state.password.length < 8;
      case "passwordConfirm":
        return this.state.passwordConfirm != this.state.password;
      default:
        return this.state[field] == "";
    }
  }

  showErrors = () => {
    if(this.state.submitted){
      let str = "";
      if(this.hasError("name")) str += "\nName cannot be empty";
      if(this.hasError("password")) str += "\nYour password should have at least 8 characters";
      if(this.hasError("passwordConfirm")) str += "\nPasswords do not match";
      if(this.hasError("phone")) str += "\nIncorrect number";
      return this.props.errorMessage + str;
    }
  }

  render() {
    return (
      <Container style={{flex: 1}}>
        <Header style={{marginTop: Constants.statusBarHeight}} backgroundColor="#fff" noShadow>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent/>
          <Left >
            <Button transparent onPress={()=>this.props.navigation.goBack()}>
              <Feather name="chevron-left" color={Colors.tintColor} size={30} />
            </Button>
          </Left>
          <Body />
          <Right />
        </Header>
        <Content contentContainerStyle={styles.contentContainer} enableOnAndroid>
            <View style={styles.intro} >
              <Image source={require('../assets/images/starterpack.png')} style={{width: 150, height: 150,alignSelf: "center"}} resizeMode="contain" />
              <Text style={{color: "#334", fontWeight: "bold", fontSize: 26, marginTop: 10}}>Sign up.</Text>
              <Text note style={this.showErrors() != "" ? {color: "crimson"} : null }>{this.showErrors() != "" ? this.showErrors() : "Please fill the form below"}</Text>
            </View>
            <Form style={{marginTop: 20}}>
              <Item style={styles.fieldItem} error={this.hasError("name")}>
                <Label>Name</Label>
                <Input error={'#d50000'} onChangeText={(n)=>this.setState({name: n})}/>
              </Item>
              <Item style={styles.fieldItem} error={this.hasError("phone")}>
                <Label>Phone</Label>
                <Input error={'#d50000'} keyboardType="phone-pad" onChangeText={(n)=>this.setState({phone: n})}/>
              </Item>
              <Item style={styles.fieldItem} error={this.hasError("password")} >
                <Label>Pin/Password</Label>
                <Input error={'#d50000'} secureTextEntry={true} onChangeText={(n)=>this.setState({password: n})}/>
              </Item>
              <Item style={styles.fieldItem} error={this.hasError("passwordConfirm")}>
                <Label>Confirm Password</Label>
                <Input error={'#d50000'} secureTextEntry={true} onChangeText={(n)=>this.setState({passwordConfirm: n})}/>
              </Item>
            </Form>
            <Button disabled={this.state.loadingButton} onPress={()=>{this.setState({loadingButton: true, submitted: true},()=>this._signUpAsync())}} style={styles.loginButton} icon>
              <Text>Register</Text>
              {this.state.loadingButton && (
                <Right style={{marginRight: 15}}>
                  <Spinner color='#fff' size={15}/>
                </Right>
              )}
              {!this.state.loadingButton && (
                <Icon name="log-in"/>
              )}
            </Button>
            <Text note style={{marginTop: 30}}>By signing up, you agree to our <Text onPress={()=>Linking.openURL("https://starterpackgh.com/tc")} note style={{color: "deepskyblue"}}>Terms and Conditions.</Text> Please also read our <Text note onPress={()=>Linking.openURL("https://starterpackgh.com/privacy-policy")} style={{color: "deepskyblue"}}>Privacy Policy</Text></Text>
        </Content>
      </Container>
    );
  }

  _signUpAsync = () => {
    if(!this.hasError("name") && !this.hasError("password") && !this.hasError("passwordConfirm") && !this.hasError("name")){
      this.props.register({phone: "233"+this.state.phone.substr(1,9), password: this.state.password, name: this.state.name},()=>{this.setState({loadingButton: false}); this.props.login({phone: "233"+this.state.phone.substr(1,9), password: this.state.password},()=>this.props.navigation.navigate("App"));},()=>this.setState({loadingButton: false}))
    }
    else {
      this.setState({loadingButton: false});
      return null;
    }
  };
}

SignUpScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  intro: {
    paddingTop: 0,
  },
  contentContainer: {
    padding: 20,
  },
  fieldItem: {
    marginLeft: 0,
    marginVertical: 10,
  },
  loginButton: {
    borderRadius: 30,
    elevation: 20,
    backgroundColor: Colors.tintColor,
    marginTop: 30
  }
})

const mapStateToProps = state => {
  return {
    errorMessage: state.message.errorMessage
  }
}

const mapActionToProps = {
  register,
  login
}

export default connect(mapStateToProps,mapActionToProps)(SignUpScreen);