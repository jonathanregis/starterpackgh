import React from 'react';
import {Feather} from '@expo/vector-icons';
import {View, StyleSheet} from 'react-native';
import {Icon, Button, Input, Text} from 'native-base';
import Colors from '../constants/Colors';

export default class CartNumericInput extends React.Component{
	constructor(props) {
	  super(props);
	
	  this.state = {value: this.props.default ? this.props.default : 1};
	  
	}

	_decrease = () => {
		if(this.state.value < 2) return null;
		if(this.props.updatingIndex >= 0 || this.props.updatingId != undefined){
			this.props.onChangeQuantity({value: this.state.value - 1, indexNumber: this.props.updatingIndex, id: this.props.updatingId})
		}
		else{
			this.props.onChangeQuantity(this.state.value - 1)
		}
		this.setState({value: this.state.value - 1})
	}

	_increase = () => {
		if(this.props.updatingIndex >= 0 || this.props.updatingId != undefined){
			this.props.onChangeQuantity({value: this.state.value + 1, indexNumber: this.props.updatingIndex, id: this.props.updatingId})
		}
		else{
			this.props.onChangeQuantity(this.state.value + 1);
		}
		this.setState({value: this.state.value + 1})
	}

	render(){
		return(
			<View style={styles.mainWrapper}>
				<Button onPress={()=>this._decrease()} transparent disabled={this.props.disabled != undefined ? this.props.disabled : false} style={this.props.disabled == true ? {opacity: 0.4} : null} >
					<Feather name="minus-circle" size={20} color={Colors.tintColor} />
				</Button>
				<Text style={{fontWeight: "bold", color: "#334", fontSize: 20, marginHorizontal: 20}}>{this.state.value}</Text>
				<Button onPress={()=>this._increase()} transparent disabled={this.props.disabled != undefined ? this.props.disabled : false} style={this.props.disabled == true ? {opacity: 0.4} : null} >
					<Feather name="plus-circle" size={20} color={Colors.tintColor} />
				</Button>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	mainWrapper: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start"
	},
})