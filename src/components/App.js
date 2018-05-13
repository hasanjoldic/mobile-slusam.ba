import React, { Component } from "react";
import {
  Text, View, Keyboard, Image, StatusBar, BackHandler, Animated
} from "react-native";
import { connect } from "react-redux";
import MusicControl from "react-native-music-control";

import { tabValues } from "../reducers/tab/index";
import { goBack, setNav } from "../reducers/nav/actions";
import { 
  initSong, pauseJava, addToNowPlayingList
} from "../reducers/music/actions";

import MainHeader from "./MainHeader";
import TabGroup from "./TabGroup";
import MusicPlayerControls from "./MusicPlayerControls";
import SearchResultList from "./SearchResultList";
import NowPlaying from "./NowPlaying";

class App extends Component<Props> {

  state = {
    isKeyboardActive: false,
    addSongFontSize: new Animated.Value(0),
    isAddingSong: false
  };

  timeoutFunction = null;

  constructor(props) {
    super(props);
    Keyboard.addListener('keyboardDidShow', () => {
      this.setState({isKeyboardActive: true});
    });
    Keyboard.addListener('keyboardDidHide', () => {
      this.setState({isKeyboardActive: false});
    });
    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.goBack();
      return true;
    });
    
  }

  componentDidMount() {
    this.props.setNav("App");
  }

  handleAddSong() {
    //clearTimeout(this.timeoutFunction);
    this.setState({isAddingSong: true});
    setTimeout(() => {
      this.setState({
        isAddingSong: false,
        addSongFontSize: new Animated.Value(0)
      });
    }, 500);
    Animated.timing(
      this.state.addSongFontSize,
      {
        toValue: 20,
        duration: 500,
      }
    ).start();
  }

  renderActiveTab() {
    switch (this.props.activeTab) {
      case tabValues.PLAYING:
        return <NowPlaying />;
      case tabValues.SEARCH_RESULTS:
        return <SearchResultList onAddSong={this.handleAddSong.bind(this)} />;
      case tabValues.SEARCH_RESULT_ARTIST:
        return <SearchResultList onAddSong={this.handleAddSong.bind(this)} />;
      case tabValues.PLAYLISTS:
        return <View style={{flex:1}}></View>;
    }
  }

  render() {
    return (
      <View style={{flex:1}}>
        {/*<StatusBar barStyle="light-content" hidden ={false} 
          backgroundColor={this.props.isCms ? "#C7B12DBB" : "#0080FFBB"} /> */}
        {/*{!this.state.isKeyboardActive && <MusicPlayerControls />}*/}
        <MainHeader navigation={this.props.navigation} />
        <TabGroup isAddingSong={this.state.isAddingSong} addSongFontSize={this.state.addSongFontSize} />
        {this.renderActiveTab()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { music, tab } = state;
  return {
    isInitialized: music.isInitialized,
    isPlaying: music.isPlaying,
    songPosition: music.songPosition,
    songDuration: music.songDuration,
    isSliderDragging: music.isSliderDragging,
    nowPlayingList: music.nowPlayingList,
    isDownloading: music.isDownloading,
    downloadProgress: music.downloadProgress,
    activeTab: tab.activeTab
  };
};

export default connect(mapStateToProps, {
  initSong, pauseJava, addToNowPlayingList, goBack, setNav
})(App);