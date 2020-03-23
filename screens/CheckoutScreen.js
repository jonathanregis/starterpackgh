import React, { Component } from 'react';
import Constants from 'expo-constants';
import {StatusBar, StyleSheet, View, TouchableOpacity, Platform, BackHandler, Modal, ActivityIndicator} from 'react-native';
import { Container, ActionSheet, Thumbnail, List, ListItem, Form, Item, Label, Input, Textarea, Content, Title, Header, Tab, Tabs, ScrollableTab, TabHeading, Icon, Text, Footer, Left, Body, Right, Button, Spinner, Picker } from 'native-base';
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
      paymentMethod: "CARD",
      selectedCard: 0,
      modalVisible: false,
      useGps: this.props.user.address != "" ? false : true,
      contactName: this.props.user.name,
      contactNumber: this.props.user.phone,
      note: "",
      orderNumber: "",
      checkoutURL: "",
      spin: false,
      form: "delivery",
      locations: [],
      selectedLocation: "",
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
    this.makeList("delivery");
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
          isDelivery: this.state.form == "delivery",
          destination: this.state.address,
          contactName: this.state.contactName,
          contactNumber: this.state.contactNumber,
          note: this.state.note,
        },
        payment: {
          method: this.state.paymentMethod,
          amount: this.props.total
        },
        redirectURL: "https://www.use.starterpackgh.com/paid/"
      }
      if(this.state.form == "pickup"){
        preppedObject.delivery.pickup = this.state.selectedLocation
      }

      if(this.state.form == "delivery"){
        preppedObject.delivery.closeLocation = this.state.selectedLocation
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
        console.log(res)
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

  onValueChange = (val) => {
    this.setState({selectedLocation: val})
  }

  makeList = type => {
    this.setState({form: type});
    let endpoint = type === "pickup" ? "/pickups/" : "/delivery/";
    fetch(API_URL + endpoint)
      .then(response=>response.json())
      .then(response=>{
        this.setState({locations: type == "pickup" ? response.pickup : response.locations},()=>{setTimeout(()=>this.setState({selectedLocation: this.state.locations[0]._id}),500)})
      })
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
            <Title style={{color: "#fff"}}>Checkout</Title>
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
                <Header style={{backgroundColor: '#334', elevation: 0, borderBottomWidth: 0}} noBorder noShadow hasTabs>
                  <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
                  <Left style={{flex:1}}>
                    <Button transparent onPress={()=>{this.setModalVisible(false);
                      this.props.navigation.navigate("Home");
                      this.setState({payButton: false});
                      store.dispatch({type: "CLEAR_CART"})
                      }}>
                      <Feather name="x-circle" size={30} color="#fff" />
                      <Text>Cancel</Text>
                    </Button>
                  </Left>
                  <Body style={{flex:1,alignItems: "center", justifyContent: "center"}}>
                    <Title style={{color: "#fff"}}>Order {this.state.orderNumber.split("/")[0]}</Title>
                  </Body>
                  <Right style={{flex:1}}>
                    <Title style={{color: "#fff"}}>GHC {this.props.total}</Title>
                  </Right>
                </Header>
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
            
              </View>
            </Modal>
        <Content enableOnAndroid style={{backgroundColor: "#fff"}}>
        <Tabs onChangeTab={({i})=>{this.setState({tabNum: i,payButton: (i  == 1 && this.state.paymentMethod != "")})}} tabBarUnderlineStyle={{backgroundColor: 'transparent', borderTopRightRadius: 5, borderTopLeftRadius: 5}} initialPage={0} page={this.state.tabNum} ref="mytabs" locked={true} renderTabBar={() => <ScrollableTab style={{ backgroundColor: "#334", borderBottomWidth: 0 }} />}>
          <Tab style={{backgroundColor: "transparent"}} disabled={false} textStyle={{color: "#fff"}} activeTabStyle={{margin: 10,borderColor: "#fff", borderWidth: 1, backgroundColor: "transparent", borderRadius: 30}} activeTextStyle={{color: "#fff", fontWeight: 'bold'}} tabStyle={{backgroundColor: "transparent", borderWidth: 1, borderColor: "transparent", elevation: 0, borderRadius: 30, margin:10}} heading="Delivery">
            <View style={{backgroundColor: "#334"}} >
              <View style={{ padding: 15, backgroundColor: "#fff", borderTopRightRadius: 30, borderTopLeftRadius: 30, flex: 1}}>
                <View style={styles.errorBox}>
                  <Icon name="info" type="Feather"/>
                  <View>
                    <Text style={{fontWeight: "bold", justifyContent: "center", marginLeft: 10}}>Service ends at 11 AM</Text>
                    <Text style={{justifyContent: "center", marginLeft: 10}} note>Any order made after 11 AM will be ready the next day. Please note that we are closed on weekends.</Text>
                  </View>
                  
                </View>
                <Text style={[styles.sectionTitle,{marginTop: 15}]}>ORDER TYPE</Text>
                <View style={styles.selectGroup}>
                  <Button onPress={()=>this.makeList("delivery")} transparent icon style={this.state.form === "delivery" ? [styles.selectButton,styles.selectButtonActive] : styles.selectButton}><Icon name="truck" type="Feather" style={{color: this.state.form === "delivery" ? "#fff" : Colors.tintColor}}/><Text style={{color: this.state.form === "delivery" ? "#fff" : Colors.tintColor}}>Delivery</Text></Button>
                  <Button onPress={()=>this.makeList("pickup")} transparent icon style={this.state.form === "pickup" ? [styles.selectButton,styles.selectButtonActive] : styles.selectButton}><Icon name="store" type="MaterialCommunityIcons" style={{color: this.state.form === "pickup" ? "#fff" : Colors.tintColor}}/><Text style={{color: this.state.form === "pickup" ? "#fff" : Colors.tintColor}}>Pickup</Text></Button>
                </View>
                {this.state.form === "pickup" && (
                  <View style={{marginVertical: 15}}>
                    <Text note>Pickup from a vendor close to you. Please select where you would like to pickup your order</Text>
                    <Form style={{marginVertical: 15,borderColor: "#dedeea",borderWidth: 2, padding: 5, borderRadius: 30}}>
                    <Picker
                      iosHeader="Location"
                      Header="Location"
                      textStyle={{color: "#334"}}
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: "100%"}}
                      selectedValue={this.state.selectedLocation}
                      onValueChange={this.onValueChange.bind(this)}
                      itemStyle={{width: '100%'}}
                    >
                      {this.state.locations.map((item,index)=>{return (
                        <Picker.Item key={index} label={item.location} value={item._id} />
                      )})
                    }
                    </Picker>
                    </Form>
                  </View>
                )}

                {this.state.form === "delivery" && (
                  <View style={{marginVertical: 15}}>
                    <Text note>Your order will be delivered to the address you provided in the address field below.</Text>
                    <Text>* Please note that this attracts a delivery fee.</Text>
                  </View>
                )}
                <Text style={styles.sectionTitle}>CUSTOMER INFO</Text>
                <Form style={{marginTop: 0}} noIndent>
                  <Item style={styles.formItem} fixedLabel first>
                    <Label>Name</Label>
                    <Input onChangeText={t=>this.setState({contactName: t})} defaultValue={this.props.user.name} placeholder="Customer name" />
                  </Item>
                  <Item style={styles.formItem} fixedLabel>
                    <Label>Phone</Label>
                    <Input defaultValue={this.props.user.phone} keyboardType="phone-pad" />
                  </Item>
                  <Item style={styles.formItem} fixedLabel icon>
                    <Label>Address</Label>
                    <Input onChangeText={t=>this.setState({address: t})} multiline defaultValue={this.state.address} />
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
                <Text note style={{marginVertical: 15}}>{this.state.form == "pickup" ? "Pickup from vendor" : "Deliver to "+ this.state.contactName +"\nat "+ this.state.address}</Text>
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
            <Button onPress={this.buttonAction} icon style={{backgroundColor: this.state.payButton ? "seagreen" : Colors.tintColor, borderRadius: 30, elevation: 10}}><Text>{this.state.payButton ? "PAY" : "NEXT"}</Text><Icon style={{color: "#fff"}} name={this.state.payButton ? "ios-checkmark-circle" : "ios-arrow-dropright-circle"}></Icon></Button>
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
  },
  errorBox: {
    backgroundColor: "#5bc0de33",
    padding: 15,
    marginVertical: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30
  },
  selectGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  selectButton:{
    borderRadius: 30,
    borderColor: Colors.tintColor,
    borderWidth: 1,
    marginRight: 10
  },
  selectButtonActive: {
    backgroundColor: Colors.tintColor
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