export const LOAD_START = "app/LOAD_START";
export const LOAD_FINISH = "app/LOAD_FINISH";
export const CHANGE_IS_CMS = "app/CHANGE_IS_CMS";
export const SET_ERROR_MESSAGE  ="app/SET_ERROR_MESSAGE";
export const TRANSMIT_START  ="app/TRANSMIT_START";
export const TRANSMIT_FINISH  ="app/TRANSMIT_FINISH";
export const SET_TRANSMIT_PROGRESS  ="app/SET_TRANSMIT_PROGRESS";

const INITIAL_STATE = {
  isLoading: false,
  isTransmitting: false, // use for both upload and download
  transmitProgress: 0,
  errorMessage: "",
  isCms: true
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
    case CHANGE_IS_CMS:
      return {
        ...state,
        isCms: !state.isCms
      };
    case SET_ERROR_MESSAGE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload.errorMessage
      };
    case TRANSMIT_START:
      return {
        ...state,
        isLoading: true,
        isTransmitting: true
      };
    case TRANSMIT_FINISH:
      return {
        ...state,
        isLoading: false,
        isTransmitting: false
      };
    case SET_TRANSMIT_PROGRESS:
      return {
        ...state,
        transmitProgress: action.payload.transmitProgress
      };
    default:
      return state;
  }
};