import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';

import {connect} from 'react-redux';

import {Header,Container, Body, Content, Left, Right, Title, Button, Text, Item, Input, Icon, Drawer, Thumbnail, Footer} from 'native-base';

import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Colors from '../constants/Colors';
import CartNumericInput from '../components/CartNumericInput';
import CartItems from '../components/CartItems';
import {withNavigationFocus} from 'react-navigation';

const alert = Alert.alert


class CartScreen extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        quantity: 1
      }
    }

    closeDrawer = () => {
      this.drawer._root.close()
    };

    openDrawer = () => { this.drawer._root.open() };

    handleChangeQuantity = e => this.setState({quantity: e});

    componentWillMount(){
      if(this.props.navigation.getParam("redir")) this.navigation.navigate(this.props.navigation.getParam("redir"));
    }

  render(){
    if(this.props.isFocused){
      StatusBar.setBarStyle("light-content")
    }
    return (
    <Container style={{backgroundColor: "#334"}}>

      <Header style={{backgroundColor: '#334', elevation: 0, marginTop: Constants.statusBarHeight}} noShadow >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
        <Left >
          <Button transparent onPress={()=>this.props.navigation.navigate("Home")}>
            <Feather name="chevron-left" color="#fff" size={30} />
          </Button>
        </Left>

          <Right >
            <Text style={{color: "#fff"}}>GHC {this.props.total}</Text>
          </Right>
        
      </Header>

    <Content style={styles.mainSection} enableOnAndroid>
      
      <View
        style={styles.contentSection}
        >
        <View style={{padding: 15,flex:1, flexDirection: "column"}}>
          <Text style={{color: "#334", fontSize: 24, fontWeight: "bold"}}>Shopping Cart</Text>
          {this.props.cartItems.length <= 0 && (
            <View style={{height: "100%", alignSelf: "flex-start"}}>
              <Text note>Your cart is empty</Text>
            </View>
          )}
          <CartItems entries={this.props.cartItems} />
        </View>
        
      </View>
      
    </Content>
    <Footer style={{backgroundColor: "#fff", paddingHorizontal: 20, height: 100, alignItems: "center", justifyContent: "center"}}>
      <Left style={{flex: 1}}><Text style={{color: "#334", fontWeight: "bold", fontSize: 20}}>GHC {this.props.total}</Text></Left>
      
      <Right style={{flex: 1}}>
        <Button disabled={this.props.cartItems.length <= 0} onPress={()=>{this.props.navigation.navigate("Checkout")}} style={styles.button} icon><Text numberOfLines={1} ajustsFontSizeToFit={true} style={{color: "#fff"}}>CHECKOUT</Text><Icon name="ios-arrow-dropright-circle"/></Button>
      </Right>
    </Footer>
    </Container>
  );
  }

  
}

CartScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 30,
    width: "100%",
  },
  contentSection:{
    padding: 15,
    paddingBottom: 50,
    margin: 0,
    height: "100%"
  },
  headerSection: {
    position: 'absolute',
    flex:1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
    backgroundColor: "#334"
  },
  mainSection: {
    backgroundColor: '#fff',
    color: '#fff',
    padding: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },
  saluteSection: {
    padding: 30,

  },
  sectionTitle: {
    color: "#dedeea",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10
  },
  sectionTitleWithLink: {
    marginTop: 30,
    marginBottom: 0,
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  button: {
    backgroundColor: Colors.tintColor,
    elevation: 10,
    borderRadius: 30,

  }
});

const mapStateToProps = state => {
  return {
    cartItems: state.order.cartItems,
    total: state.order.cartTotal
  }
}


export default connect(mapStateToProps,null)(withNavigationFocus(CartScreen));