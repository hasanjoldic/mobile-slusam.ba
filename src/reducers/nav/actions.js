import {
  NativeModules,
  ToastAndroid,
  BackHandler
} from "react-native";

import {
  SET_NAV,
  SET_CMS_NAV
} from "./index.js";

import NavigationService from "../../components/nav/NavigationService";

export const setNav = (nav) => {
  return {
    type: SET_NAV,
    payload: {nav}
  };
};

export const goBack = () => {
  return async (dispatch, getState) => {
    const { nav } = getState().nav;
    switch (nav) {
      case "App":
        return BackHandler.exitApp();
      case "CmsArtists":
        return NavigationService.navigate("App");
      case "CmsSingleArtist":
        return NavigationService.navigate("CmsArtists");
      case "CmsNewArtist":
        return NavigationService.navigate("CmsArtists");
    }
  }
};

export const setCmsNav = (cmsNav) => {
  return {
    type: SET_CMS_NAV,
    payload: {cmsNav}
  };
};