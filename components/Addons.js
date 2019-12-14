import React from 'react';
import {View,TouchableOpacity} from 'react-native';
import {Text} from 'native-base';
import Colors from '../constants/Colors';
import {Feather} from '@expo/vector-icons';

export default class Addons extends React.Component{
	constructor(props) {
	  super(props);
	
	  this.state = {selectedIndex: null};
	}

	render(){
		if(this.props.addonList.length <= 0 ) {return (
			<Text note>No addon available</Text>
		)}

		return (
			<View>
			<View style={{flexDirection: "row", marginBottom: 5}}>
				<TouchableOpacity style={{flexDirection: "row", justifyContent: "center"}} onPress={()=>{this.props.onPress({addonID: "", price: 0, title: ""});this.setState({selectedIndex: null})}}>
	              <Feather name="x-circle" color={Colors.tintColor} size={24} />
	              <Text note style={{marginLeft: 5}}>Clear</Text>
              	</TouchableOpacity>
            </View>

			{this.props.addonList.map((item,index)=>{
				return(
					<View style={{flexDirection: "row"}} key={index}>
						<TouchableOpacity style={{flexDirection: "row", justifyContent: "center"}} onPress={()=>{this.props.onPress(item);this.setState({selectedIndex: index})}}>
			              <RadioButton selected={this.state.selectedIndex == index} style={{marginRight: 5}}/>
			              <Text>{item.name}: GHC {item.price}</Text>
		              	</TouchableOpacity>
		            </View>
				)
			})}
			</View>
		)
	}
}

export function RadioButton(props) {
  return (
      <View style={[{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: props.selected ? Colors.tintColor : '#dedeea',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
      }, props.style]}>
        {
          props.selected ?
            <View style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: Colors.tintColor,
            }}/>
            : null
        }
      </View>
  );
}