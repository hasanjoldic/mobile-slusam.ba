import {
  NativeModules
} from "react-native";

const SlusajMediaPlayer = NativeModules.SlusajMediaPlayer;
import MusicControl from 'react-native-music-control';

import {
  INIT_SONG,
} from "./index.js";

export const initSong = (song) => {
  // clearInterval(this.intervalFunction);
  let urlString = song.name + "/" + song.title + ".mp3";
  urlString = urlString.replace(/ /g, "%20");
  SlusajMediaPlayer.init("http://46.101.191.69:8080/artists/" + urlString, (duration) => {
    this.setState({duration,isInitialized: true,isPlaying: true});
    // this.intervalFunction = setInterval(() => this.getCurrentPosition(), 1000);
    // SlusajMediaPlayer.start();
    MusicControl.setNowPlaying({
      title: song.title,
      artist: song.name,
      artwork: "http://46.101.191.69:8080/artists/Mile%20Kitic/img.jpg"
    });
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PLAYING
    });
  });
  return {
    type: INIT_SONG,
    payload: {song}
  };
};

export const loadFinish = () => {
  return {
    type: LOAD_FINISH
  };
};

export const setProgress = (progress) => {
  return {
  	type: SET_PROGRESS,
  	payload: {
  	  progress
  	}
  };
};

export const setImageUrl = (imageUrl) => {
  return {
  	type: SET_IMAGE_URL,
  	payload: {
  	  imageUrl
  	}
  };
};