import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';

import Colors from '../constants/Colors';
import {Body, Left, Right, List, ListItem, Thumbnail, Button, Text} from 'native-base';
import { Feather } from '@expo/vector-icons';
import {connect} from 'react-redux';
import {add_to_cart} from '../actions/OrderActions';
import CartNumericInput from './CartNumericInput';

const alert = Alert.alert;

const isInCart = (id,objArray) => {
  let obj = objArray.find(obj => obj._id == id);
  if(obj !== undefined) return true
    else return false
}

const isInNoAddList = (id,objArray) => {
  let obj = objArray.find(obj => obj._id == id);
    if(obj !== undefined) return true
    else return false
}

class StarterPackMenu extends React.Component{
  constructor(props) {
    super(props);
  
    this.state = {};
  }

  render(){
    return(
      <List style={{flex:1,width: "100%"}}>
        {this.props.entries.map((f,i)=>{ 
          if(i >= this.props.limit) return null;
          return (
          <ListItem thumbnail noIndent noBorder key={f._id} style={styles.listItem} onPress={this.props.preventClick ? null : ()=>this.props.navigation.navigate("Food",{food: f})}>
            <Left>
              <Thumbnail style={{borderRadius: 15}} square source={{uri: f.image}} />
            </Left>
            <Body>
              <Text style={{color: "#334", fontWeight: "bold"}}>{f.name}</Text>
              <Text note numberOfLines={1}>GHC {f.price}</Text>
              {undefined != this.props.quantityAction &&(
                <CartNumericInput disabled={isInNoAddList(f._id,this.props.noAddList)} onChangeQuantity={this.props.quantityAction} updatingId={f._id} />
              )}
            </Body>
            {undefined == this.props.noAddList &&(
              <Right>
                <Button disabled={isInCart(f._id,this.props.cartItems)} transparent onPress={undefined != this.props.customPlusAction ? ()=>this.props.customPlusAction(f) : ()=>{this.props.add_to_cart(f,1,{_id: "", price: 0, name: ""}); alert("Added to cart",f.name+" has been added to your cart")}}>
                  <Feather name={isInCart(f._id,this.props.cartItems) ? "check-circle" : "plus-circle"} size={24} color={isInCart(f._id,this.props.cartItems) ? "seagreen" : Colors.tintColor} />
                </Button>
              </Right>
            )}

            {undefined != this.props.noAddList &&(
              <Right>
                <Button transparent onPress={()=>this.props.customPlusAction(f)}>
                  <Feather name={isInNoAddList(f._id,this.props.noAddList) ? "minus-circle" : "plus-circle"} size={24} color={Colors.tintColor} />
                </Button>
              </Right>
            )}
            
          </ListItem>
          )})}
      </List>
    )
  }

}

const styles = StyleSheet.create({
  listItem: {
    borderColor: "#eeeefa",
    borderRadius: 20,
    borderWidth: 1,
    margin: 10,
    marginHorizontal: 0,
    backgroundColor: "#fff"
  },
})

const mapStateToProps = state =>{
  return{
    cartItems: state.order.cartItems,
  }
}

const mapActionToProps = {
  add_to_cart
}

export default connect(mapStateToProps,mapActionToProps)(StarterPackMenu);