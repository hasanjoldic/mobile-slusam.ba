import { Alert } from "react-native";
import axios from "axios";

import { host, port } from "../../utils/utils";
import {
  AUTH_LOGIN_START,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAIL,
  AUTH_LOGOUT
} from "./index.js";

export const login = (email, password) => {
  return async (dispatch, getState) => {
    dispatch({
      type: AUTH_LOGIN_START
    });
    axios({
      method: "post",
      url: `${host}:${port}/api/v1/auth/login`,
      responseType: "json",
      data: {
        email: email,
        password: password
      }
    }).then(response => {
      dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: {
          jwt: response.data.jwt,
          user: response.data.user,
          email: response.data.email
        },
      });
      Alert.alert(
        "Willkommen!",
        "MedFor ist eine Messaging App für Gruppen von Ärzten die zusammenarbeiten. " +
        "Sie können Nachrichten schreiben, Fotos teilen und Fragen an ihre Kollegen stellen",
        [
          {text: "Los Geht's!"}
        ],
        { cancelable: false }
      );
    }).catch(error => {
      dispatch({
        type: AUTH_LOGIN_FAIL,
        payload: {
          errorStatus: error.message
        }
      });
      Alert.alert(
        "Fehler",
        "Bitte überprüfen Sie Email und Passwort",
        [
          {text: "OK"}
        ],
        { cancelable: false }
      );
    });
  };
};

export const logOut = () => {
  return {
    type: AUTH_LOGOUT
  };
};