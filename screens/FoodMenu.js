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

import {Header,Container, Body, Content, Left, Right, Title, Button, Text, Item, Input, Icon, Drawer, Thumbnail, Footer} from 'native-base';

import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Colors from '../constants/Colors';
import CartNumericInput from '../components/CartNumericInput';
import CartItems from '../components/CartItems';
import StarterPackMenu from '../components/StarterPackMenu';
import {API_URL} from '../constants/Redux';

const alert = Alert.alert


class FoodMenu extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        menuItems: [],
        searchActive: this.props.navigation.getParam("term","") == "" ? false : true,
        searchTerm: this.props.navigation.getParam("term",""),
      }
    }

    componentDidMount(){
      fetch(API_URL +"/meals/")
      .then(response=>response.json())
      .then(response=>{
        this.setState({menuItems: response.meals})
      })
    }

    closeDrawer = () => {
      this.drawer._root.close()
    };

    openDrawer = () => { this.drawer._root.open() };

    handleChangeQuantity = e => this.setState({quantity: e});

    

    search = (keyword) => {
        var search_fields = ['description'];
        var data = this.state.menuItems

        if(keyword.length<1) // skip if input is empty
            return

        var results = []

        for(var i in data){ // iterate through dataset
            for(var u=0;u<search_fields.length;u++){ // iterate through each key in dataset

                var rel = getRelevance(data[i][search_fields[u]],keyword) // check if there are matches

                if(rel==0) // no matches...
                    continue // ...skip

                results.push({relevance:rel,entry:data[i]}) // matches found, add to results and store relevance
            }
        }

        results.sort(compareRelevance) // sort by relevance

        for(i=0;i<results.length;i++){
            results[i] = results[i].entry // remove relevance since it is no longer needed
        }

        return results
    }

  render(){
    return (
    <Container style={{backgroundColor: "#334"}}>

      <Header style={{backgroundColor: '#334', elevation: 0, marginTop: Constants.statusBarHeight}} noShadow searchBar rounded>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true}/>
        <Left style={!this.state.searchActive ? {flex: 1} : null}>
          <Button transparent onPress={this.state.searchActive ? ()=>this.setState({searchActive: false, searchTerm: ""}) : ()=>this.props.navigation.goBack() }>
            <Feather name={this.state.searchActive ? "x-circle" : "chevron-left"} color="#fff" size={30} />
          </Button>
        </Left>
        
        {!this.state.searchActive && (
          <Body style={{alignItems: "center", flex: 1}}>
            <Title>Menu</Title>
          </Body>
        )}

        {!this.state.searchActive && (
          <Right style={{alignItems: "center", flex: 1}}>
            <Button transparent onPress={()=>this.setState({searchActive: true}) } >
              <Feather name="search" size={30} color="#fff" />
            </Button>
          </Right>
        )}
        
        {this.state.searchActive && (
            <Item style={{borderRadius: 30, backgroundColor: "#ffffff88"}}>
              <Input defaultValue={this.props.navigation.getParam("term","")} returnKeyType="search" placeholder="Search" onChangeText={(x) => this.setState({searchTerm: x})} clearButtonMode="while-editing" />
              <Icon name="search" />
            </Item>
          )}
        
      </Header>

    <Content style={styles.mainSection} enableOnAndroid>
      
      <View
        style={styles.contentSection}
        >
        <View style={{padding: 15,flex:1}}>
          <Text numberOfLines={1} style={styles.sectionTitle}>{this.state.searchActive && this.state.searchTerm != "" ? "Results for: " + this.state.searchTerm : "OUR MENU"}</Text>
          <StarterPackMenu entries={this.state.searchActive && this.state.searchTerm != "" ? this.search(this.state.searchTerm) : this.state.menuItems} navigation={this.props.navigation} />
        </View>
        
      </View>
      
    </Content>
    </Container>
  );
  }

  
}

FoodMenu.navigationOptions = {
  header: null,
};

const getRelevance = (value,keyword) => {
    value = value.toLowerCase() // lowercase to make search not case sensitive
    keyword = keyword.toLowerCase()

    var index = value.indexOf(keyword) // index of the keyword
    var word_index = value.indexOf(' '+keyword) // index of the keyword if it is not on the first index, but a word

    if(index==0) // value starts with keyword (eg. for 'Dani California' -> searched 'Dan')
        return 3 // highest relevance
    else if(word_index!=-1) // value doesnt start with keyword, but has the same word somewhere else (eg. 'Dani California' -> searched 'Cali')
        return 2 // medium relevance
    else if(index!=-1) // value contains keyword somewhere (eg. 'Dani California' -> searched 'forn')
        return 1 // low relevance
    else
        return 0 // no matches, no relevance
}

const compareRelevance = (a, b) => {
  return b.relevance - a.relevance
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
    borderTopRightRadius: 30,
    elevation: 20
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
    cartItems: state.order.cartItems,
    total: state.order.cartTotal
  }
}


export default connect(mapStateToProps,null)(FoodMenu);