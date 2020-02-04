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
} from 'react-native';

import {Header,Container, Body, Content, Left, Right, Title, Button, Text, Item, Input, Icon, Drawer} from 'native-base';

import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Colors from '../constants/Colors';
import Carousel from 'react-native-snap-carousel';
import RecommendedSlider from '../components/RecommendedSlider';
import StarterPackMenu from '../components/StarterPackMenu';
import SideBar from '../components/SideBar';
import { withNavigationFocus } from 'react-navigation';
import store from '../store';
import {API_URL} from '../constants/Redux';


 class HomeScreen extends React.Component {

    constructor(props){
      super(props);
      this.state = {entries: [],
        searchActive: false,
        menuEntries: [],
        searchTerm: "",
        headerBgColor: "transparent"
      }
    }

    componentDidMount(){
      fetch(API_URL +"/meals/")
      .then(response=>response.json())
      .then(response=>{
        this.setState({menuEntries: response.meals, entries: response.meals.slice(0,3)})
      })
    }

    isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y >= 230;
  };

    closeDrawer = () => {
      this.drawer._root.close()
    };

    openDrawer = () => { this.drawer._root.open() };


  render(){
    if(this.props.isFocused){
      StatusBar.setBarStyle("light-content")
      StatusBar.setBackgroundColor(this.state.headerBgColor)
    }
    return (
    <Drawer ref={(ref) => { this.drawer = ref; }} content={<SideBar drawerItem={this.drawer} navigation={this.props.navigation} />} onClose={() => this.closeDrawer()} >
    <Container>
    {this.state.searchActive && (
      <Header noShadow style={{backgroundColor: this.state.headerBgColor, zIndex: 1000, elevation:0, marginTop: Constants.statusBarHeight}} searchBar rounded>
        <StatusBar barStyle="light-content" backgroundColor={this.state.headerBgColor} translucent={true}/>
        <Left>
          <Button transparent onPress={()=>this.setState({searchActive: false})}>
            <Feather name="x-circle" size={30} color="#fff" />
          </Button>
        </Left>
        <Item style={{borderRadius: 30, backgroundColor: "#ffffffcc"}}>
          <Input returnKeyType="search" placeholder="Search" onChangeText={(x) => this.setState({searchTerm: x})} onSubmitEditing={()=>this.props.navigation.navigate("Menu",{term: this.state.searchTerm})}
  clearButtonMode="while-editing" />
          <Icon name="search" onPress={()=>this.props.navigation.navigate("Menu",{term: this.state.searchTerm})} />
        </Item>
        
      </Header>
    )}

    {!this.state.searchActive && (
      <Header noShadow style={{backgroundColor: this.state.headerBgColor, zIndex: 1000, elevation:0, marginTop: Constants.statusBarHeight}} >
        <StatusBar barStyle="light-content" backgroundColor={this.state.headerBgColor} translucent={true}/>
        <Left>
          <Button onPress={()=>this.openDrawer()} transparent>
            <Feather name="bar-chart-2" size={30} color="#fff" style={{transform: [{ rotate: "90deg" }]}}/>
          </Button>
        </Left>

          <Body>
            <Title style={{color: "#fff", fontWeight: "bold", fontSize: 18}}>STARTERPACK</Title>
          </Body>

          <Right>
            <Button transparent onPress={()=>this.setState({searchActive: true})}>
              <Feather name="search" size={30} color="#fff" />
            </Button>
          </Right>
        
      </Header>
    )}

    <View style={styles.container}>
    
    <View style={styles.headerSection}>
        <Image
          style={styles.imgHeader}
          resizeMode='contain'
          source={require('../assets/images/banner.png')}
        />
    </View>
    <Content style={styles.mainSection} onScroll={({ nativeEvent }) => {
            if (this.isCloseToTop(nativeEvent)) {
              this.setState({headerBgColor: "#334"})
            }
            else {
              this.setState({headerBgColor: "transparent"})
            }
          }} >
      <View style={styles.saluteSection}>
        <Text style={{color: Colors.tintColor, fontSize: 18, fontWeight: 'bold'}}>Welcome, {store.getState().auth.user.name}</Text>
      </View>
      
      <View
        style={styles.contentSection}
        >
        <View>

          <Text style={styles.sectionTitle}>MAKE YOUR BREAKFAST</Text>
          <Text note>You can make your own breakfast pack by choosing different items provided.</Text>
          <Button onPress={()=>this.props.navigation.navigate("Builder")} style={{backgroundColor: Colors.tintColor,borderRadius: 30, marginTop: 20}}>
            <Text>Make your breakfast</Text>
          </Button>

          <View style={styles.sectionTitleWithLink}>
            <Text style={styles.sectionTitle}>FULLY LOADED MENU</Text>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("Menu")}>
              <Text style={{color: Colors.tintColor}}>VIEW ALL <Feather size={15} name="chevron-right" color={Colors.tintColor} /></Text>
            </TouchableOpacity>
          </View>
          <StarterPackMenu navigation={this.props.navigation} entries={this.state.menuEntries} limit={5} />

        </View>
      </View>
    </Content>
    </View>
    </Container>
    </Drawer>
  );
  }

  
}

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    zIndex: -1,
  },
  contentContainer: {
    paddingTop: 30,
    width: "100%",
  },
  contentSection:{
    backgroundColor: '#fff',
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    padding: 15,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 40,
    },
    shadowOpacity: 0.60,
    shadowRadius: 12.32,

    elevation: 20,
    flex: 1
  },
  headerSection: {
    position: 'absolute',
    height: 210,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  mainSection: {
    color: '#fff',
    padding: 0,
    zIndex: 1,
    flex: 1,
    maxWidth: 700
  },
  saluteSection: {
    padding: 30,
    marginTop: 250,
    backgroundColor: '#eee0cb',
    paddingBottom: 60,
    marginBottom: -30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    elevation: 20
  },
  imgHeader: {
    width: '100%',
    position: 'absolute',
    zIndex: 0,
  },
  sectionTitle: {
    color: "#dedeea",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10
  },
  sectionTitleWithLink: {
    marginTop: 30,
    marginBottom: 10,
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
  },
});

export default withNavigationFocus(HomeScreen);