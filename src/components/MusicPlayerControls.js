import React, { Component } from "react";
import { connect } from "react-redux";
import {
	View, Text, Slider, TouchableOpacity, DeviceEventEmitter
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Circle } from "react-native-progress";
import MusicControl from "react-native-music-control";
import FitImage from "react-native-fit-image";

import { formatTime, appColor } from "../utils/utils";
import { 
  pause, play, next, previous, changeSliderDrag, seekTo, downloadSong, lastSongCompleted
} from "../reducers/music/actions";

class MusicPlayerControls extends Component {

  constructor(props) {
    super(props);
    const { nowPlayingIndex, nowPlayingList } = props;
    DeviceEventEmitter.addListener("SlusajMediaPlayer_PAUSE", (e) => {
      props.pause();
    });
    DeviceEventEmitter.addListener("SlusajMediaPlayer_COMPLETION", (e) => {
      props.next();
    });
    DeviceEventEmitter.addListener("MEDIA_INFO_BUFFERING_START", (e) => {
      console.log("MEDIA_INFO_BUFFERING_START");
    });
    MusicControl.on("pause", () => {
      props.pause()
    });

    MusicControl.on("play", () => {
      props.play()
    })

    MusicControl.on("nextTrack", () => {
      props.next();
    });

    MusicControl.on("previousTrack", () => {
      props.previous();
    });
  }

	render() {
    const { nowPlayingList, nowPlayingIndex } = this.props;
		return (
			<View style={{height:320,margin:5,marginLeft:0,marginRight:0}}>
        <View style={{height:300,flexDirection:"row", alignItems:"center",justifyContent:"space-around",borderTopWidth:1,borderColor:"grey",backgroundColor:appColor}}>
          {nowPlayingList.length>0 && 
            <FitImage style={{position:"absolute",top:0,left:0,height:300,width:"100%"}}
            source={{uri: `http://46.101.191.69:8080/artists/${nowPlayingList[nowPlayingIndex].name}/img_BIG.jpg`}}
          />}
          <TouchableOpacity style={{padding:5}}
            onPress={() => {}}>
            <Icon color="#FFF" name="shuffle" size={40} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={{padding:5}}
            onPress={() => this.props.nowPlayingIndex !== 0 ? this.props.previous  : null}
          >
            <Icon color={this.props.nowPlayingIndex !== 0 ? "#FFF" : "#FFFFFF66"} 
              name="skip-previous" size={60} />
          </TouchableOpacity>
          {/*onPress={() => { this.setState({isPlaying:false}); SlusajMediaPlayer.pause(); }}*/}
          {/*onPress={() => { this.setState({isPlaying:true}); SlusajMediaPlayer.start(); }}*/}
          {this.props.isPlaying ? 
            <TouchableOpacity style={{padding:5}}
              
              onPress={() => { this.props.pause(); }}
            >
              <Icon color="#FFF" name="pause-circle-outline" size={90} />
            </TouchableOpacity> :
            <TouchableOpacity 
              style={{padding:5}}
              
              onPress={() => { this.props.play() }}
              disabled={!this.props.isInitialized}
            >
              <Icon color="#FFF" name="play-circle-outline" size={90} />
            </TouchableOpacity>
          }
          <TouchableOpacity 
            style={{padding:5}}
            onPress={() => this.props.nowPlayingIndex < this.props.nowPlayingList.length-1 ? this.props.next : null}
          >
            <Icon color={this.props.nowPlayingIndex < this.props.nowPlayingList.length-1 ? "#FFF" : "#FFFFFF66"} 
              name="skip-next" size={60} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={{padding:5}}
            onPress={this.props.downloadSong}
            disabled={!this.props.isInitialized}
          >
            {this.props.isDownloading ? 
              <Circle progress={this.props.downloadProgress/100} color="#FFF" size={40} thickness={19}/> :
              <Icon color={this.props.isInitialized ? "#FFF" : "#FFFFFF66"} name="download" size={40} />
            }
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:"row",justifyContent:"space-around",borderTopWidth:1,borderColor:"grey"}}>
          <Text>{formatTime(this.props.songPosition)}</Text>
          <Slider 
            maximumValue={this.props.songDuration}
            step={1}
            value={this.props.songPosition}
            onSlidingComplete={this.props.seekTo}
            onValueChange={() => {if(!this.props.isSliderDragging) {this.props.changeSliderDrag(true)}}}
            style={{width:"70%"}}
            minimumTrackTintColor={appColor}
            thumbTintColor={appColor}
            disabled={!this.props.isPlaying}
          />
          <Text>-{formatTime(this.props.songDuration-this.props.songPosition)}</Text>
        </View>
      </View>
		);
	}
}

const mapStateToProps = state => {
  const { music } = state;
  return {
    isInitialized: music.isInitialized,
    isPlaying: music.isPlaying,
    songPosition: music.songPosition,
    songDuration: music.songDuration,
    isSliderDragging: music.isSliderDragging,
    isDownloading: music.isDownloading,
    downloadProgress: music.downloadProgress,
    nowPlayingIndex: music.nowPlayingIndex,
    nowPlayingList: music.nowPlayingList
  };
};

export default connect(mapStateToProps, {
	pause, play, next, previous, changeSliderDrag, seekTo, downloadSong, next, lastSongCompleted
})(MusicPlayerControls);