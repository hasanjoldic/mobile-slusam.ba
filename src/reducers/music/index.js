export const INIT_SONG = "music/INIT_SONG";


const INITIAL_STATE = {
  isPlaying: false,
  nowPlayingSong: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_SONG:
      return {
        ...state,
        isLoading: true,
        nowPlayingSong: action.payload.song
      };
    default:
      return state;
  }
};