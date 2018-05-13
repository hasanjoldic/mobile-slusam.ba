import React,  { Component } from "react";
import {
	View, Text, TouchableOpacity, FlatList
} from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { appColor } from "../utils/utils";
import { initSong } from "../reducers/music/actions";
import MusicPlayerControls from "./MusicPlayerControls";

class NowPlaying extends Component {

	renderList({item, index}) {
    const song = item;
    return (
      <View>
        {this.props.nowPlayingIndex === index ?
        <MusicPlayerControls /> :
        <View style={{
          flexDirection:"row",padding:10,alignItems:"center",justifyContent:"space-between",
          backgroundColor:appColor+"BB",margin:5,marginTop:2,marginBottom:2
        }}>
          <View style={{flexDirection:"row", alignItems:"center"}}>
            <Icon 
              color="#FFF" name="music" size={40} 
              style={{paddingLeft:5,paddingRight:5,marginRight:20}}/>
            <View>
              <Text style={{color:"#FFF"}}>{song.name}</Text>
              <Text style={{color:"#FFF"}}>{song.title}</Text>
            </View>
          </View>
          <View style={{flexDirection:"row"}}>
            <TouchableOpacity onPress={() => {
              this.props.initSong(song, index);
            }}>
              <Icon 
                color="#FFF" name={this.props.nowPlayingIndex === index ? "pause" : "play"} size={30} 
                style={{marginRight:20}}/>
            </TouchableOpacity>
          </View>
        </View>}
      </View>
    );
	}

	render() {
		return (
      <View style={{flex:1}}>
        <FlatList 
          contentContainerStyle={{paddingBottom:100}}
          data={this.props.nowPlayingList}
          renderItem={this.renderList.bind(this)}
          keyExtractor={item => item.title} 
          keyboardShouldPersistTaps="handled" style={{flex:1,backgroundColor:"#FFF"}}>
        </FlatList>
      </View>
		);
	}
}

const mapStateToProps = (state) => {
	const { music } = state;
	return {
		nowPlayingList: music.nowPlayingList,
		nowPlayingIndex: music.nowPlayingIndex
	};
};

export default connect(mapStateToProps, {initSong})(NowPlaying);