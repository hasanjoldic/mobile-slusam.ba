export const INIT_SONG = "music/INIT_SONG";
export const LOAD_SONG = "music/LOAD_SONG";
export const RESUME_SONG = "music/RESUME_SONG";
export const PAUSE_SONG = "music/PAUSE_SONG";
export const SET_SONG_POSITION = "music/SET_SONG_POSITION";
export const SET_SONG_DURATION = "music/SET_SONG_DURATION";
export const INCREMENT_SONG_POSITION = "music/INCREMENT_SONG_POSITION";
export const PAUSE_JAVA = "music/PAUSE_JAVA";
export const CHANGE_SLIDER_DRAG = "music/CHANGE_SLIDER_DRAG";
export const ADD_TO_NOW_PLAYING_LIST = "music/ADD_TO_NOW_PLAYING_LIST";
export const CHANGE_IS_DOWNLOADING = "music/CHANGE_IS_DOWNLOADING";
export const SET_DOWNLOAD_PROGRESS = "music/SET_DOWNLOAD_PROGRESS";
export const LAST_SONG_COMPLETED = "music/LAST_SONG_COMPLETED";

const INITIAL_STATE = {
  isInitialized: false,
  isPlaying: false,
  songPosition: 0, // ms
  songDuration: 0, //ms
  nowPlayingSong: null,
  loadingSong: null,
  isLoadingSong: false,
  isSliderDragging: false,
  nowPlayingList: [],
  nowPlayingIndex: 0,
  isDownloading: false,
  downloadProgress: 0 // 0-100
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_SONG:
      const { songDuration, song, index } = action.payload;
      return {
        ...state,
        isInitialized :true,
        isPlaying: true,
        isLoadingSong: false,
        loadingSong: song,
        songPosition: 0,
        songDuration: songDuration,
        nowPlayingSong: song,
        nowPlayingList: index === undefined ? [song] : state.nowPlayingList,
        nowPlayingIndex: index === undefined ? 0 : index
      };
    case RESUME_SONG:
      return {
        ...state,
        isPlaying: true
      };
    case LOAD_SONG:
      return {
        ...state,
        loadingSong: action.payload.song,
        isLoadingSong: true
      };
    case PAUSE_SONG:
      return {
        ...state,
        isPlaying: false
      };
    case SET_SONG_POSITION:
      return {
        ...state,
        songPosition: action.payload.songPosition
      };
    case INCREMENT_SONG_POSITION:
      return {
        ...state,
        songPosition: state.songPosition + 1000
      };
    case PAUSE_JAVA:
      return {
        ...state,
        isPlaying: false
      };
    case CHANGE_SLIDER_DRAG:
      return {
        ...state,
        isSliderDragging: action.payload.isSliderDragging
      };
    case ADD_TO_NOW_PLAYING_LIST:
      return {
        ...state,
        nowPlayingList: [...state.nowPlayingList, action.payload.song]
      };
    case CHANGE_IS_DOWNLOADING:
      return {
        ...state,
        isDownloading: action.payload.isDownloading
      };
    case SET_DOWNLOAD_PROGRESS:
      return {
        ...state,
        downloadProgress: action.payload.downloadProgress
      };
    case LAST_SONG_COMPLETED:
      return {
        ...state,
        isPlaying: false,
        songPosition: 0
      };
    default:
      return state;
  }
};