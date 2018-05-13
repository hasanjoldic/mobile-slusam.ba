import {
  LOAD_START,
  LOAD_FINISH,
  TRANSMIT_START,
  TRANSMIT_FINISH,
  SET_TRANSMIT_PROGRESS,
  SET_ERROR_MESSAGE,
  CHANGE_IS_CMS
} from "./index.js";

export const loadStart = () => {
  return {
    type: LOAD_START
  };
};

export const loadFinish = () => {
  return {
    type: LOAD_FINISH
  };
};

export const transmitStart = () => {
  return {
    type: TRANSMIT_START
  };
};

export const transmitFinish = () => {
  return {
    type: TRANSMIT_FINISH
  };
};

export const setTransmitProgress = (transmitProgress) => {
  return {
    type: SET_TRANSMIT_PROGRESS,
    payload: {transmitProgress}
  };
};

export const setErrorMessage = (errorMessage) => {
  return {
    type: SET_ERROR_MESSAGE,
    payload: {errorMessage}
  };
};

export const changeIsCms = () => {
  return {
    type: CHANGE_IS_CMS
  };
};