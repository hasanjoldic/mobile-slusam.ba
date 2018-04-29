export const LOAD_START = "app/LOAD_START";
export const LOAD_FINISH = "app/LOAD_FINISH";
export const SET_PROGRESS = "app/SET_PROGRESS";
export const SET_IMAGE_URL = "app/SET_IMAGE_URL";

const INITIAL_STATE = {
    isLoading: false,
    progress: 0,
    fontSize: 16,
    imageUrl: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOAD_START:
      return {
        ...state,
        isLoading: true
      };
    case LOAD_FINISH:
      return {
        ...state,
        isLoading: false
      };
    case SET_PROGRESS:
      return {
        ...state,
        progress: action.payload.progress
      };
      SET_IMAGE_URL
    case SET_IMAGE_URL:
      return {
        ...state,
        imageUrl: action.payload.imageUrl
      };
    default:
      return state;
  }
};