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
  Easing,
  Animated
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
import {updateMenu} from '../actions/OrderActions';
import {API_URL} from '../constants/Redux';
import {Root, Popup} from 'popup-ui';
import {connect} from 'react-redux';
import moment from 'moment';


 class HomeScreen extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        searchActive: false,
        menuEntries: [],
        searchTerm: "",
        headerBgColor: "transparent",
        isLeftSide: false
      }
      this.animatedValue = new Animated.Value(1);
    }

    componentDidMount(){
      fetch(API_URL +"/meals/")
      .then(response=>response.json())
      .then(response=>{
        this.setState({menuEntries: response.meals})
        this.props.updateMenu(response.meals);
      })
      fetch("https://worldtimeapi.org/api/timezone/africa/accra")
      .then(response => response.json())
      .then(res => {
        let currentTime = moment(res.datetime);
        let prepareCloseTime = moment(res.datetime);
        prepareCloseTime.set("hour",11);
        prepareCloseTime.set("minute",1);
        let closeTime = prepareCloseTime;
        let isClosed = currentTime.isAfter(closeTime);

        if(res.day_of_week == 0 || res.day_of_week == 6 || isClosed){
          Popup.show({
            type: 'Warning',
            title: 'We\'re closed at this time',
            button: true,
            textBody: 'Please note that our service ends at 11 AM. All orders made after 11 AM will be considered for the next day.\n𝙒𝙚 𝙖𝙧𝙚 𝙖𝙡𝙨𝙤 𝙘𝙡𝙤𝙨𝙚𝙙 𝙤𝙣 𝙬𝙚𝙚𝙠𝙚𝙣𝙙𝙨.',
            buttontext: 'Continue',
            callback: () => Popup.hide()
          })
        }
      })

      setTimeout(this.fire,2000)
      
    }

    isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y >= 230;
  };

    closeDrawer = () => {
      this.drawer._root.close()
    };

    openDrawer = () => { this.drawer._root.open() };

    animate () {
      this.animatedValue.setValue(1);
      Animated.timing(
        this.animatedValue,
        {
          toValue: 1,
          duration: 300,
          easing: Easing.linear
        }
      ).start()
    }

    finishedAnimation = (finished) => {
    if (finished)
      this.setState({isLeftSide: !(this.state.isLeftSide)});
  }

  fire = () => { 
     this.animatedValue.setValue(1);
    Animated.timing(
      this.animatedValue,
      {
        toValue: 0,
        duration: 300,
        easing: Easing.linear
      }
    ).start(this.finishedAnimation);
  }

    direction = () => this.state.isLeftSide ? 'ltr' : 'rtl';

  render(){
    if(this.props.isFocused){
      StatusBar.setBarStyle("light-content")
      StatusBar.setBackgroundColor(this.state.headerBgColor)
    }
    const screenWidth = Dimensions.get('screen').width;
    const objectMaxCoord = screenWidth - 30;

    const outputRange = {
      rtl: [0, objectMaxCoord],
      ltr: [objectMaxCoord, 0]
    }
    const marginLeft = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: outputRange[this.direction()]
    })
    return (
    <Root>
    <Drawer ref={(ref) => { this.drawer = ref; }} content={<SideBar drawerItem={this.drawer} navigation={this.props.navigation} />} onClose={() => this.closeDrawer()} >
    
    <Container>
    {this.state.searchActive && (
      <Header noShadow style={{backgroundColor: this.state.headerBgColor, zIndex: 1000, elevation:0, borderBottomWidth: 0, marginTop: Platform.OS !== "ios" ? Constants.statusBarHeight : 0}} noBorder searchBar rounded>
        <StatusBar barStyle={Platform.OS !== "ios" ? "light-content":"dark-content"} backgroundColor={this.state.headerBgColor} translucent={true}/>
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
      <Header noShadow noBorder style={{backgroundColor: this.state.headerBgColor, zIndex: 1000, elevation:0, borderBottomWidth: 0, marginTop: Platform.OS !== "ios" ? Constants.statusBarHeight : 0}} >
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
        <Animated.Text numberOfLines={1} style={{marginLeft,color: Colors.tintColor, width: '100%', fontSize: 18, fontWeight: 'bold'}}>Hello, {store.getState().auth.user.name}</Animated.Text>
      </View>
      
      <View
        style={styles.contentSection}
        >
        <View>

          <Text style={styles.sectionTitle}>MAKE YOUR BREAKFAST</Text>
          <Text note>You can make your own breakfast pack by choosing different items provided.</Text>
          <Button icon onPress={()=>this.props.navigation.navigate("Builder")} style={{backgroundColor: Colors.tintColor,borderRadius: 30, marginTop: 20}}>
            <Text>Make Your Breakfast</Text>
            <Icon name="ios-arrow-dropright-circle" style={{color: "#fff"}} />
          </Button>

          <Text style={[styles.sectionTitle,{marginTop: 20}]}>FULLY LOADED MENU</Text>
          <Text note>Comes with Bread Rolls, another pastry, Sugar, Milk, Fruits, Boiled Egg, with Ground Pepper, Cutlery.</Text>
          <Button onPress={()=>this.props.navigation.navigate("Menu")} style={{backgroundColor: Colors.tintColor,borderRadius: 30, marginTop: 20}}>
            <Text>Fully Loaded Menu</Text>
            <Icon name="ios-arrow-dropright-circle" style={{color: "#fff"}} />
          </Button>

        </View>
      </View>
    </Content>
    </View>

    </Container>
    
    </Drawer>
    </Root>
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
    height: 180,
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
    flex: 1
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

const mapActionToProps = {
  updateMenu
}

const mapStateToProps = state => {
  return {
    menuItemsCached: state.order.menuItems
  }
}

export default connect(mapStateToProps,mapActionToProps)(withNavigationFocus(HomeScreen));