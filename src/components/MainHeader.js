import React, { Component } from "react";
import {
	View, Text, TextInput, TouchableOpacity,
	ToastAndroid
} from "react-native";
import { connect } from "react-redux";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { appColor } from "../utils/utils";
import { search } from "../reducers/search/actions";
import { changeIsCms } from "../reducers/app/actions";

class MainHeader extends Component {
	state = {
		text: ""
	};

	render() {
		return (
			<View 
				style={{
					flexDirection:"row",justifyContent:"space-between",
					alignItems:"center",paddingTop:10,paddingBottom:5,backgroundColor:appColor
				}}
        elevation={10}
      >
        <TouchableOpacity
          style={{flex:3,alignItems:"center"}}
          onPress={() => this.props.navigation.navigate(this.props.cmsNav)}>
          <Text style={{color:"#FFF"}}>slusaj.ba</Text>
        </TouchableOpacity>
        <TextInput
          style={{flex:10,padding:5,borderColor:"#FFF",borderWidth:1,borderRadius:5,backgroundColor:"#FFF"}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          returnKeyType="search"
          underlineColorAndroid="#FFFFFF00"
          placeholder="Trazi izvodjaca ili pjesmu..."
          onSubmitEditing={() => this.props.search(this.state.text)}
        />
        <View style={{flex:2,alignItems:"center"}}>
          <TouchableOpacity
            onPress={() => {}}>
            <Icon color="#FFF" name="account-circle" size={30} />
          </TouchableOpacity>
        </View>
      </View>
		);
	}
}

const mapStateToProps = state => ({
  cmsNav: state.nav.cmsNav
})

export default connect(mapStateToProps, {search,changeIsCms})(MainHeader);