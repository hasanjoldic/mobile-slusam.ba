import {
  NativeModules,
  ToastAndroid
} from "react-native";
import axios from "axios";

import {
  SET_SEARCH_RESULTS,
  SELECT_ARTIST
} from "./index.js";
import { tabValues } from "../tab/index";
import { setActiveTab } from "../tab/actions";

let incrementSecond;

export const search = (text) => {
  return async (dispatch, getState) => {
    if(text.length > 0 && text.length < 4) {
      ToastAndroid.show("Molimo upisite najmanje 4 slova ili ostavite prazno polje da dobijete sve izvodjace.", ToastAndroid.SHORT);
    } else {
      if (!text) {
        axios({
          method:'get',
          url:'http://46.101.191.69:3000/api/v1/all-artists/' + text
        }).then(res => {
          console.log(res.data.response);
          dispatch({
            type: SET_SEARCH_RESULTS,
            payload: {
              searchResults: {
                artists: res.data.response,
                songs :[]
              }
            }
          });
          dispatch(setActiveTab(tabValues.SEARCH_RESULTS));
        });
      } else {
        axios({
          method:'get',
          url:'http://46.101.191.69:3000/api/v1/search/' + text
        }).then(res => {
          dispatch({
            type: SET_SEARCH_RESULTS,
            payload: {
              searchResults: res.data.response
            }
          });
          dispatch(setActiveTab(tabValues.SEARCH_RESULTS));
        });
      }
    }
  }
};

export const selectArtist = (artistName) => {
  return async (dispatch, getState) => {
    const url = `http://46.101.191.69:3000/api/v1/${artistName}/all-songs`;
    axios({
      method:'get',
      url
    }).then(res => {
      dispatch({
        type: SELECT_ARTIST,
        payload: { selectedArtistSongs: res.data.response }
      });
      dispatch(setActiveTab(tabValues.SEARCH_RESULT_ARTIST));
    });
  }
};