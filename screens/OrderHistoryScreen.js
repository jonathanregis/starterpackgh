import React from 'react';
import {ListItem, List, Left, Body, Right, Container, Content, Header, Button, Icon, Title, Text} from 'native-base';
import {StatusBar, View} from 'react-native';
import Colors from '../constants/Colors';
import Constants from 'expo-constants';
import {Feather} from '@expo/vector-icons';
import _ from 'lodash';
import moment from 'moment';
import {API_URL} from '../constants/Redux';
import {connect} from 'react-redux';

class OrderHistoryScreen extends React.Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	orders: {}
	  }
	}

	componentDidMount(){
		fetch(API_URL + "/buyer/orders/",{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer "+this.props.token
			}
		})
		.then(response=>response.json())
		.then(res=>{res.orders.forEach((i,index)=>i.date = i.createdAt.split("T")[0]);this.setState({orders: _.groupBy(res.orders,'date')})})
	}

	render(){
		return(
			<Container>
				<Header style={{backgroundColor: "#fff", marginTop: Constants.statusBarHeight}} noShadow>
					<StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
					<Left>
						<Button transparent>
							<Icon style={{color: "#334"}} type="Feather" name="chevron-left" size={30} onPress={()=>this.props.navigation.goBack()}/>
						</Button>
					</Left>
					<Body>
						<Title style={{color: "#334"}}>Order history</Title>
					</Body>
					<Right />
				</Header>
				<Content enableOnAndroid>
					<List>
						{Object.keys(this.state.orders).reverse().map((key,index)=>{return[
							<ListItem key={Math.random()+index} itemDivider first>
								<Text note>{moment(key).calendar(null).split(" at ")[0]}</Text>
							</ListItem>,
							<ShowListFromDate key={Math.random()} list={this.state.orders[key]} />
						]})}
					</List>
				</Content>
			</Container>
		)
	}
}

OrderHistoryScreen.navigationOptions = {
	header: null
}

function ShowListFromDate(props){
	var arr = props.list;
	var newArr = [...arr];
	return (
		newArr.map((order,i)=>(
			<ListItem first={i == 0} last={i == newArr.length - 1} key={i} style={{alignItems: "flex-start", justifyContent: "flex-start"}}>
				<Left style={{flex:1, flexDirection: "column",alignItems: "flex-start",justifyContent:"flex-start"}}>
					<Title style={{color: "#334"}}>#{order.payment['order-id']}</Title>
					<Text note numberOfLines={1} style={{justifyContent: "flex-start", alignSelf: "flex-start", textAlign: "left"}}>{order.delivery.destination}</Text>
					<View note style={{marginTop: 5, flexDirection: "row", justifyContent: "flex-start",alignItems: "flex-start"}}><Icon name="check-circle" type="Feather" style={{color:"seagreen"}} /><Text note> Successful</Text></View>
				</Left>
				<Right style={{flex: 1,flexDirection: "column"}}>
					<Text>GHC {order.payment.amount}</Text>
					<Text> </Text>
					<Button transparent disabled style={{borderColor: Colors.tintColor, borderWidth: 1,borderRadius: 30}}>
						<Text note style={{color: Colors.tintColor}} >{order.payment.method}</Text>
					</Button>
				</Right>
			</ListItem>
		))
	)
}

const mapStateToProps = state => {
	return {
		token: state.auth.token,
	}
}

export default connect(mapStateToProps,null)(OrderHistoryScreen);