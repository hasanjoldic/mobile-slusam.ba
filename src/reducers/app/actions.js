import { Alert } from "react-native";

import {
  LOAD_START,
  LOAD_FINISH,
  SET_PROGRESS,
  SET_IMAGE_URL
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