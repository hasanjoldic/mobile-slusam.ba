import React, { Component } from "react";
import {
  Text, View, TouchableOpacity, Image, FlatList, RefreshControl
} from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { cmsColor } from "../../utils/utils";
import { getCmsArtists, cmsSetSingleArtist } from "../../reducers/cms/actions";
import { setNav } from "../../reducers/nav/actions";
import AddButtonCircle from "./AddButtonCircle";
import StatusWrapper from "../hoc/StatusWrapper";

class _CmsArtists extends Component {

  constructor(props) {
    super(props);
    if (props.cmsArtists.length < 1) props.getCmsArtists();
  }

  componentDidMount() {
    this.props.setNav("CmsArtists");
  }

  renderList({item}) {
    const artist = item;
    return (
      <TouchableOpacity 
        onPress={() => this.props.cmsSetSingleArtist(artist.name)}
        style={{
          flexDirection:"row",padding:10,alignItems:"center",
          justifyContent:"space-between",backgroundColor:"#FFF",margin:5,
          borderRadius:5,borderColor:cmsColor,borderWidth:2
        }}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <View style={{backgroundColor:"#FFF"}}>
            <Image 
              source={{uri: `http://46.101.191.69:8080/artists/${artist.name}/img_SMALL.jpg`}} 
              style={{
                width:50,height:50,borderWidth:1,borderColor:cmsColor,
                borderRadius:1000,marginRight:20
              }}
            />
          </View>
          <View>
            <Text style={{color:"#000"}}>{artist.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
		return (
      <StatusWrapper hideLoading={true}>
      <View style={{flex:1}}>
        <FlatList 
          contentContainerStyle={{paddingBottom:100}} keyboardShouldPersistTaps="handled"
          data={this.props.cmsArtists} renderItem={this.renderList.bind(this)}
          keyExtractor={item => "CmsArtists_key_" + item.name} style={{flex:1}}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.props.getCmsArtists}
            />
          }>
        </FlatList>
        <AddButtonCircle onPress={() => this.props.navigation.navigate("CmsNewArtist")}/>
      </View>
      </StatusWrapper>
		);
	}
}

const mapStateToProps = state => ({
  cmsArtists: state.cms.cmsArtists,
  isLoading: state.app.isLoading
});

const CmsArtists = connect(mapStateToProps, {getCmsArtists, setNav, cmsSetSingleArtist})(_CmsArtists);

export { CmsArtists };