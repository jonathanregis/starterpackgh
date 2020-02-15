import React, { Component } from 'react';
import Constants from 'expo-constants';
import {StatusBar, StyleSheet, View, TouchableOpacity, Platform, BackHandler, Modal, ActivityIndicator} from 'react-native';
import { Container, ActionSheet, Thumbnail, List, ListItem, Form, Item, Label, Input, Textarea, Content, Title, Header, Tab, Tabs, ScrollableTab, TabHeading, Icon, Text, Footer, Left, Body, Right, Button, Spinner } from 'native-base';
import Colors from '../constants/Colors';
import {Feather} from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {RadioButton} from '../components/Addons';
import {CASH_ON_DELIVERY, DEBIT_CARD, API_URL} from '../constants/Redux';
import {connect} from 'react-redux';
import store from '../store';
import {withNavigationFocus} from 'react-navigation';
import {WebView} from 'react-native-webview';

const toggle = prop => {
  if(prop) return false;
  else return true;
}

class CheckoutScreen extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      payButton: false,
      tabNum: 0,
      errorMessage: "",
      location: {},
      address: this.props.user.address,
      editMode: false,
      paymentMethod: "CARD",
      selectedCard: 0,
      modalVisible: false,
      useGps: this.props.user.address != "" ? false : true,
      contactName: this.props.user.name,
      contactNumber: this.props.user.phone,
      note: "",
      orderNumber: "",
      checkoutURL: "",
      spin: false
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    if(this.props.cartItems.length <= 0){
      this.backHandler.remove()
      this.props.navigation.navigate("Cart");
    }

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  handleBackPress = () => {
    if(this.state.tabNum > 0){
      this.setState({tabNum: this.state.tabNum - 1})
      return true;
    }

    else {
      return false
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + location.coords.latitude + ","+ location.coords.longitude + "&sensor=true&key=AIzaSyDagCUo3RpJ4fvTGZ3VLsOqFdTGtVl3tdU")
    .then((response)=>response.json())
    .then((response)=>this.setState({address: this.state.useGps ? response.results[0].formatted_address : this.props.user.address}))
  };

  buttonAction = () => {
    if(!this.state.payButton){
      this.setState({tabNum: this.state.tabNum == 0 ? 1 : 1});
    }

    else {
      this.setState({payButton: false});
      let preppedObject = {
        buyerID: this.props.user.id,
        cart: this.props.cartItems,
        delivery: {
          destination: this.state.address,
          contactName: this.state.contactName,
          contactNumber: this.state.contactNumber,
          note: this.state.note,
        },
        payment: {
          method: this.state.paymentMethod,
          amount: this.props.total
        },
        redirectURL: "https://starterpackgh.netlify.com/paid/"
      }
      fetch(API_URL+"/pay/",{
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          'Authorization' : "Bearer "+this.props.token
        },
        body: JSON.stringify(preppedObject)
      })
      .then(response=>response.json())
      .then(res=>{
        console.log(res.payment.checkoutUrl);
        if(res.success) this.setState({orderNumber:res.payment['order-id'],checkoutURL: res.payment.checkoutUrl},this.setState({modalVisible: true}));
        else alert("Request failed, please try again");
      })
    }
  }
  setModalVisible(visible){
    this.setState({modalVisible: visible});
  }

  showLoader = () => {
  	this.setState({spin: true})
  }

  hideLoader = () => {
  	this.setState({spin: false})
  }

  renderLoadingView() {
	return (
	    <ActivityIndicator
	       color = '#bc2b78'
	       size = "large"
	       style = {styles.activityIndicator}
	       hidesWhenStopped={true} 
	    />
	);
	}

  render() {
    return (
      <Container style={{backgroundColor: "#334"}}>
       <Header style={{backgroundColor: '#334', elevation: 0, borderBottomWidth: 0, marginTop: Platform.OS !== "ios" ? Constants.statusBarHeight : 0}} noBorder noShadow hasTabs>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
          <Left style={{flex:1}}>
            <Title style={{color: "#fff"}}>GHC {this.props.total}</Title>
          </Left>
          <Body style={{flex:1,alignItems: "center", justifyContent: "center"}}>
            <Title>Checkout</Title>
          </Body>
          <Right style={{flex:1}}>
            <Button transparent onPress={()=>this.props.navigation.navigate("Cart")}>
              <Feather name="x-circle" size={30} color="#fff" />
            </Button>
          </Right>
        </Header>
        <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setModalVisible(false);
                this.props.navigation.navigate("Home");
                this.setState({payButton: false});
                store.dispatch({type: "CLEAR_CART"});
              }}
              containerStyle={styles.modal}
              >
              <View style={styles.modal}>
                <WebView 
                	onMessage={event => {
					    const { data } = event.nativeEvent;
					    if(data == "done") {
					    	this.setModalVisible(false);
			                this.props.navigation.navigate("Home");
			                this.setState({payButton: false});
			                store.dispatch({type: "CLEAR_CART"});
					    }
				  	}} 
				  	startInLoadingState={true} 
				  	style={styles.modalContent} 
				  	source={{ uri: this.state.checkoutURL }} />
            <View style={{backgroundColor: "#fff", padding: 10}}>
              <Button onPress={()=>{this.setModalVisible(false);
                      this.props.navigation.navigate("Home");
                      this.setState({payButton: false});
                      store.dispatch({type: "CLEAR_CART"})
                    }} 
                    style={{backgroundColor: Colors.tintColor, borderRadius: 30}}>
                <Text> CLOSE </Text>
              </Button>
            </View>
              </View>
            </Modal>
        <Content enableOnAndroid style={{backgroundColor: "#fff"}}>
        <Tabs onChangeTab={({i})=>{this.setState({tabNum: i,payButton: (i  == 1 && this.state.paymentMethod != "")})}} tabBarUnderlineStyle={{backgroundColor: 'transparent', borderTopRightRadius: 5, borderTopLeftRadius: 5}} initialPage={0} page={this.state.tabNum} ref="mytabs" locked={true} renderTabBar={() => <ScrollableTab style={{ backgroundColor: "#334", borderBottomWidth: 0 }} />}>
          <Tab style={{backgroundColor: "transparent"}} disabled={false} textStyle={{color: "#fff"}} activeTabStyle={{margin: 10,borderColor: "#fff", borderWidth: 1, backgroundColor: "transparent", borderRadius: 30}} activeTextStyle={{color: "#fff", fontWeight: 'bold'}} tabStyle={{backgroundColor: "transparent", borderWidth: 1, borderColor: "transparent", elevation: 0, borderRadius: 30, margin:10}} heading="Delivery">
            <View style={{backgroundColor: "#334"}} >
              <View style={{ padding: 15, backgroundColor: "#fff", borderTopRightRadius: 30, borderTopLeftRadius: 30, flex: 1}}>
                <View style={styles.sectionTitleWithLink}>
                  <Text style={styles.sectionTitle}>CUSTOMER INFO</Text>
                  <TouchableOpacity onPress={()=>this.setState({editMode: toggle(this.state.editMode)})}>
                    <Text style={{color: Colors.tintColor}}>{this.state.editMode ? "SAVE" : "EDIT"}</Text>
                  </TouchableOpacity>
                </View>
                <Form style={{marginTop: 0}} noIndent>
                  <Item style={styles.formItem} fixedLabel first>
                    <Label>Name</Label>
                    <Input disabled={!this.state.editMode} onChangeText={t=>this.setState({contactName: t})} defaultValue={this.props.user.name} placeholder="Customer name" />
                  </Item>
                  <Item style={styles.formItem} fixedLabel>
                    <Label>Phone</Label>
                    <Input disabled={true} defaultValue={this.props.user.phone} keyboardType="phone-pad" />
                  </Item>
                  <Item style={styles.formItem} fixedLabel icon>
                    <Label>Address</Label>
                    <Input disabled={!this.state.editMode} onChangeText={t=>this.setState({address: t})} multiline defaultValue={this.state.address} />
                    <TouchableOpacity onPress={()=>{this.setState({useGps: true});this._getLocationAsync()}}>
                      <Icon type="Feather" name="map-pin" />
                    </TouchableOpacity>
                  </Item>
                </Form>
                <Text style={[styles.sectionTitle,{marginTop: 15}]}>DELIVERY NOTES</Text>
                <Form style={{marginTop: 10}}>
                    <Textarea onChangeText={t=>this.setState({note: t})} rowSpan={5} style={{borderColor: "#dedeea", borderWidth: 1, borderRadius: 30, padding: 10}} placeholder="Allergies, special notes etc..."></Textarea>
                </Form>
              </View>
            </View>
          </Tab>
          <Tab disabled={true} textStyle={{color: "#fff"}} activeTabStyle={{margin: 10,borderColor: "#fff", borderWidth: 1, backgroundColor: "transparent", borderRadius: 30}} activeTextStyle={{color: "#fff", fontWeight: 'bold'}} tabStyle={{backgroundColor: "transparent", borderWidth: 1, borderColor: "transparent", elevation: 0, borderRadius: 30, margin:10}} heading="Payment">
            <View style={{ backgroundColor: "#334"}}>
              <View style={{padding: 15,backgroundColor: "#fff", borderTopRightRadius: 30, borderTopLeftRadius: 30, elevation: 0, flex: 1, justifyContent: "center"}}>
                
                <Text style={[styles.sectionTitle,{marginTop: 15}]}>ORDER SUMMARY</Text>
                <List>
                {this.props.cartItems.map((item, index)=>{
                  return(
                    <ListItem noBorder noIndent style={styles.listItem} thumbnail key={index}>
                      <Left>
                        <Thumbnail source={typeof item.image === "string" ? {uri: item.image} : item.image} square large style={{height:50, width: 50, borderRadius: 15}} />
                      </Left>
                      <Body>
                        <Text numberOfLines={1}>{item.quantity} x {item.name}</Text>
                        {item.selectedAddon._id == "" ? (<Text note>{" "}</Text>) : (<Text note> with {item.selectedAddon.name}</Text>)}
                      </Body>
                      <Right>
                        <Text note>GHC {(item.price + item.selectedAddon.price) * item.quantity}</Text>
                      </Right>
                    </ListItem>
                  )
                })}
                </List>
                <View style={styles.sectionTitleWithLink}>
                  <Text style={styles.sectionTitle}>TOTAL</Text>
                  <View>
                    <Text>GHC {this.props.total}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Tab>
        </Tabs>
        </Content>
        <Footer style={{backgroundColor: "#fff",paddingHorizontal: 20, height: 100, alignItems: "center", justifyContent: "center"}}>
          <Left />
          <Body />
          <Right>
            <Button onPress={this.buttonAction} icon style={{backgroundColor: this.state.payButton ? "seagreen" : Colors.tintColor, borderRadius: 30, elevation: 10}}><Text>{this.state.payButton ? "PAY" : "NEXT"}</Text><Icon name={this.state.payButton ? "ios-checkmark-circle" : "ios-arrow-dropright-circle"}></Icon></Button>
          </Right>
        </Footer>
      </Container>
    );
  }
}



