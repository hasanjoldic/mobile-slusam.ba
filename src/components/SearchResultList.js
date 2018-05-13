import React, { Component } from "react";
import {
	View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { appColor } from "../utils/utils";
import { initSong, addToNowPlayingList, pause, loadSong } from "../reducers/music/actions";
import { selectArtist } from "../reducers/search/actions";
import { setActiveTab } from "../reducers/tab/actions";
import { tabValues } from "../reducers/tab/index";

class SearchResultList extends Component {

  renderArtists(artist) {
    return (
      <TouchableOpacity 
        onPress={() => this.props.selectArtist(artist.name)}
        style={{
          flexDirection:"row",padding:10,alignItems:"center",
          justifyContent:"space-between",backgroundColor:"#FFF",margin:5,
          borderRadius:5,borderColor:appColor,borderWidth:2
        }}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <View style={{backgroundColor:"#FFF"}}>
            <Image 
              source={{uri: `http://46.101.191.69:8080/artists/${artist.name}/img_SMALL.jpg`}} 
              style={{
                width:50,height:50,padding:5,borderWidth:1,borderColor:appColor,
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

  renderSongs(song, index) {
    return (
      <View 
        style={{
          flexDirection:"row",padding:10,alignItems:"center",justifyContent:"space-between",
          backgroundColor:appColor+"BB",margin:5,marginTop:2,marginBottom:2,
          borderRadius:5,borderColor:"#FFF"
        }}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <Icon 
            color="#FFF" name="music" size={40} 
            style={{paddingLeft:5,paddingRight:5,marginRight:20}}
          />
          <View>
            <Text style={{color:"#FFF"}}>{song.name}</Text>
            <Text style={{color:"#FFF"}}>{song.title}</Text>
          </View>
        </View>
        <View style={{flexDirection:"row"}}>
          <TouchableOpacity onPress={() => this.props.initSong(song)}>
            <Icon color="#FFF" name="play" size={30} style={{marginRight:20}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.addToNowPlayingList(song)}>
            <Icon color="#FFF" name="playlist-plus" size={30}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderSearchResults({item}) {
    if (item.title) return this.renderSongs(item);
    return this.renderArtists(item);
  }

  renderSelectedArtistSongs({item}) {
    const song = item;
    const isPlaying = this.props.isPlaying && this.props.nowPlayingSong.name === song.name &&
      this.props.nowPlayingSong.title === song.title;
    const isLoadingSong = this.props.isLoadingSong && this.props.loadingSong.name === song.name &&
      this.props.loadingSong.title === song.title;

    console.log({
      isLoadingSong: this.props.isLoadingSong,
      loadingSong: this.props.loadingSong
    })
    console.log(isPlaying, isLoadingSong)
    return <View 
      style={{
        flexDirection:"row",padding:10,alignItems:"center",justifyContent:"space-between",
        backgroundColor:appColor+"BB",margin:5,borderRadius:5,borderColor:"#FFF",
        marginTop:2,marginBottom:2
      }}>
      <View style={{flexDirection:"row", alignItems:"center"}}>
        <Icon color="#FFF" name="music" size={40} 
        style={{paddingLeft:5,paddingRight:5,marginRight:20}}/>
        <View>
          <Text style={{color:"#FFF"}}>{song.name}</Text>
          <Text style={{color:"#FFF"}}>{song.title}</Text>
        </View>
      </View>
      <View style={{flexDirection:"row"}}>
        <TouchableOpacity onPress={() => {
          if (isPlaying) {
            this.props.pause();
          } else {
            this.props.initSong(song);
          }
        }}>
        {isLoadingSong ? 
            <ActivityIndicator size="large" color="#FFF" style={{marginRight:20}}/> : 
            <Icon color="#FFF" name={isPlaying ? "pause" : "play"} size={30} style={{marginRight:20}}/>
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          this.props.onAddSong();
          this.props.addToNowPlayingList(song);
        }}>
          <Icon color="#FFF" name="playlist-plus" size={30}/>
        </TouchableOpacity>
      </View>
    </View>
  }

  renderBottomButtons() {
    const { selectedArtistSongs, isArtistSelected } = this.props;
    return (
      <View style={{flexDirection:"row",justifyContent:"space-around",backgroundColor:"#FFF"}}>
        <TouchableOpacity style={{flex:1,padding:10,alignItems:"center",borderTopWidth:1,borderColor:appColor,
          backgroundColor:this.props.activeTab === tabValues.SEARCH_RESULTS ? "#FFF" : appColor}}
          onPress={() => this.props.setActiveTab(tabValues.SEARCH_RESULTS)}>
          <Text style={{color:this.props.activeTab === tabValues.SEARCH_RESULTS ? "#000" : "#FFF",
          alignItems:"center"}}>Pretraga</Text>
        </TouchableOpacity>       
        <TouchableOpacity style={{flex:1,padding:10,alignItems:"center",borderTopWidth:1,borderColor:appColor,
          backgroundColor:this.props.activeTab === tabValues.SEARCH_RESULT_ARTIST ? "#FFF" : appColor}}
          onPress={() => this.props.setActiveTab(tabValues.SEARCH_RESULT_ARTIST)}>
          <Text style={{color:this.props.activeTab === tabValues.SEARCH_RESULT_ARTIST ? "#000" : "#FFF"}}>
            {selectedArtistSongs[0].name}</Text>
        </TouchableOpacity>
      </View>
    );
  }

	render() {
		return (
      <View style={{flex:1}}>
      {this.props.activeTab === tabValues.SEARCH_RESULTS &&
        <FlatList
        contentContainerStyle={{paddingBottom:100}} keyboardShouldPersistTaps="handled"
        data={[...this.props.artists, ...this.props.songs]}
        renderItem={this.renderSearchResults.bind(this)}
        keyExtractor={item => "SearchResults_key_" + item.title ? item.name + item.title : item.name}
        style={{flex:1,backgroundColor:"#FFF"}}>
        </FlatList>}
      {this.props.activeTab === tabValues.SEARCH_RESULT_ARTIST &&
        <FlatList
        contentContainerStyle={{paddingBottom:100}} keyboardShouldPersistTaps="handled"
        data={this.props.selectedArtistSongs}
        renderItem={this.renderSelectedArtistSongs.bind(this)}
        keyExtractor={item => "SelectedArtistSongs_key_" + item.title}
        style={{flex:1,backgroundColor:"#FFF"}}>
        </FlatList>}
      {this.props.isArtistSelected &&
        <View>
          {this.renderBottomButtons()}
        </View>}
      </View>
		);
	}
}

const mapStateToProps = (state) => {
	const { search, music, tab } = state;
	return {
		artists: search.searchResults.artists,
		songs: search.searchResults.songs,
    isPlaying: music.isPlaying,
    nowPlayingSong: music.nowPlayingSong,
    isLoadingSong: music.isLoadingSong,
    loadingSong: music.loadingSong,
    selectedArtistSongs: search.selectedArtistSongs,
    isArtistSelected: search.selectedArtistSongs.length > 0,
    activeTab: tab.activeTab
	};
};

export default connect(mapStateToProps, {
	initSong, addToNowPlayingList, selectArtist, setActiveTab, pause, loadSong
})(SearchResultList);