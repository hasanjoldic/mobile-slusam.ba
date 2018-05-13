import {
  NativeModules,
  ToastAndroid
} from "react-native";

import {
  tabValues,
  SET_ACTIVE_TAB
} from "./index.js";

export const setActiveTab = (activeTab) => {
  return {
    type: SET_ACTIVE_TAB,
    payload: {activeTab}
  };
};