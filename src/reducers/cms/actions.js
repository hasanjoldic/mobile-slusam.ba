import {
  SET_CMS_ARTISTS,
  SET_CMS_SEARCH_TEXT,
  SET_CMS_SINGLE_ARTIST,
  ADD_SONG,
  RESET_UPLOAD_SONGS,
  CMS_CHANGE_UPLOAD_TYPE,
  SET_STATE_CMS_UPLOAD_SONG
} from "./index.js";

import {
  LOAD_START, LOAD_FINISH
} from "../app";

import axios from "axios";

import NavigationService from "../../components/nav/NavigationService";

export const getCmsArtists = (searchString) => {
  return async (dispatch, getState) => {
    dispatch({type: LOAD_START});
    const url = searchString ? `http://46.101.191.69:3000/api/v1/search/artists/${searchString}` : 
      "http://46.101.191.69:3000/api/v1/all-artists";
    axios({
      method:'get',
      url
    }).then(res => {
      console.log(res);
      dispatch({
        type: SET_CMS_ARTISTS,
        payload: { cmsArtists: res.data.response }
      });
      dispatch({type: LOAD_FINISH});
    });
  }
};

export const setCmsSearchText = (cmsSearchText) => {
  return {
    type: SET_CMS_SEARCH_TEXT,
    payload: {cmsSearchText}
  }
};

export const cmsSetSingleArtist = (artistName, dontChangeNav) => {
  return async (dispatch, getState) => {
    dispatch({type: LOAD_START});
    if (!dontChangeNav) {
      NavigationService.navigate("CmsSingleArtist");
      dispatch({type: RESET_UPLOAD_SONGS});
    }
    const url = `http://46.101.191.69:3000/api/v1/${artistName}/all-songs`;
    axios({
      method:'get',
      url
    }).then(res => {
      dispatch({
        type: SET_CMS_SINGLE_ARTIST,
        payload: { 
          songs: res.data.response,
          artistName
        }
      });
      dispatch({type: LOAD_FINISH});
    });
  }
};

export const cmsAddSong = song => ({
  type: ADD_SONG,
  payload: {song}
});

export const resetUploadSongs = () => ({
  type: RESET_UPLOAD_SONGS
});

export const cmsChangeUploadType = (id) => ({
  type: CMS_CHANGE_UPLOAD_TYPE,
  payload: {id}
});

export const setStateCmsUploadSong = (id, state) => {
  if (state.youtubeUrl) state.title = "";
  return {
    type: SET_STATE_CMS_UPLOAD_SONG,
    payload: {
      id,
      state
    }
  };
};