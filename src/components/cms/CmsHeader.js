import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { NavigationActions, StackActions } from "react-navigation";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { cmsColor } from "../../utils/utils";
import { setCmsSearchText, getCmsArtists } from "../../reducers/cms/actions";
import { changeIsCms } from "../../reducers/app/actions";
import { setCmsNav } from "../../reducers/nav/actions";

class _CmsHeader extends Component {
  state = {
    text: ""
  };

  handleLogoPress() {
    const { navigation } = this.props;
    this.props.setCmsNav(navigation.state.routeName);
    this.props.navigation.navigate("App")
  }

  getSearchPlaceholder() {
    const { routeName } = this.props.navigation.state;
    if (routeName === "CmsArtists") return "Trazi izvodjaca...";
    else if (routeName === "CmsSingleArtist") return "Trazi pjesmu...";
    return "..."
  }

  render() {
    const isNewArtist = this.props.navigation.state.routeName === "CmsNewArtist";
    return (
      <View 
        style={{
          flexDirection:"row",justifyContent:"space-between",paddingLeft:10,paddingRight:10,
          alignItems:"center",paddingTop:10,paddingBottom:5,backgroundColor:cmsColor
        }}
        elevation={10}
      >
        <TouchableOpacity
          style={{alignItems:"center"}}
          onPress={this.handleLogoPress.bind(this)}>
          <Text style={{color:"#FFF",paddingRight:10}}>{this.props.headerText}</Text>
        </TouchableOpacity>
        {isNewArtist ?
        <Text style={{flex:1,padding:5,color:"#FFF",textAlign:"center",fontWeight:"bold"}}>Dodaj novog izvodjaca</Text> :
        <TextInput 
          style={{flex:1,padding:5,borderColor:"#FFF",borderWidth:1,borderRadius:5,backgroundColor:"#FFF"}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          underlineColorAndroid="#FFFFFF00"
          placeholder={this.getSearchPlaceholder()}
          onSubmitEditing={() => this.props.getCmsArtists(this.state.text)}
        />}
        <View style={{alignItems:"center",paddingLeft:10}}>
          <TouchableOpacity
            onPress={() => {}}>
            <Icon color="#FFF" name="account-circle" size={30} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    cmsSearchText: state.cms.cmsSearchText
  };
};

const CmsHeader = connect(mapStateToProps, {
  setCmsSearchText, changeIsCms, setCmsNav, getCmsArtists
})(_CmsHeader);

export { CmsHeader };