import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {List, ListItem, Left, Right, Body, Text, Button, Icon, Title, Thumbnail} from 'native-base';
import {connect} from 'react-redux';
import Colors from '../constants/Colors';
import store from '../store';

class DebitCardsList extends React.Component{
	constructor(props){
		super(props);

		this.state = {}
	}

	render(){
		const cardslist = this.props.cards;
		const item = cardslist[this.props.single];
		return(
			<List>
				<ListItem thumbnail style={styles.item} noBorder noIndent>
					<Left>
						{item.type == "visa" && (
						<Thumbnail square large source={require('../assets/images/visa.png')} />
						)}
						{item.type == "mastercard" && (
						<Thumbnail square large source={require('../assets/images/mastercard.png')} />
						)}
					</Left>
					<Body>
						<Text note>EXPIRE {item.expiry.slice(0, 2) + "-" + item.expiry.slice(2)}</Text>
						<Text style={{color: "#334", fontWeight: "bold", fontSize: 16}}>**** **** **** {item.number.substr(12,16)}</Text>
					</Body>
					<Right style={{justifyContent: "flex-start"}}>
						<TouchableOpacity onPress={()=>this.props.changeAction(cardslist)}>
							<Text note style={{color: Colors.tintColor}}>CHANGE</Text>
						</TouchableOpacity>
					</Right>
				</ListItem>
			</List>
		)
	}
}

const mapStateToProps = state => {
	return {
		cards: state.order.debitCards
	}
}

const styles = StyleSheet.create({
	item: {
		backgroundColor: "#fff",
		borderRadius: 30,
		borderWidth: 1,
		borderColor: "#dedeea",
	}
})

export default connect(mapStateToProps,null)(DebitCardsList);