import React, { Component } from "react";
import {
	View,
	Text,
	TouchableOpacity
} from "react-native";

export const tabValues = {
  PLAYING: "playing",
  SEARCH_RESULTS: "searchResults",
  SEARCH_RESULT_ARTIST: "searchResultArtist",
  PLAYLISTS: "playlists"
}

class TabGroup extends Component {
  render() {
  	const { activeTab, setActiveTab, selectedArtistSongList } = this.props;
  	return (
  		<View elevation={5} 
  			style={{
  				minHeight:40,height:"7%",flexDirection:"row",justifyContent:"space-around",
  				marginTop:0,backgroundColor:"#0080FF"
  			}}
  		>
        <View 
          style={{
        	  backgroundColor: activeTab === tabValues.PLAYING ? "#0080FF" : "#FFF",
        	  flex:1,marginLeft:5
          }}
         >
          <TouchableOpacity 
            style={{
              flex:1,alignItems:"center",padding:10,paddingBottom:5,borderColor:"#FFF",
              backgroundColor: activeTab === tabValues.PLAYING ? "#FFF" : "#0080FF",
              borderTopLeftRadius: activeTab === tabValues.PLAYING ? 5 : 0,
              borderTopRightRadius: activeTab === tabValues.PLAYING ? 5 : 0,
              borderBottomRightRadius: activeTab === tabValues.SEARCH_RESULTS ? 5 : 0,
            }}
            onPress={() => setActiveTab(tabValues.PLAYING)}
            activeOpacity={1}
          >
            <Text style={{color: activeTab === tabValues.PLAYING ? "#000" : "#FFF"}}>Slusam</Text>
          </TouchableOpacity>
        </View>

        <View 
        	style={{
        		backgroundColor: activeTab === tabValues.SEARCH_RESULTS ? "#0080FF" : "#FFF",
        		flex:1
        	}}
        >
          <TouchableOpacity 
            style={{
              flex:1,alignItems:"center",padding:10,paddingBottom:5,borderColor:"#FFF",
              backgroundColor: activeTab === tabValues.SEARCH_RESULTS ? "#FFF" : "#0080FF",
              borderBottomLeftRadius: activeTab === tabValues.PLAYING ? 5 : 0,
              borderTopLeftRadius: activeTab === tabValues.SEARCH_RESULTS ? 5 : 0,
              borderTopRightRadius: activeTab === tabValues.SEARCH_RESULTS ? 5 : 0,
              borderBottomRightRadius: selectedArtistSongList ? activeTab === tabValues.SEARCH_RESULT_ARTIST ? 5 : 0 : activeTab === tabValues.PLAYLISTS ? 5 : 0,
            }}
            onPress={() => setActiveTab(tabValues.SEARCH_RESULTS)}
            activeOpacity={1}
          >
            <Text style={{color: activeTab === tabValues.SEARCH_RESULTS ? "#000" : "#FFF"}}>Pretraga</Text>
          </TouchableOpacity>
        </View>
        {selectedArtistSongList.length > 0 && 
	        <View 
	        	style={{
	        		backgroundColor: activeTab === tabValues.SEARCH_RESULT_ARTIST ? "#0080FF" : "#FFF",
	        		flex:1
	        	}}
	        >
	          <TouchableOpacity 
	            style={{
	              flex:1,alignItems:"center",padding:10,paddingBottom:5,borderColor:"#FFF",
	              backgroundColor: activeTab === tabValues.SEARCH_RESULT_ARTIST ? "#FFF" : "#0080FF",
	              borderBottomLeftRadius: activeTab === tabValues.SEARCH_RESULTS ? 5 : 0,
	              borderTopLeftRadius: activeTab === tabValues.SEARCH_RESULT_ARTIST ? 5 : 0,
	              borderTopRightRadius: activeTab === tabValues.SEARCH_RESULT_ARTIST ? 5 : 0,
	              borderBottomRightRadius: activeTab === tabValues.PLAYLISTS ? 5 : 0
	            }}
	            onPress={() => setActiveTab(tabValues.SEARCH_RESULT_ARTIST)}
	            activeOpacity={1}
	          >
	            <Text style={{color: activeTab === tabValues.SEARCH_RESULT_ARTIST ? "#000" : "#FFF"}}>
	            	{selectedArtistSongList[0].name}
	            </Text>
	          </TouchableOpacity>
	        </View>
	      }
        <View 
        	style={{
        		backgroundColor: activeTab === tabValues.PLAYLISTS ? "#0080FF" : "#FFF",flex:1,
        		marginRight:5
        	}}
        >
          <TouchableOpacity 
            style={{
              flex:1,alignItems:"center",padding:10,paddingBottom:5,borderColor:"#FFF",
              backgroundColor: activeTab === tabValues.PLAYLISTS ? "#FFF" : "#0080FF",
              borderTopLeftRadius: activeTab === tabValues.PLAYLISTS ? 5 : 0,
              borderTopRightRadius: activeTab === tabValues.PLAYLISTS ? 5 : 0,
              borderBottomLeftRadius: selectedArtistSongList ? activeTab === tabValues.SEARCH_RESULT_ARTIST ? 5 : 0 : activeTab === tabValues.SEARCH_RESULTS ? 5 : 0,
            }}
            onPress={() => setActiveTab(tabValues.PLAYLISTS)}
            activeOpacity={1}
          >
            <Text style={{color: activeTab === tabValues.PLAYLISTS ? "#000" : "#FFF"}}>Playliste</Text>
          </TouchableOpacity>
        </View>
      </View>
  	);
  }
}

export default TabGroup;