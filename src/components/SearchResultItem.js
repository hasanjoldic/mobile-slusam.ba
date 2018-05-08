import React from "react";
import {
	View, 
	Text,
	TouchableOpacity
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchResultItem = ({song}) => {
  return (
  	<View 
      style={{
        flexDirection:"row",padding:10,alignItems:"center",justifyContent:"space-between",
        backgroundColor:"#0080FFBB",marginBottom:2,borderRadius:5,borderColor:"#FFF"
      }}>
      <View style={{flexDirection:"row", alignItems:"center"}}>
        <Icon color="#FFF" name="music" size={40} 
          style={{padding:5,borderWidth:1,borderColor:"#FFF",borderRadius:1000,marginRight:20}}/>
        <View>
          <Text style={{color:"#FFF"}}>{song.name}</Text>
          <Text style={{color:"#FFF"}}>{song.title}</Text>
        </View>
      </View>
      <View style={{flexDirection:"row"}}>
        <TouchableOpacity onPress={() => {
          this.handleSongPress(song);
          this.setState({
            nowPlayingList: [song],
            nowPlayingSongIndex: 0
          });
        }}>
          <Icon color="#FFF" name="play" size={30} style={{marginRight:20}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setState({nowPlayingList: [...this.state.nowPlayingList, song]})}>
          <Icon color="#FFF" name="playlist-plus" size={30}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchResultItem;