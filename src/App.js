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
  StatusBar,
  Image,
  DeviceEventEmitter
} from 'react-native';
import { connect } from "react-redux";
import { StackNavigator } from 'react-navigation';
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'react-native-fetch-blob'
import RNFS from 'react-native-fs';
import { Circle } from 'react-native-progress';
import MusicControl from 'react-native-music-control';

const SlusajMediaPlayer = NativeModules.SlusajMediaPlayer;

import { initSong } from "./reducers/music/actions";
import { formatTime } from "./utils/utils";
import TabGroup, { tabValues } from "./components/TabGroup";

class App extends Component<Props> {

  state = {
    duration: 0, //ms
    currentPosition: 0, //ms
    isPlaying: false,
    isSliderActive: false,
    songs: [],
    activeTab: tabValues.PLAYING,
    searchResults: <View style={{flex:1}}></View>,
    playlists: <View style={{flex:1}}></View>,
    nowPlayingList: [],
    nowPlayingSongIndex: null,
    isKeyboardActive: false,
    isInitialized: false,
    isDownloading: false,
    downloadProgress: 0,
    selectedArtistSongList: []
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
    const self = this;
    DeviceEventEmitter.addListener("SlusajMediaPlayer_PAUSE", function(e) {
      MusicControl.updatePlayback({
        state: MusicControl.STATE_PAUSED
      });
      self.setState({isPlaying:false});
    });
    DeviceEventEmitter.addListener("SlusajMediaPlayer_COMPLETION", function(e) {
      if (self.state.nowPlayingSongIndex < self.state.nowPlayingList.length-1) {
        self.handleSongPress(self.state.nowPlayingList[self.state.nowPlayingSongIndex+1]);
        self.setState({nowPlayingSongIndex: self.state.nowPlayingSongIndex+1});
      } else {
        self.setState({isPlaying:false});
      }
    });
    
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('nextTrack', true);
    MusicControl.enableControl('previousTrack', true);
    MusicControl.enableControl('closeNotification', true, {when: 'paused'});

    MusicControl.on("pause", ()=> {
      this._pause();
    });

    MusicControl.on('play', ()=> {
      this._play();
    })

    MusicControl.on('nextTrack', () => {
      this._next();
    });

    MusicControl.on('previousTrack', () => {
      this._previous();
    });
  }

  componentDidUpdate(prevProps, prevState) {
  }

