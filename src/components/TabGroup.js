import React, { Component } from "react";
import {
	View,Text,TouchableOpacity,Animated
} from "react-native";
import { connect } from "react-redux";

import { appColor } from "../utils/utils";
import { tabValues } from "../reducers/tab/index";
import { setActiveTab } from "../reducers/tab/actions";

class TabGroup extends Component {

  render() {
  	const { activeTab, setActiveTab, selectedArtistSongs } = this.props;
  	return (
  		<View elevation={5} 
  			style={{
  				minHeight:40,height:"7%",flexDirection:"row",justifyContent:"space-around",
  				marginTop:0,backgroundColor:appColor
  			}}
  		>
        <View 
          style={{
        	  backgroundColor: activeTab === tabValues.PLAYING ? appColor : "#FFF",
        	  flex:1,marginLeft:5
          }}
         >
          <TouchableOpacity 
            style={{
              flex:1,alignItems:"center",padding:10,paddingBottom:5,borderColor:"#FFF",
              backgroundColor: activeTab === tabValues.PLAYING ? "#FFF" : appColor,
              borderTopLeftRadius: activeTab === tabValues.PLAYING ? 5 : 0,
              borderTopRightRadius: activeTab === tabValues.PLAYING ? 5 : 0,
              borderBottomRightRadius: activeTab === tabValues.SEARCH_RESULTS || 
                activeTab === tabValues.SEARCH_RESULT_ARTIST ? 5 : 0,
            }}
            onPress={() => setActiveTab(tabValues.PLAYING)}
            activeOpacity={1}
          >
            <Text style={{color: activeTab === tabValues.PLAYING ? "#000" : "#FFF"}}>Slusam</Text>
            {this.props.isAddingSong &&
              <Animated.Text style={{fontSize:this.props.addSongFontSize,color:"#FFF",
                position:"absolute",right:20,top:10}}>
              +1</Animated.Text>}
          </TouchableOpacity>
        </View>

        <View 
        	style={{
        		backgroundColor: activeTab === tabValues.SEARCH_RESULTS || 
            activeTab === tabValues.SEARCH_RESULT_ARTIST ? appColor : "#FFF",
        		flex:1,marginRight:5
        	}}
        >
          <TouchableOpacity 
            style={{
              flex:1,alignItems:"center",padding:10,paddingBottom:5,borderColor:"#FFF",
              backgroundColor: activeTab === tabValues.SEARCH_RESULTS || 
                activeTab === tabValues.SEARCH_RESULT_ARTIST ? "#FFF" : appColor,
              borderBottomLeftRadius: activeTab === tabValues.PLAYING ? 5 : 0,
              borderTopLeftRadius: activeTab === tabValues.SEARCH_RESULTS || 
                activeTab === tabValues.SEARCH_RESULT_ARTIST ? 5 : 0,
              borderTopRightRadius: activeTab === tabValues.SEARCH_RESULTS || 
                activeTab === tabValues.SEARCH_RESULT_ARTIST ? 5 : 0,
              borderBottomRightRadius: selectedArtistSongs ? activeTab === tabValues.PLAYLISTS ? 5 : 0 : activeTab === tabValues.PLAYLISTS ? 5 : 0,
            }}
            onPress={() => setActiveTab(tabValues.SEARCH_RESULTS)}
            activeOpacity={1}
          >
            <Text style={{color: activeTab === tabValues.SEARCH_RESULTS || 
              activeTab === tabValues.SEARCH_RESULT_ARTIST ? "#000" : "#FFF"}}>Pretraga</Text>
          </TouchableOpacity>
        </View>
        {/*{selectedArtistSongs.length > 0 && 
	        <View 
	        	style={{
	        		backgroundColor: activeTab === tabValues.SEARCH_RESULT_ARTIST ? appColor : "#FFF",
	        		flex:1
	        	}}
	        >
	          <TouchableOpacity 
	            style={{
	              flex:1,alignItems:"center",padding:10,paddingBottom:5,borderColor:"#FFF",
	              backgroundColor: activeTab === tabValues.SEARCH_RESULT_ARTIST ? "#FFF" : appColor,
	              borderBottomLeftRadius: activeTab === tabValues.SEARCH_RESULTS ? 5 : 0,
	              borderTopLeftRadius: activeTab === tabValues.SEARCH_RESULT_ARTIST ? 5 : 0,
	              borderTopRightRadius: activeTab === tabValues.SEARCH_RESULT_ARTIST ? 5 : 0,
	              borderBottomRightRadius: activeTab === tabValues.PLAYLISTS ? 5 : 0
	            }}
	            onPress={() => setActiveTab(tabValues.SEARCH_RESULT_ARTIST)}
	            activeOpacity={1}
	          >
	            <Text style={{color: activeTab === tabValues.SEARCH_RESULT_ARTIST ? "#000" : "#FFF"}}>
	            	{selectedArtistSongs[0].name}
	            </Text>
	          </TouchableOpacity>
	        </View>
	      }*/}
        {/*<View 
        	style={{
        		backgroundColor: activeTab === tabValues.PLAYLISTS ? appColor : "#FFF",flex:1,
        		marginRight:5
        	}}
        >
          <TouchableOpacity 
            style={{
              flex:1,alignItems:"center",padding:10,paddingBottom:5,borderColor:"#FFF",
              backgroundColor: activeTab === tabValues.PLAYLISTS ? "#FFF" : appColor,
              borderTopLeftRadius: activeTab === tabValues.PLAYLISTS ? 5 : 0,
              borderTopRightRadius: activeTab === tabValues.PLAYLISTS ? 5 : 0,
              borderBottomLeftRadius: selectedArtistSongs ? activeTab === tabValues.SEARCH_RESULT_ARTIST ? 5 : 0 : activeTab === tabValues.SEARCH_RESULTS ? 5 : 0,
            }}
            onPress={() => setActiveTab(tabValues.PLAYLISTS)}
            activeOpacity={1}
          >
            <Text style={{color: activeTab === tabValues.PLAYLISTS ? "#000" : "#FFF"}}>Playliste</Text>
          </TouchableOpacity>
        </View>*/}
      </View>
  	);
  }
}

const mapStateToProps = (state) => {
	const { tab } = state;
	return {
		activeTab: tab.activeTab,
		selectedArtistSongs: state.search.selectedArtistSongs
	};
};

export default connect(mapStateToProps, {setActiveTab})(TabGroup);