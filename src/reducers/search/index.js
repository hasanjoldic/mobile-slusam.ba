export const SET_SEARCH_RESULTS = "search/SET_SEARCH_RESULTS";
export const SELECT_ARTIST = "search/SELECT_ARTIST";

const INITIAL_STATE = {
  searchResults: {
    artists: [],
    songs: [] 
  },
  selectedArtistSongs: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload.searchResults
      };
    case SELECT_ARTIST:
      return {
        ...state,
        selectedArtistSongs: action.payload.selectedArtistSongs
      };
    default:
      return state;
  }
};