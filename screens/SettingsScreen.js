import React, { Component } from 'react';
import { Switch, StyleSheet, Text, View,  StatusBar, TouchableOpacity, Platform } from 'react-native';
import { Thumbnail, ListItem, Left, Body, Right, Icon, Header, Content, Container, Title, Form, Item, Label, Input } from 'native-base';
import {Feather} from '@expo/vector-icons';

import BaseIcon from './Icon';
import Chevron from './Chevron';
import InfoText from './InfoText';
import {connect} from 'react-redux';
import Constants from 'expo-constants';

import {updateUserInfo} from '../actions/AuthActions';
import Colors from '../constants/Colors';
import {Linking} from 'expo';



class SettingsScreen extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      pushNotifications: true,
      updateUserInfo: this.props.user,
      editMode: false
    };
  }

  saveNewData = () => {
    this.props.updateUserInfo({data: this.state.updateUserInfo,token:this.props.token,id: this.props.user.id});
  }

  onPressOptions = () => {
    alert("Option set");
  }

  onChangePushNotifications = () => {
    this.setState(state => ({
      pushNotifications: !state.pushNotifications,
    }))
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: "#fff", elevation: 0, borderBottomWidth: 0, marginTop: Platform.OS !== "ios" ? Constants.statusBarHeight : 0}} noBorder noShadow>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
          <Left style={{flex: 1}} />
          <Body style={{flex: 1,alignItems: "center"}} ><Title style={{color: "#334"}} >Settings</Title></Body>
          <Right style={{flex: 1}} />
        </Header>
        <Content enableOnAndroid>
          <View style={styles.userRow}>
            <View style={styles.userImage}>
              <Thumbnail
                rounded
                large
                source={{
                  uri: "https://ui-avatars.com/api/?name="+this.props.user.name.replace(" ","+")+"&size=512&background=690101",
                }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 16 }}>{this.props.user.name}</Text>
              <Text
                style={{
                  color: 'gray',
                  fontSize: 16,
                }}
              >
                {this.props.user.email}
              </Text>
            </View>
          </View>
          <InfoText text="Account" />
          <View>
            <TouchableOpacity style={{alignSelf: "flex-end", marginRight: 10}} onPress={this.state.editMode ? ()=>{this.saveNewData();this.setState({editMode: false})} : ()=>this.setState({editMode: true})} >
              <Text style={{color: Colors.tintColor}}>{this.state.editMode ? "SAVE" : "EDIT"}</Text>
            </TouchableOpacity>
            <Form style={{marginTop: 20}} noIndent>
              <Item style={styles.fieldItem} noIndent first>
                <Label style={{fontSize: 14}} >Name</Label>
                <Input disabled={!this.state.editMode} defaultValue={this.props.user.name} style={{fontSize: 14}} onChangeText={(t)=>{this.setState({updateUserInfo: {...this.state.updateUserInfo, name: t}})}} />
              </Item>
              <Item style={styles.fieldItem} noIndent>
              <Label style={{fontSize: 14}}>Email</Label>
                <Input disabled={!this.state.editMode} keyboardType="email-address" defaultValue={this.props.user.email} style={{fontSize: 14}} onChangeText={(t)=>{this.setState({updateUserInfo: {...this.state.updateUserInfo, email: t}})}}/>
              </Item>
              <Item style={styles.fieldItem} noIndent>
                <Label style={{fontSize: 14}} >Phone</Label>
                <Input disabled={!this.state.editMode} defaultValue={this.props.user.phone} keyboardType="phone-pad" style={{fontSize: 14}} onChangeText={(t)=>{this.setState({updateUserInfo: {...this.state.updateUserInfo, phone: t}})}} />
              </Item>
              <Item style={styles.fieldItem} noIndent last>
                <Label style={{fontSize: 14}} >Address</Label>
                <Input disabled={!this.state.editMode} defaultValue={this.props.user.address} style={{fontSize: 14}} onChangeText={(t)=>{this.setState({updateUserInfo: {...this.state.updateUserInfo, address: t}})}}/>
              </Item>
            </Form>
          </View>
          <InfoText text="More" />
          <View>
            <ListItem
              onPress={() => Linking.openURL("https://starterpackgh.com/about")}
              containerStyle={styles.listItemContainer}
              icon
              first
            >
              <Left><Icon type="Feather" name="info" color="#334" style={{height: 32, width: 32}} /></Left>
              <Body><Text>About Us</Text></Body>
              <Right>
                <Icon type="Feather" name="chevron-right" color="#dedeea"/>
              </Right>
            </ListItem>
            <ListItem
              onPress={() => Linking.openURL("https://starterpackgh.com/tc")}
              containerStyle={styles.listItemContainer}
              icon
            >
              <Left><Icon type="Feather" name="edit" color="#334" style={{height: 32, width: 32}} /></Left>
              <Body><Text>Terms and Conditions</Text></Body>
              <Right>
                <Icon type="Feather" name="chevron-right" color="#dedeea"/>
              </Right>
            </ListItem>
            <ListItem
              onPress={() => Linking.openURL("https://starterpackgh.com/privacy-policy")}
              containerStyle={styles.listItemContainer}
              icon
              last
            >
              <Left><Icon type="Feather" name="lock" color="#334" style={{height: 32, width: 32}} /></Left>
              <Body><Text>Privacy Policy</Text></Body>
              <Right>
                <Icon type="Feather" name="chevron-right" color="#dedeea"/>
              </Right>
            </ListItem>
          </View>
          </Content>
      </Container>
    )
  }
}

SettingsScreen.navigationOptions = {
  header: null
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
})

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    token: state.auth.token
  }
}

const mapActionToProps = {
  updateUserInfo
}

export default connect(mapStateToProps,mapActionToProps)(SettingsScreen)
