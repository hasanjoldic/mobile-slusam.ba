import React, { Component } from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Slider,
  NativeModules,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ToastAndroid,
  Keyboard,
  StatusBar
} from 'react-native';
import { connect } from "react-redux";
import { StackNavigator } from 'react-navigation';
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'react-native-fetch-blob'
import RNFS from 'react-native-fs';

const SlusajMediaPlayer = NativeModules.SlusajMediaPlayer;

const tabValues = {
  PLAYING: "playing",
  SEARCH_RESULTS: "searchResults",
  SEARCH_RESULT_ARTIST: "searchResultArtist",
  PLAYLISTS: "playlists"
}

class App extends Component<Props> {

  state = {
    duration: 0,
    currentPosition: 0,
    isPlaying: false,
    isSliderActive: false,
    songs: [],
    activeTab: tabValues.PLAYING,
    searchResults: <View style={{flex:1}}></View>,
    playlists: <View style={{flex:1}}></View>,
    nowPlayingList: [],
    nowPlayingSongIndex: null,
    isKeyboardActive: false,
    isInitialized: false
  }

  intervalFunction = null;

  constructor(props) {
    super(props);
    Keyboard.addListener('keyboardDidShow', () => {
      this.setState({isKeyboardActive: true});
    });
    Keyboard.addListener('keyboardDidHide', () => {
      this.setState({isKeyboardActive: false});
    });
    SlusajMediaPlayer.setOnCompletionCallback(() => {
      if (this.state.nowPlayingSongIndex < this.state.nowPlayingList.length-1) {
        this.handleSongPress(this.state.nowPlayingList[this.state.nowPlayingSongIndex+1]);
        this.setState({nowPlayingSongIndex: this.state.nowPlayingSongIndex+1});
      } else {
        this.setState({isPlaying:false});
      }
    });
  }

  getCurrentPosition() {
    if (this.state.isPlaying) {
      SlusajMediaPlayer.getCurrentPosition(currentPosition => {
        if (!this.state.isSliderActive) {
          this.setState({currentPosition});
        }
      });
    }
  }

  handleValueChange(value) {
    console.log("value", value);
    if (value !== this.state.currentPosition) {
      SlusajMediaPlayer.seekTo(value);
      this.setState({
        isSliderActive: false,
        currentPosition: value
      });
    }
  }

  formatTime(timeInMS) {
    let hours;
    let minutes;
    let seconds;
    let timeInSeconds = timeInMS / 1000;
    hours = Math.floor(timeInSeconds / 3600);
    timeInSeconds -= hours * 3600;
    minutes = Math.floor(timeInSeconds / 60);
    timeInSeconds -= minutes * 60;
    seconds = Math.floor(timeInSeconds);

    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
  }

  handleSongPress(song) {
    clearInterval(this.intervalFunction);
    let urlString = song.name + "/" + song.title + ".mp3";
    urlString = urlString.replace(/ /g, "%20");
    console.log("urlString", urlString);
    SlusajMediaPlayer.init("http://46.101.191.69:8080/artists/" + urlString, () => {
      SlusajMediaPlayer.getDuration((duration) => this.setState({duration,isInitialized: true,isPlaying: true}));
      this.intervalFunction = setInterval(() => this.getCurrentPosition(), 1000);
      SlusajMediaPlayer.start();
    });
  }

