import {
  NativeModules,
  ToastAndroid
} from "react-native";
import RNFetchBlob from "react-native-fetch-blob";

const SlusajMediaPlayer = NativeModules.SlusajMediaPlayer;
import MusicControl from "react-native-music-control";

import {
  INIT_SONG,
  LOAD_SONG,
  RESUME_SONG,
  PAUSE_SONG,
  SET_SONG_POSITION,
  INCREMENT_SONG_POSITION,
  PAUSE_JAVA,
  CHANGE_SLIDER_DRAG,
  ADD_TO_NOW_PLAYING_LIST,
  CHANGE_IS_DOWNLOADING,
  SET_DOWNLOAD_PROGRESS,
  LAST_SONG_COMPLETED
} from "./index.js";

_play = () => {
  SlusajMediaPlayer.start();
  MusicControl.updatePlayback({
    state: MusicControl.STATE_PLAYING
  });
  return {type: RESUME_SONG};
}

/*
_next() {
  const { nowPlayingList, nowPlayingSongIndex } = this.state;
  if (nowPlayingSongIndex !== nowPlayingList.length-1) {
    this.props.initSong(this.state.nowPlayingList[this.state.nowPlayingSongIndex+1]);
    this.setState({nowPlayingSongIndex: this.state.nowPlayingSongIndex+1});
  }
}

_previous() {
  const { nowPlayingList, nowPlayingSongIndex } = this.state;
  if (this.state.currentPosition > 3000) {
    SlusajMediaPlayer.seekTo(0);
  } else if (nowPlayingSongIndex !== 0) {
    this.props.initSong(this.state.nowPlayingList[this.state.nowPlayingSongIndex-1]);
    this.setState({nowPlayingSongIndex: this.state.nowPlayingSongIndex-1});
  }
}
*/

MusicControl.enableControl('play', true);
MusicControl.enableControl('pause', true);
MusicControl.enableControl('nextTrack', true);
MusicControl.enableControl('previousTrack', true);
MusicControl.enableControl('closeNotification', true, {when: 'paused'});

let incrementSecond;


export const initSong = (song, index) => {
  return async (dispatch, getState) => {
    dispatch(loadSong(song));
    clearInterval(incrementSecond);
    let urlString = song.name + "/" + song.title + ".mp3";
    urlString = urlString.replace(/ /g, "%20");
    const artistNameUrl = song.name.replace(/ /g, "%20");
    SlusajMediaPlayer.init("http://46.101.191.69:8080/artists/" + urlString, (songDuration) => {
      dispatch({
        type: INIT_SONG,
        payload: {
          song,
          songDuration,
          index
        }
      });
      incrementSecond = setInterval(() => {
        SlusajMediaPlayer.getCurrentPosition((songPosition) => {
          dispatch({type: SET_SONG_POSITION, payload:{songPosition}});
        });
      }, 1000);
      MusicControl.setNowPlaying({
        title: song.title,
        artist: song.name,
        artwork: `http://46.101.191.69:8080/artists/${artistNameUrl}/img_SMALL.jpg`
      });
      MusicControl.enableControl("nextTrack", 
        getState().music.nowPlayingIndex < getState().music.nowPlayingList.length-1);
      MusicControl.enableControl("previousTrack", getState().music.nowPlayingIndex !== 0);
      MusicControl.updatePlayback({
        state: MusicControl.STATE_PLAYING
      });
    });
  }
};

export const loadSong = (song) => ({
  type: LOAD_SONG,
  payload: {song}
});

export const pause = () => {
  SlusajMediaPlayer.pause();
  MusicControl.updatePlayback({
    state: MusicControl.STATE_PAUSED
  });
  clearInterval(incrementSecond); 
  return {type: PAUSE_SONG};
};

