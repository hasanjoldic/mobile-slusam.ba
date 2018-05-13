export const SET_CMS_ARTISTS = "cms/SET_ARTISTS";
export const SET_CMS_SEARCH_TEXT = "cms/SET_CMS_SEARCH_TEXT";
export const SET_CMS_SINGLE_ARTIST = "cms/SET_CMS_SINGLE_ARTIST";
export const ADD_SONG = "cms/ADD_SONG";
export const RESET_UPLOAD_SONGS = "cms/RESET_UPLOAD_SONGS";
export const CMS_CHANGE_UPLOAD_TYPE = "cms/CMS_CHANGE_UPLOAD_TYPE";
export const SET_STATE_CMS_UPLOAD_SONG  ="cms/SET_STATE_CMS_UPLOAD_SONG";

// uploadSongList = [{
//   title: "Song title",
//   uri: "Uri",
//   size: "3.4"
// }]

const INITIAL_STATE = {
  cmsArtists: [],
  cmsSearchText: "",
  cmsSingleArtist: {
    songs: [],
    artistName: ""
  },
  cmsUploadSongList: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_CMS_ARTISTS:
      return {
        ...state,
        cmsArtists: action.payload.cmsArtists
      };
    case SET_CMS_SEARCH_TEXT:
      return {
        ...state,
        cmsSearchText: action.payload.cmsSearchText
      };
    case SET_CMS_SINGLE_ARTIST:
      return {
        ...state,
        cmsSingleArtist: { 
          songs: action.payload.songs,
          artistName: action.payload.artistName
        }
      };
    case ADD_SONG:
      return {
        ...state,
        cmsUploadSongList: [...state.cmsUploadSongList, action.payload.song]
      };
    case RESET_UPLOAD_SONGS:
      return {
        ...state,
        cmsUploadSongList: []
      };
    case CMS_CHANGE_UPLOAD_TYPE:
      return {
        ...state,
        cmsUploadSongList: state.cmsUploadSongList.map(song => {
          return song.id === action.payload.id ? {...song, isYoutube: !song.isYoutube} : song
        })
      };
    case SET_STATE_CMS_UPLOAD_SONG:
      return {
        ...state,
        cmsUploadSongList: state.cmsUploadSongList.map(song => {
          return song.id === action.payload.id ? {...song, ...action.payload.state} : song
        })
      };
    default:
      return state;
  }
};