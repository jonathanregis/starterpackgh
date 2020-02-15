import React, { Component } from 'react';
import {StyleSheet, View,  StatusBar, TouchableOpacity, Platform } from 'react-native';
import { Left, Body, Text, Right, Header, Content, Container, Title, Form, Item, Label, Input, Button } from 'native-base';
import Constants from 'expo-constants';
import {API_URL} from '../constants/Redux';
import {Feather} from '@expo/vector-icons';
import Colors from '../constants/Colors';


export default class PasswordForgotScreen extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      newPass: "",
      newPassConfirm: "",
      code: "",
      allowChange: false,
      phone: ""
    };
  }

  submitPassword = ()=>{
    if(this.state.newPass !== this.state.newPassConfirm){
      alert("Passwords do not match");
      return null;
    }
    if(this.state.newPass.length < 8){
      alert("Password must be 8 characters or more");
      return null;
    }
    fetch(API_URL + "/buyers/resetPassword/"+this.state.code,{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({password: this.state.newPass})
    })
    .then(response=>response.json())
    .then(res=>{
      if(res.success){
        alert("Password changed successfully");
        this.props.navigation.goBack();
      }
      else{
        alert(res.message);
      }
    })
  }

  requireCode = ()=>{
    fetch(API_URL + "/buyers/forgotPassword/",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({phone: "233"+this.state.phone.substr(1,9)})
    })
    .then(response=>response.json())
    .then(res=>{
      if(res.success){
        this.setState({allowChange: true});
      }
      else{
        alert(res.message);
      }
    })
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: "#fff", elevation: 0, borderBottomWidth: 0, marginTop: Platform.OS !== "ios" ? Constants.statusBarHeight : 0}} noBorder noShadow>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
          <Left>
            <Button transparent onPress={()=>this.props.navigation.goBack()}>
              <Feather name="chevron-left" size={30} color="#334" />
            </Button>
          </Left>
          <Body ><Title style={{color: "#334"}} >Reset Password</Title></Body>
          <Right />
        </Header>
        <Content enableOnAndroid contentContainerStyle={{alignItems: "center", justifyContent: "center",flex:1}}>
        {this.state.allowChange && (
          <View style={{padding: 15}}>
            <Text>Please choose a new password with 8 characters of more.</Text>
            <Form style={{marginTop: 20}} noIndent>
              <Text>Please enter the 8 digit code you have received on your phone</Text>
              <Item style={styles.fieldItem} noIndent>
                <Label style={{fontSize: 14}} >8 digit code</Label>
                <Input style={{fontSize: 14}} onChangeText={(t)=>{this.setState({code: t})}} />
              </Item>
              <Item style={styles.fieldItem} noIndent>
                <Label style={{fontSize: 14}} >New password</Label>
                <Input style={{fontSize: 14}} secureTextEntry={true} onChangeText={(t)=>{this.setState({newPass: t})}} />
              </Item>
              <Item style={styles.fieldItem} noIndent>
                <Label style={{fontSize: 14}}>Confirm new password</Label>
                <Input secureTextEntry={true} style={{fontSize: 14}} onChangeText={(t)=>{this.setState({newPassConfirm: t})}}/>
              </Item>
            </Form>
            <Button style={{backgroundColor: Colors.tintColor, borderRadius: 30, marginTop: 15}} onPress={this.submitPassword}>
              <Text>Submit</Text>
            </Button>
          </View>
        )}
        {!this.state.allowChange && (
          <View style={{padding: 15}}>
            <Text>Please enter the phone number you used to register.</Text>
            <Form style={{marginTop: 20}} noIndent>
              <Item style={styles.fieldItem} noIndent>
                <Label style={{fontSize: 14}} >Phone number</Label>
                <Input style={{fontSize: 14}} onChangeText={(t)=>{this.setState({phone: t})}} />
              </Item>
            </Form>
            <Button style={{backgroundColor: Colors.tintColor, borderRadius: 30, marginTop: 15}} onPress={this.requireCode}>
              <Text>Reset password</Text>
            </Button>
          </View>
        )}
        </Content>
      </Container>
    )
  }
}

PasswordForgotScreen.navigationOptions = {
  header: null
}

const styles = StyleSheet.create({
  fieldItem: {
    marginLeft: 0
  }
})
