import React, { Component } from "react";
import {
	View,
	Text,
	Slider,
	TouchableOpacity
} from "reac-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Circle } from 'react-native-progress';

class MusicPlayerControls extends Component {
	render() {
		return (
			<View>
        <View style={{flexDirection:"row",justifyContent:"space-around",borderTopWidth:1,borderColor:"grey"}}>
          <Text>{formatTime(this.state.currentPosition)}</Text>
          <Slider 
            maximumValue={this.state.duration}
            step={1}
            value={this.state.currentPosition}
            onSlidingComplete={this.handleValueChange.bind(this)}
            onValueChange={() => {if(!this.state.isSliderActive) {this.setState({isSliderActive:true})}}}
            style={{width:"70%"}}
            minimumTrackTintColor="#0080FF"
            thumbTintColor="#0080FF"
            disabled={!this.state.isPlaying}
          />
          <Text>-{formatTime(this.state.duration-this.state.currentPosition)}</Text>
        </View>
        <View style={{flexDirection:"row", alignItems:"center",justifyContent:"space-around",borderTopWidth:1,borderColor:"grey",backgroundColor:"#0080FF"}}>
        <TouchableOpacity style={{padding:5}}
          onPress={() => {}}>
          <Icon color="#FFF" name="shuffle" size={20} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{padding:5}}
          onPress={this._previous.bind(this)}
        >
          <Icon color="#FFF" name="skip-previous" size={30} />
        </TouchableOpacity>
        {this.state.isPlaying ? 
          <TouchableOpacity style={{padding:5}}
            onPress={() => { this.setState({isPlaying:false}); SlusajMediaPlayer.pause(); }}>
            <Icon color="#FFF" name="pause-circle-outline" size={40} />
          </TouchableOpacity> :
          <TouchableOpacity 
            style={{padding:5}}
            onPress={() => { this.setState({isPlaying:true}); SlusajMediaPlayer.start(); }}
            disabled={!this.state.isInitialized}
          >
            <Icon color="#FFF" name="play-circle-outline" size={40} />
          </TouchableOpacity>
        }
        <TouchableOpacity 
          style={{padding:5}}
          onPress={this._next.bind(this)}
        >
          <Icon color="#FFF" name="skip-next" size={30} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{padding:5}}
          onPress={this.handleDownloadButtonPress.bind(this)}
          disabled={!this.state.isInitialized}
        >
          {this.state.isDownloading ? 
            <Circle progress={this.state.downloadProgress/100} color="#FFF" size={20} thickness={8}/> :
            <Icon color="#FFF" name="download" size={20} />
          }
        </TouchableOpacity>
        </View>
      </View>
		);
	}
}