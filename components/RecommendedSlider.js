import React from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';

import Carousel from 'react-native-snap-carousel';

export default class RecommendedSlider extends React.Component{
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}
	_renderItem = ({item, index}) => {
        return (
            <View style={[styles.slide,{backgroundColor: item.bg}]}>
	            <TouchableOpacity onPress={()=>this.props.navigation.navigate("Food",{food: item})} >
	                <Image source={{uri: item.image}} resizeMode="cover" style={{width: 200,height:200}} />
	            </TouchableOpacity>
            </View>
        );
    }

    render(){
    	return (
    		<Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.props.entries}
              renderItem={this._renderItem}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width / 3}
              containerCustomStyle={{marginLeft: -15}}
              autoplay={true}
              loop={true}
        	/>
		)
    }
}

const styles = StyleSheet.create({
	slide: {
    height: (Dimensions.get('window').width - 15) / 3,
    width: (Dimensions.get('window').width - 15) / 3,
    borderRadius: 15,
    flex:1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
})