  _play() {
    clearInterval(this.intervalFunction);
    this.intervalFunction = setInterval(() => this.getCurrentPosition(), 1000);
    SlusajMediaPlayer.start();
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PLAYING
    });
    this.setState({isPlaying:true});
  }

  _pause() {
    SlusajMediaPlayer.pause();
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PAUSED
    });
    this.setState({isPlaying:false});
  }

  _next() {
    const { nowPlayingList, nowPlayingSongIndex } = this.state;
    if (nowPlayingSongIndex !== nowPlayingList.length-1) {
      this.handleSongPress(this.state.nowPlayingList[this.state.nowPlayingSongIndex+1]);
      this.setState({nowPlayingSongIndex: this.state.nowPlayingSongIndex+1});
    }
  }

  _previous() {
    const { nowPlayingList, nowPlayingSongIndex } = this.state;
    if (this.state.currentPosition > 3000) {
      SlusajMediaPlayer.seekTo(0);
    } else if (nowPlayingSongIndex !== 0) {
      this.handleSongPress(this.state.nowPlayingList[this.state.nowPlayingSongIndex-1]);
      this.setState({nowPlayingSongIndex: this.state.nowPlayingSongIndex-1});
    }
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

  handleSongPress(song) {
    clearInterval(this.intervalFunction);
    let urlString = song.name + "/" + song.title + ".mp3";
    urlString = urlString.replace(/ /g, "%20");
    SlusajMediaPlayer.init("http://46.101.191.69:8080/artists/" + urlString, () => {
      SlusajMediaPlayer.getDuration((duration) => this.setState({duration,isInitialized: true,isPlaying: true}));
      this.intervalFunction = setInterval(() => this.getCurrentPosition(), 1000);
      SlusajMediaPlayer.start();
      MusicControl.setNowPlaying({
        title: song.title,
        artist: song.name,
        artwork: "http://46.101.191.69:8080/artists/Mile%20Kitic/img.jpg"
      });
      MusicControl.updatePlayback({
        state: MusicControl.STATE_PLAYING
      });
    });
  }

  renderSongList() {
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
              // this.handleSongPress(song);
              this.props.initSong(song);
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
      const selectedArtistSongList = this.state.selectedArtistSongList.map((song, index) => {
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
      return <View style={{flex:1,padding:5}}>{selectedArtistSongList}</View>;
    } else if (activeTab === tabValues.PLAYLISTS) {
      return this.state.playlists;
    }
  }

  handleSelectArtist(artistName) {
    axios({
      method:"get",
      url:`http://46.101.191.69:3000/api/v1/${artistName}/all-songs/`
    }).then(res => {
      this.setState({activeTab:tabValues.SEARCH_RESULT_ARTIST, selectedArtistSongList: res.data.response})
    });
  }

  handleSubmitEditing() {
    if(!this.state.text || this.state.text.length < 4) {
      ToastAndroid.show("Molimo upisite najmanje 4 slova", ToastAndroid.SHORT);
    } else {
      axios({
        method:'get',
        url:'http://46.101.191.69:3000/api/v1/search/' + this.state.text
      }).then(res => {
        const searchResultListArtists = res.data.response.artists.map((artist, index) => {
          return (
            <TouchableOpacity 
              key={"artist_key_" + index}
              onPress={() => this.handleSelectArtist.call(this, artist.name)}
              style={{
                flexDirection:"row",padding:10,alignItems:"center",
                justifyContent:"space-between",backgroundColor:"#FFF",marginBottom:2,
                borderRadius:5,borderColor:"#0080FF",borderWidth:1
              }}>
              <View style={{flexDirection:"row", alignItems:"center"}}>
                <View style={{backgroundColor:"#FFF"}}>
                  <Image 
                    source={{uri: `http://46.101.191.69:8080/artists/${artist.name}/img.jpg`}} 
                    style={{
                      width:50,height:50,padding:5,borderWidth:1,borderColor:"#0080FF",
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
        });

        const searchResultListSongs = res.data.response.songs.map((song, index) => {
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
        const searchResultList = (
          <View>
            {searchResultListArtists}
            {searchResultListSongs}
          </View>
        );
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
    this.setState({isDownloading: true});
    RNFetchBlob.fetch('GET', url)
    .progress((received, total) => {
      this.setState({downloadProgress: Math.round(received/total*100)});
    }).then(res => {
      this.setState({isDownloading:false,downloadProgress:0});
      RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DownloadDir + "/" + song.name + " - " + song.title + ".mp3", res.data, "base64").then(() => {
        ToastAndroid.show(
          'Pjesma je uspjesno skinuta.',
          ToastAndroid.SHORT
        );
      });
    }).catch(() => {
      this.setState({isDownloading:false,downloadProgress:0});
      ToastAndroid.showWithGravity(
        'Doslo je do greske prilikom skidanja pjesme.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    })
  }

  checkNextAndPreviousButtons() {
    const { nowPlayingSongIndex, nowPlayingList } = this.state;
    if (nowPlayingSongIndex === 0) {
      MusicControl.enableControl('previousTrack', false);
    } else {
      MusicControl.enableControl('previousTrack', true);
    }
    if (nowPlayingSongIndex === nowPlayingList.length-1) {
      MusicControl.enableControl('nextTrack', false);
    } else {
      MusicControl.enableControl('nextTrack', true);
    }
  }

  handleSetActiveTab(tab) {
    this.setState({activeTab: tab});
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

        <TabGroup 
          activeTab={this.state.activeTab} 
          setActiveTab={this.handleSetActiveTab.bind(this)}
          selectedArtistSongList={this.state.selectedArtistSongList}
        />

      {/* ////////////////// */}

      {this.renderActiveTab()}
      
      {/* ////////////////// */}

        {!this.state.isKeyboardActive &&
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
        }

      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps, {initSong})(App);