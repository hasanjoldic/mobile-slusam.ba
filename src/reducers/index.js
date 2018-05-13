import { combineReducers } from "redux";
import auth from "./auth";
import music from "./music";
import search from "./search";
import tab from "./tab";
import app from "./app";
import cms from "./cms";
import nav from "./nav";

export default combineReducers({
	app,
  auth,
  music,
  search,
  tab,
  cms,
  nav
});
