export const SET_ACTIVE_TAB = "search/SET_ACTIVE_TAB";

export const tabValues = {
  PLAYING: "playing",
  SEARCH_RESULTS: "searchResults",
  SEARCH_RESULT_ARTIST: "searchResultArtist",
  PLAYLISTS: "playlists"
}

const INITIAL_STATE = {
  activeTab: tabValues.PLAYING,
  addingSong: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload.activeTab
      };
    default:
      return state;
  }
};