import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  AsyncStorage,
  Modal,
  TouchableHighlight
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import Colors from '../constants/Colors';

import {connect} from 'react-redux';
import {logout} from '../actions/AuthActions';

import {Body, Left, Right, List, ListItem, Thumbnail, Button, Text, Card, CardItem, Title, Icon, Spinner} from 'native-base';

class SideBar extends React.Component{
	constructor(props) {
	  super(props);
	
	  this.state = {modalVisible: false, logoutLoading: false};
	}

	_signOutAsync = async () => {
		this.setState({logoutLoading: true})
    	this.props.logout(()=>{this.setState({logoutLoading: false}); this.setModalVisible(false); this.props.navigation.navigate('Auth')});
  };

  confirmSignout = () => {
  	Confirm("Do you really want to sign out ?",()=>{this._signOutAsync()}, ()=>{return null})
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

	render(){
		return(
			<View style={styles.sideBarContainer}>
				<Modal
		          animationType="slide"
		          transparent={true}
		          visible={this.state.modalVisible}
		          onRequestClose={() => {
		            this.setModalVisible(false)
		          }}
		          containerStyle={styles.modal}
		          >
		          <View style={styles.modal}>
		            <View style={styles.modalContent}>
		              <Title style={{color: "#334", marginVertical: 30}}>Would you like to sign out?</Title>
		              <Text note style={{marginBottom: 80}}>You will not receive notifications until you sign in again.</Text>

		              <Button
		                onPress={() => {
		                  this._signOutAsync()
		                }} icon danger style={styles.modalButton}>

		                <Text>Log out</Text>
		                {this.state.logoutLoading && (
		                <Right style={{marginRight: 15}}>
		                  <Spinner color='#fff' size={15}/>
		                </Right>
		              	)}
			              {!this.state.logoutLoading  && (
			                <Icon name="log-out" />
		              	)}
		              </Button>
		              <Button
		                onPress={() => {
		                  this.setModalVisible(false);
		                }} icon warning style={styles.modalButton}>

		                <Text>Cancel</Text>
		                <Icon name="close" />
		              </Button>
		            </View>
		          </View>
		        </Modal>
				<View style={styles.header}>
					<View style={{marginRight: 20}}>
						<Thumbnail source={{uri: "https://ui-avatars.com/api/?name="+this.props.user.name.replace(" ","+")+"&size=512&background=690101"}} />
					</View>
					<View>
						<Text style={{color: "#fff"}}>{this.props.user.name}</Text>
						<Text note numberOfLines={1} color="#fff">{this.props.user.email}</Text>
					</View>
				</View>
					<View style={{flex: 1, width: "100%"}}>
						<ListItem icon onPress={()=>{this.props.drawerItem._root.close(); this.props.navigation.navigate("Settings")}} >
							<Left>
								<Feather name="user" color={Colors.tintColor} size={21} />
							</Left>
							<Body>
								<Text style={{color: "#334"}} >MY ACCOUNT</Text>
							</Body>
							<Right>
								<Feather name="chevron-right" color={Colors.tintColor} size={21} />
							</Right>
						</ListItem>
						<ListItem icon onPress={()=>this.props.navigation.navigate("History")}>
							<Left>
								<Feather name="clock" color={Colors.tintColor} size={21} />
							</Left>
							<Body>
								<Text style={{color: "#334"}} >MY ORDERS</Text>
							</Body>
							<Right>
								<Feather name="chevron-right" color={Colors.tintColor} size={21} />
							</Right>
						</ListItem>
						<ListItem icon onPress={()=>this.props.navigation.navigate("Help")}>
							<Left>
								<Feather name="help-circle" color={Colors.tintColor} size={21} />
							</Left>
							<Body>
								<Text style={{color: "#334"}} >HELP</Text>
							</Body>
							<Right>
								<Feather name="chevron-right" color={Colors.tintColor} size={21} />
							</Right>
						</ListItem>
						<ListItem icon onPress={()=>this.setModalVisible()}>
							<Left>
								<Feather name="log-out" color={Colors.tintColor} size={21} />
							</Left>
							<Body>
								<Text style={{color: "crimson"}} >LOGOUT</Text>
							</Body>
							<Right>
								<Feather name="chevron-right" color={Colors.tintColor} size={21} />
							</Right>
						</ListItem>
					</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	sideBarContainer: {
		flex: 1,
		alignItems: "flex-start",
		backgroundColor: "#fff"
	},
	header: {
		backgroundColor: "#334",
		height: 250,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		width: "100%",
	},
	modal: {
		width: "100%",
		alignItems: "center",
		justifyContent: "flex-end",
		flexDirection: "column",
		backgroundColor: "#000000aa",
		flex: 1,
		marginTop: -20,
	},
	modalContent: {
		height: "50%",
		width: "100%",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		backgroundColor: "#fff",
		padding: 15
	},
	modalButton: {
		marginVertical: 20,
		borderRadius: 30,
		elevation: 20
	}
})

const mapStateToProps = state => {
	return {
		token: state.auth.userToken,
		user: state.auth.user
	}
}

const mapActionToProps = {
	logout
}

export default connect(mapStateToProps,mapActionToProps)(SideBar);