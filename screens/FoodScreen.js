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
  Alert
} from 'react-native';

import {connect} from 'react-redux';
import {add_to_cart} from '../actions/OrderActions';

import {Header,Container, Body, Content, Left, Right, Title, Button, Text, Item, Input, Icon, Drawer, Thumbnail} from 'native-base';

import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Colors from '../constants/Colors';
import Carousel from 'react-native-snap-carousel';
import RecommendedSlider from '../components/RecommendedSlider';
import StarterPackMenu from '../components/StarterPackMenu';
import SideBar from '../components/SideBar';
import CartNumericInput from '../components/CartNumericInput';
import Addons from '../components/Addons';

const alert = Alert.alert

const isInCart = (id,objArray) => {
  let obj = objArray.find(obj => obj.foodID == id);
  console.log(obj);
  if(obj !== undefined) return true
    else return false
}

class FoodScreen extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        quantity: 1,
        image: typeof props.navigation.getParam("food").image === "string" ? {uri: props.navigation.getParam("food").image} : props.navigation.getParam("food").image,
        selectedAddon: {_id: "", price: 0, name: ""},
      }
    }

    closeDrawer = () => {
      this.drawer._root.close()
    };

    openDrawer = () => { this.drawer._root.open() };

    handleChangeQuantity = e => this.setState({quantity: e});

    handleSelectAddon = a => this.setState({selectedAddon: {_id: a._id, price: a.price, name: a.name}})

  render(){
    food = this.props.navigation.getParam("food");
    return (
    <Container style={{backgroundColor: food.bg ? food.bg : null}} >

      <Header noShadow style={{backgroundColor: 'transparent', zIndex: 1000, elevation:0, marginTop: Constants.statusBarHeight}} >
        <StatusBar barStyle={food.statusBarStyle ? food.statusBarStyle : "dark-content"} backgroundColor="transparent" translucent={true}/>
        <Left>
          <Button onPress={()=>this.props.navigation.goBack()} transparent>
            <Feather name="chevron-left" size={30} color={food.statusBarStyle && food.statusBarStyle == "light-content" ? "#fff" : Colors.tintColor} />
          </Button>
        </Left>

          <Body />

          <Right />
        
      </Header>

    <View style={[styles.container,{backgroundColor: food.bg ? food.bg : "#fff"}]}>
    
    <View style={styles.headerSection}>
        <Image
          resizeMode='contain'
          source={this.state.image}
          style={{width: "100%", height: 1600, resizeMode: "contain"}} //food.bg ? {width: 250,height: 250, backgroundColor: food.bg} this
        />
    </View>
    <Content style={styles.mainSection}>
      
      <View
        style={styles.contentSection}
        >
        <View style={{padding: 15}}>
          <Text style={{color: "#334", fontSize: 24, fontWeight: "bold"}}>{food.name}</Text>
          <Text style={{marginTop: 20}}>{food.description}</Text>

          <View style={styles.sectionTitleWithLink}>
          <View>
            <Text style={styles.sectionTitle}>ADDONS</Text>
            <Addons addonList={food.addons} onPress={this.handleSelectAddon}/>
            
          </View>
          <View style={{alignItems: "center"}}>
            <Text style={styles.sectionTitle}>QUANTITY</Text>
            <CartNumericInput onChangeQuantity={this.handleChangeQuantity}/>
          </View>

          </View>
          
        </View>
        <Button disabled={isInCart(food.foodID,this.props.cartItems)} onPress={()=>{this.props.add_to_cart(food,this.state.quantity,this.state.selectedAddon)}} style={[styles.button,{backgroundColor: isInCart(food.foodID,this.props.cartItems) ? "seagreen" : Colors.tintColor}]} icon><Text>GHC { (food.price + this.state.selectedAddon.price) * this.state.quantity}</Text><Text style={{color: "#fff"}}>{isInCart(food.foodID,this.props.cartItems) ? "ADDED TO CART" : "ADD TO CART"}</Text><Icon name={isInCart(food.foodID,this.props.cartItems) ? "ios-checkmark-circle" :"ios-arrow-dropright-circle"}/></Button>
      </View>
      
    </Content>

    </View>
    </Container>
  );
  }

  
}

FoodScreen.navigationOptions = {
  header: null,
};

function RadioButton(props) {
  return (
      <View style={[{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#dedeea',
        alignItems: 'center',
        justifyContent: 'center',
      }, props.style]}>
        {
          props.selected ?
            <View style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: '#dedeea',
            }}/>
            : null
        }
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    zIndex: -1
  },
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
    position: 'relative',
    height: 350,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  mainSection: {
    backgroundColor: '#fff',
    color: '#fff',
    padding: 0,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    zIndex: 1,
    marginTop: -50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 40,
    },
    shadowOpacity: 0.60,
    shadowRadius: 12.32,

    elevation: 20,
  },
  saluteSection: {
    padding: 30,

  },
  imgHeader: {
    width: '100%',
    position: 'absolute',
    zIndex: 0
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
    elevation: 20,
    borderRadius: 30
  }
});

const mapStateToProps = state => {
  return {
    cartItems: state.order.cartItems
  }
}

const mapActionToProps = {
  add_to_cart
}

export default connect(mapStateToProps,mapActionToProps)(FoodScreen);