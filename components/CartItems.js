import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

import Colors from '../constants/Colors';

import {Body, Left, Right, List, ListItem, Thumbnail, Button, Text} from 'native-base';

import { Feather } from '@expo/vector-icons';
import {connect} from 'react-redux';
import {remove_from_cart, updateQuantity, removeItemAddon} from '../actions/OrderActions';
import CartNumericInput from './CartNumericInput';

const alert = Alert.alert;

class CartItems extends React.Component{
  constructor(props) {
    super(props);
  
    this.state = {};
  }

  removeAddon = (index)=>{
    alert("Remove addon", "Would you like to remove this addon ? ",
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {text: 'Yes, remove', onPress: () => this.props.removeItemAddon(index)},
        ],
        {cancelable: false},
    );
  }

  handleQuantityChange = e => {
    
    let i = e.indexNumber
    let v = e.value
    this.props.updateQuantity(i,v)
  }

  render(){

    return(
      
        <List style={{flex:1,width: "100%"}}>
        {this.props.entries.map((f,i)=>{ return (
          <ListItem thumbnail noIndent noBorder key={f._id} style={styles.listItem}>
            <Left>
              <Thumbnail style={{borderRadius: 15}} square large source={typeof f.image === "string" ? {uri: f.image} : f.image} />
            </Left>
            <Body>
              <Text style={{color: "#334", fontWeight: "bold"}}>{f.name}</Text>
              <Text note numberOfLines={1}>GHC {f.price}</Text>
              {f.selectedAddon._id != "" &&(
                <Text note numberOfLines={1} style={{color: "seagreen"}} onPress={()=>this.removeAddon(i)}>+ {f.selectedAddon.name} (GHC {f.selectedAddon.price})</Text>
              )}
              <CartNumericInput onChangeQuantity={this.handleQuantityChange} updatingIndex={i} default={f.quantity} />
            </Body>
            <Right>
              <Button transparent onPress={()=>this.props.remove_from_cart(i)}>
                <Feather name="minus-circle" size={24} color={Colors.tintColor} />
              </Button>
            </Right>
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
    backgroundColor: "#fff",
  },
})

const mapActionToProps = {
  remove_from_cart,
  updateQuantity,
  removeItemAddon
}

const mapStateToProps = state => {
  return {
    cartItems: state.order.cartItems
  }
}

export default connect(mapStateToProps,mapActionToProps)(CartItems);