  renderSongList() {
    console.log("here")
    return this.state.nowPlayingList.map((song, index) => {
      return (
        <View 
          key={"song_item_" + index} 
          style={{
            flexDirection:"row",padding:10,alignItems:"center",justifyContent:"space-between",
            backgroundColor:"#0080FFBB",marginBottom:2
          }}>
          <View style={{flexDirection:"row", alignItems:"center"}}>
            <Icon color="#FFF" name="music" size={40} style={{padding:5,borderWidth:1,borderColor:"#FFF",borderRadius:1000,marginRight:20}}/>
            <View>
              <Text style={{color:"#FFF"}}>{song.name}</Text>
              <Text style={{color:"#FFF"}}>{song.title}</Text>
            </View>
          </View>
          <View style={{flexDirection:"row"}}>
            <TouchableOpacity onPress={() => {
              this.handleSongPress(song);
              this.setState({
                nowPlayingSongIndex: index
              });
            }}>
              <Icon color="#FFF" name={this.state.nowPlayingSongIndex === index ? "pause" : "play"} size={30} style={{marginRight:20}}/>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  }

  renderActiveTab() {
    const activeTab = this.state.activeTab;
    if (activeTab === tabValues.PLAYING) {
      return (
        <ScrollView style={{flex:10}}>
          {this.renderSongList()}
        </ScrollView>
      );
    } else if (activeTab === tabValues.SEARCH_RESULTS) {
      return this.state.searchResults;
    } else if (activeTab === tabValues.SEARCH_RESULT_ARTIST) {
      return <View></View>;
    } else if (activeTab === tabValues.PLAYLISTS) {
      return this.state.playlists;
    }
  }

  handleSubmitEditing() {
    if(!this.state.text || this.state.text.length < 4) {
      ToastAndroid.show("Molimo upisite najmanje 4 slova", ToastAndroid.SHORT);
    } else {
      axios({
        method:'get',
        url:'http://46.101.191.69:3000/api/v1/search/' + this.state.text
      }).then(res => {
        console.log("res.data.response", res.data.response);
        const searchResultsTabs = 
          <View elevation={1} style={{flexDirection:"row",justifyContent:"space-around",justifyContent:"space-around",backgroundColor:"#0080FF"}}>
            <View style={{flex:1,alignItems:"center",padding:5,borderBottomWidth:3,borderColor:"#FFF"}}>
              <Text style={{color:"#FFF"}}>Pjesme</Text>
            </View>
            <View style={{flex:1,alignItems:"center",padding:5}}>
              <Text style={{color:"#FFF"}}>Izvodjaci</Text>
            </View>
          </View>;
        const searchResultList = res.data.response.map((song, index) => {
          return (
            <View 
              key={"song_item_" + index} 
              style={{
                flexDirection:"row",padding:10,alignItems:"center",justifyContent:"space-between",
                backgroundColor:"#0080FFBB",marginBottom:2,borderRadius:5,borderColor:"#FFF"
              }}>
              <View style={{flexDirection:"row", alignItems:"center"}}>
                <Icon color="#FFF" name="music" size={40} style={{padding:5,borderWidth:1,borderColor:"#FFF",borderRadius:1000,marginRight:20}}/>
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
        });
        this.setState({searchResults: <View style={{flex:1,backgroundColor:"#FFF"}}><View style={{padding:5}}>{searchResultList}</View></View>, activeTab: tabValues.SEARCH_RESULTS});
      });
    }
  }

  handleDownloadButtonPress() {
    const song = this.state.nowPlayingList[this.state.nowPlayingSongIndex];
    let url = "http://46.101.191.69:8080/artists/" + song.name + "/" + song.title + ".mp3";
    ToastAndroid.showWithGravity(
      'Skidam pjesmu...',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
    RNFetchBlob.fetch('GET', url).then(res => {
      RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DownloadDir + "/" + song.name + " - " + song.title + ".mp3", res.data, "base64").then(() => {
        ToastAndroid.show(
          'Pjesma je uspjesno skinuta.',
          ToastAndroid.SHORT
        );
      });
    }).catch(() => {
      ToastAndroid.showWithGravity(
        'Doslo je do greske prilikom skidanja pjesme.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    })
  }

  render() {
    return (
      <View style={{flex:1}}>
      <StatusBar barStyle="light-content" hidden ={false} backgroundColor="#0080FFBB"/>

        <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingTop:10,paddingBottom:5,backgroundColor:"#0080FF"}}
          elevation={10}
        >
          <View style={{flex:3,alignItems:"center"}}>
            <Text style={{color:"#FFF"}}>slusaj.ba</Text>
          </View>
          <TextInput
            style={{flex:10,padding:5,borderColor:"#FFF",borderWidth:1,borderRadius:5,backgroundColor:"#FFF"}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            returnKeyType="search"
            underlineColorAndroid="#FFFFFF00"
            placeholder="trazi..."
            onSubmitEditing={this.handleSubmitEditing.bind(this)}
          />
          <View style={{flex:2,alignItems:"center"}}>
            <TouchableOpacity
              onPress={() => {}}>
              <Icon color="#FFF" name="account-circle" size={30} />
            </TouchableOpacity>
          </View>
        </View>

      {/* ////////////////// */}

        <View elevation={5} style={{minHeight:40,height:"7%",flexDirection:"row",justifyContent:"space-around",marginTop:0,backgroundColor:"#0080FF"}}>
          <View style={{backgroundColor: this.state.activeTab === tabValues.PLAYING ? "#0080FF" : "#FFF",flex:1,marginLeft:5}}>
            <TouchableOpacity 
              style={{
                flex:1,alignItems:"center",padding:10,paddingBottom:5,borderColor:"#FFF",
                backgroundColor: this.state.activeTab === tabValues.PLAYING ? "#FFF" : "#0080FF",
                borderTopLeftRadius: this.state.activeTab === tabValues.PLAYING ? 5 : 0,
                borderTopRightRadius: this.state.activeTab === tabValues.PLAYING ? 5 : 0,
                borderBottomRightRadius: this.state.activeTab === tabValues.SEARCH_RESULTS ? 5 : 0,
              }}
              onPress={() => this.setState({activeTab: tabValues.PLAYING})}
              activeOpacity={1}
            >
              <Text style={{color: this.state.activeTab === tabValues.PLAYING ? "#000" : "#FFF"}}>Trenutno</Text>
            </TouchableOpacity>
          </View>
          <View style={{backgroundColor: this.state.activeTab === tabValues.SEARCH_RESULTS ? "#0080FF" : "#FFF",flex:1}}>
            <TouchableOpacity 
              style={{
                flex:1,alignItems:"center",padding:10,paddingBottom:5,borderColor:"#FFF",
                backgroundColor: this.state.activeTab === tabValues.SEARCH_RESULTS ? "#FFF" : "#0080FF",
                borderBottomLeftRadius: this.state.activeTab === tabValues.PLAYING ? 5 : 0,
                borderTopLeftRadius: this.state.activeTab === tabValues.SEARCH_RESULTS ? 5 : 0,
                borderTopRightRadius: this.state.activeTab === tabValues.SEARCH_RESULTS ? 5 : 0,
                borderBottomRightRadius: !this.state.searchResultArtist && this.state.activeTab === tabValues.PLAYLISTS ? 5 : 0,
              }}
              onPress={() => this.setState({activeTab: tabValues.SEARCH_RESULTS})}
              activeOpacity={1}
            >
              <Text style={{color: this.state.activeTab === tabValues.SEARCH_RESULTS ? "#000" : "#FFF"}}>Pretraga</Text>
            </TouchableOpacity>
          </View>
          {this.state.searchResultArtist && 
            <TouchableOpacity 
              style={{
                flex:1,alignItems:"center",padding:10,paddingBottom:5,borderColor:"#FFF",
                backgroundColor:"#0080FF"
              }}
              onPress={() => this.setState({activeTab: tabValues.SEARCH_RESULT_ARTIST})}
              activeOpacity={1}
            >
              <Text style={{color:"#FFF"}}>Izvodjaci</Text>
            </TouchableOpacity>
          }
          <View style={{backgroundColor: this.state.activeTab === tabValues.PLAYLISTS ? "#0080FF" : "#FFF",flex:1,marginRight:5}}>
            <TouchableOpacity 
              style={{
                flex:1,alignItems:"center",padding:10,paddingBottom:5,borderColor:"#FFF",
                backgroundColor: this.state.activeTab === tabValues.PLAYLISTS ? "#FFF" : "#0080FF",
                borderTopLeftRadius: this.state.activeTab === tabValues.PLAYLISTS ? 5 : 0,
                borderTopRightRadius: this.state.activeTab === tabValues.PLAYLISTS ? 5 : 0,
                borderBottomLeftRadius: this.state.activeTab === tabValues.SEARCH_RESULTS || this.state.activeTab.SEARCH_RESULT_ARTIST === tabValues ? 5 : 0,
              }}
              onPress={() => this.setState({activeTab: tabValues.PLAYLISTS})}
              activeOpacity={1}
            >
              <Text style={{color: this.state.activeTab === tabValues.PLAYLISTS ? "#000" : "#FFF"}}>Playliste</Text>
            </TouchableOpacity>
          </View>
        </View>

      {/* ////////////////// */}

      {this.renderActiveTab()}
      
      {/* ////////////////// */}

        {!this.state.isKeyboardActive &&
          <View>
            <View style={{flexDirection:"row",justifyContent:"space-around",borderTopWidth:1,borderColor:"grey"}}>
              <Text>{this.formatTime(this.state.currentPosition)}</Text>
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
              <Text>-{this.formatTime(this.state.duration-this.state.currentPosition)}</Text>
            </View>
            <View style={{flexDirection:"row", alignItems:"center",justifyContent:"space-around",borderTopWidth:1,borderColor:"grey",backgroundColor:"#0080FF"}}>
            <TouchableOpacity style={{padding:5}}
              onPress={() => {}}>
              <Icon color="#FFF" name="shuffle" size={20} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={{padding:5}}
              onPress={() => {}}
              disabled={!this.state.isInitialized}
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
              onPress={() => {}}
              disabled={!this.state.isInitialized}
            >
              <Icon color="#FFF" name="skip-next" size={30} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={{padding:5}}
              onPress={this.handleDownloadButtonPress.bind(this)}
              disabled={!this.state.isInitialized}
            >
              <Icon color="#FFF" name="download" size={20} />
            </TouchableOpacity>
            </View>
          </View>
        }

      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(App);