CheckoutScreen.navigationOptions = {
  header: null
}


const styles = StyleSheet.create({
  tabHeading: {
    backgroundColor: Colors.tintColor,
    margin: 10,
    borderRadius: 30

  },
  tab: {
    backgroundColor: "#fff"
  },

  sectionTitle: {
    color: "#dedeea",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10
  },
  sectionTitleWithLink: {
    marginTop: 30,
    marginBottom: 10,
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  formItem: {
    borderColor: "#dedeea",
    marginVertical: 10
  },
  listItem: {
    borderColor: "#eeeefa",
    borderRadius: 20,
    borderWidth: 1,
    marginVertical: 10,
    backgroundColor: "#fff"
  },
  modal: {
    flex: 1,
  },
  modalContent: {
    flex:1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  modalButton: {
    backgroundColor: Colors.tintColor,
    elevation: 20,
    margin: 15,
    borderRadius: 30,
    width: '100%',
    marginTop: 30
  },
  activityIndicator: {
  	flex: 1,
  	alignSelf: "center"
  }
})

const mapStateToProps = state => {
  return {
    cartItems: state.order.cartItems,
    total: state.order.cartTotal,
    user: state.auth.user,
    token: state.auth.token
  }
}

export default connect(mapStateToProps,null)(CheckoutScreen);