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

import {Header,Container, Body, Content, Left, Right, Title, Button, Text, Item, Input, Icon, Drawer, Thumbnail, Footer, Tab, Tabs, ScrollableTab} from 'native-base';

import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Colors from '../constants/Colors';
import CartItems from '../components/CartItems';
import StarterPackMenu from '../components/StarterPackMenu';
import {API_URL} from '../constants/Redux';
import {add_to_cart} from '../actions/OrderActions';
import _ from "lodash";
import update from "immutability-helper";

const alert = Alert.alert


class FoodBuilder extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        menuItems: [],
        pack: [],
        quantities: {}
      }
    }

    componentDidMount(){
      fetch(API_URL +"/foods/")
      .then(response=>response.json())
      .then(response=>{
        this.setState({menuItems: response.foods})
      })
    }
    getGenIndex = val =>{
      return findWithAttr(this.state.pack,"_id",val);
    }
    handleChangeQuantity = e => this.setState({quantities:  update(this.state.quantities,{[e.id]:{$set: e.value}}),pack: this.state.pack[this.getGenIndex(e.id)] >= 0 ? update(this.state.pack,{[this.getGenIndex(e.id)]: {quantity: {$set: e.value}}}) : [...this.state.pack] });

    addToPack = f => {
      if(this.state.pack.find(obj => obj._id == f._id) != undefined){
        this.removeFood(f._id);
      }
      else{
        this.setState({pack: [...this.state.pack,{...f,foodID:f._id,quantity:this.state.quantities[f._id] || 1}]});
      }
    }

    addMeal = ()=>{
      this.state.pack.forEach((f,i)=>{
        this.props.add_to_cart(f,this.state.pack[i].quantity,{_id: "",price:0,name:""});
      })
      this.setState({pack: []});
      alert("Successfully added","Your custom breakfast has been added to your cart");
    }

    removeFood(id) {
      this.setState({pack: this.state.pack.filter(function(food) { 
        return food._id !== id
      })});
    }

  render(){
    var sortedArray = _.groupBy(this.state.menuItems,value=>{return value.category.name});
    return (
    <Container style={{backgroundColor: "#fff"}}>

      <Header hasTabs style={{backgroundColor: '#334', elevation: 0, borderBottomWidth: 0, marginTop: Platform.OS !== "ios" ? Constants.statusBarHeight : 0}} noShadow>
        <StatusBar barStyle="light-content" backgroundColor="#334" translucent={true}/>
        <Left >
          <Button transparent onPress={()=>this.props.navigation.goBack() }>
            <Feather name="chevron-left" color="#fff" size={30} />
          </Button>
        </Left>
        <Body >
          <Title>Custom breakfast</Title>
        </Body>
        {this.state.pack.length > 0 && (
          <Right>
            <Button transparent icon onPress={this.addMeal}>
              <Text>Done</Text>
              <Icon type="Feather" name="check-circle" />
            </Button>
          </Right>
        )}
        
      </Header>
        <Tabs tabBarUnderlineStyle={{backgroundColor: Colors.tintColor,borderRadius: 5}} renderTabBar={() => <ScrollableTab style={{ borderBottomWidth: 0, backgroundColor: "#fff"}} />}>
          {Object.keys(sortedArray).map((key,index)=>{
            return <Tab heading={key} key={index} textStyle={{color: Colors.tintColor}} activeTextStyle={{color: Colors.tintColor}} tabStyle={{backgroundColor: "#fff"}} activeTabStyle={{backgroundColor: "#fff"}}>
            <Content style={styles.mainSection} enableOnAndroid>
            <StarterPackMenu preventClick={true} entries={sortedArray[key]} navigation={this.props.navigation} quantityAction={this.handleChangeQuantity} customPlusAction={this.addToPack} noAddList={this.state.pack}/>
            </Content>
            </Tab>
          })
          }
        </Tabs>
    <Footer style={{backgroundColor: "#fff", padding: 10, height: 100,flexDirection: "row",justifyContent: "space-between"}}>
      <View style={{flex:1}}>
        <Text style={styles.sectionTitle}>Total</Text>
        <Text>GHC {_.sumBy(this.state.pack,x => x.price*x.quantity)}</Text>
      </View>
      <View style={{flex:1,alignItems: "flex-end"}}>
        <Text style={styles.sectionTitle}>Items</Text>
        <Text note numberOfLines={1}>{this.state.pack.map((item,index)=>{return index == this.state.pack.length - 1 ? item.name+"": item.name+", "})}</Text>
      </View>
    </Footer>
    </Container>
  );
  }

  
}

FoodBuilder.navigationOptions = {
  header: null,
};
function findWithAttr(array,attr,value) {
  var ret = -1;
    for(var i = 0; i < array.length; i++) {
        if(array[i][attr] == value) {
            ret = i;
            break;
        }
    }
    return ret;
}
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
    user: state.auth.user,
  }
}

const mapActionToProps = {
  add_to_cart
}


export default connect(mapStateToProps,mapActionToProps)(FoodBuilder);