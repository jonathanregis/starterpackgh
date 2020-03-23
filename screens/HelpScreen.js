import React from 'react';
import {ListItem, List, Left, Body, Right, Container, Content, Header, Button, Icon, Title, Text} from 'native-base';
import {StatusBar, View, Platform, StyleSheet, Linking} from 'react-native';
import Colors from '../constants/Colors';
import Constants from 'expo-constants';
import {Feather} from '@expo/vector-icons';

export default class HelpScreen extends React.Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	
	  }
	}

	render(){
		return(
			<Container>
				<Header style={{backgroundColor: "#fff", borderBottomWidth: 0, marginTop: Platform.OS !== "ios" ? Constants.statusBarHeight : 0}} noShadow noBorder>
					<StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
					<Left>
						<Button transparent>
							<Icon style={{color: "#334"}} type="Feather" name="chevron-left" size={30} onPress={()=>this.props.navigation.goBack()}/>
						</Button>
					</Left>
					<Body>
						<Title style={{color: "#334"}}>Help</Title>
					</Body>
					<Right />
				</Header>
				<Content enableOnAndroid>
					<View style={styles.helpWrapper}>
						<Text style={styles.sectionTitle}>NEED ASSISTANCE ?</Text>
						<Text>Contact us on any of these channels and we will be glad to assist you.</Text>
						<Text style={styles.sectionTitle}>MOBILE NUMBER</Text>
						<Text>+233 55 727 4088</Text>
						<Button style={styles.button} onPress={()=>Linking.openURL("tel:+233557274088")}><Text>Call now</Text></Button>
						<Text style={styles.sectionTitle}>OUR EMAIL</Text>
						<Text>info@starterpackgh.com</Text>
						<Button style={styles.button} onPress={()=>Linking.openURL("mailto:info@starterpackgh.com")}><Text>Email us</Text></Button>
						<Text style={styles.sectionTitle}>OUR WEBSITE</Text>
						<Text>www.starterpackgh.com</Text>
						<Button style={styles.button} onPress={()=>Linking.openURL("https://starterpackgh.com")}><Text>Open website</Text></Button>
					</View>
				</Content>
			</Container>
		)
	}
}

HelpScreen.navigationOptions = {
	header: null
}

const styles = StyleSheet.create({
	sectionTitle: {
    color: "#334",
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 10
  },
  button: {
  	backgroundColor: Colors.tintColor,
  	color: "#fff",
  	borderRadius: 30,
  	marginVertical: 5
  },
  helpWrapper: {
  	flex: 1,
  	justifyContent: "center",
  	padding: 15
  }
})