export const play = () => {
  return async (dispatch, getState) => {
    SlusajMediaPlayer.start();
    MusicControl.updatePlayback({
      state: MusicControl.STATE_PLAYING
    });
    // incrementSecond = setInterval(() => {
    //   dispatch({
    //     type: INCREMENT_SONG_POSITION,
    //   })
    // }, 1000);
    incrementSecond = setInterval(() => {
      SlusajMediaPlayer.getCurrentPosition((songPosition) => {
        dispatch({type: SET_SONG_POSITION, payload:{songPosition}});
      });
    }, 1000);
    dispatch({type: RESUME_SONG});
  }
}

export const lastSongCompleted = () => {
  clearInterval(incrementSecond);  
  return {
    type: LAST_SONG_COMPLETED
  }
};

export const previous = () => {
  return async (dispatch, getState) => {
    const { nowPlayingIndex, nowPlayingList, songPosition } = getState().music;
    if (nowPlayingIndex !== 0) {
      if (songPosition < 5000) {
        dispatch(initSong(nowPlayingList[nowPlayingIndex-1], nowPlayingIndex-1));
      } else {
        dispatch(seekTo(0));
      }
    } else {
      dispatch(seekTo(0));
    }
  };
}

export const next = () => {
  return async (dispatch, getState) => {
    const { nowPlayingIndex, nowPlayingList } = getState().music;
    if (nowPlayingIndex < nowPlayingList.length-1) {
      dispatch(initSong(nowPlayingList[nowPlayingIndex+1], nowPlayingIndex+1));
    } else {
      dispatch(lastSongCompleted());
    }
  };
}

export const previousSong = () => {
  return async (dispatch, getState) => {
    const { nowPlayingIndex, nowPlayingList } = getState().music;
    if (nowPlayingIndex < nowPlayingList.length-1) {
      // props.initSong(nowPlayingList[nowPlayingSongIndex+1]);
      // self.setState({nowPlayingSongIndex: nowPlayingIndex+1});
    }
  };
}

export const changeSliderDrag = (isSliderDragging) => {
  return {
    type: CHANGE_SLIDER_DRAG,
    payload: {isSliderDragging}
  };
};

export const seekTo = (songPosition) => {
  return async (dispatch, getState) => {
    SlusajMediaPlayer.seekTo(songPosition);
    dispatch({type: CHANGE_SLIDER_DRAG, payload: {isSliderDragging:false}});
    dispatch({type: SET_SONG_POSITION, payload: {songPosition:songPosition}});
  }
};

export const addToNowPlayingList = (song) => {
  return {
    type: ADD_TO_NOW_PLAYING_LIST,
    payload: {
      song
    }
  };
};

export const downloadSong = () => {
  return async (dispatch, getState) => {
    const music = getState().music;
    const song = music.nowPlayingList[music.nowPlayingIndex];
    let url = "http://46.101.191.69:8080/artists/" + song.name + "/" + song.title + ".mp3";
    ToastAndroid.showWithGravity(
      'Skidam pjesmu...',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
    dispatch({type: CHANGE_IS_DOWNLOADING, payload: {isDownloading: true}});
    RNFetchBlob.fetch('GET', url)
    .progress((received, total) => {
      dispatch({
        type: SET_DOWNLOAD_PROGRESS,
        payload: { downloadProgress: Math.round(received/total*100) }
      });
    }).then(res => {
      dispatch({type: CHANGE_IS_DOWNLOADING, payload: { isDownloading: false }});
      dispatch({type: SET_DOWNLOAD_PROGRESS, payload: { downloadProgress: 0 }});
      RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DownloadDir + "/" + song.name + " - " + song.title + ".mp3", res.data, "base64").then(() => {
        ToastAndroid.show(
          'Pjesma je uspjesno skinuta.',
          ToastAndroid.SHORT
        );
      });
    }).catch(() => {
      dispatch({type: CHANGE_IS_DOWNLOADING, payload: { isDownloading: false }});
      dispatch({type: SET_DOWNLOAD_PROGRESS, payload: { downloadProgress: 0 }});
      ToastAndroid.showWithGravity(
        'Doslo je do greske prilikom skidanja pjesme.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    })
  }
};