import React from 'react';
import { Feather, FontAwesome } from '@expo/vector-icons';
import {Badge} from 'native-base';
import {View,Text} from 'react-native';
import {connect} from 'react-redux';

import Colors from '../constants/Colors';

class TabBarIcon extends React.Component {

	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render(){
		return (
	  	<View style={{position: "relative"}}>
	    <Feather
	      name={this.props.name}
	      size={20}
	      style={{ marginBottom: -3 }}
	      color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
	    />
	    {this.props.cartItems.length > 0 && this.props.notify && (
	    	<FontAwesome name="circle" color="red" size={10} style={{position: "absolute",top: -5,right: -5}} />
		)}
	    </View>
	  );
	}
}

const mapStateToProps = state => {
	return{
		cartItems: state.order.cartItems
	}
}

export default connect(mapStateToProps,null)(TabBarIcon);
