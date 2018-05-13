import React, { Component } from "react";
import {
  View, BackHandler
} from "react-native";
import { connect } from "react-redux";
import { StackNavigator } from 'react-navigation';

import { changeIsCms } from "./reducers/app/actions";
import NavigationService from "./components/nav/NavigationService";

import App from "./components/App";
import Cms from "./components/Cms";

const TopLevelNavigator = StackNavigator({
  App: { screen: App },
  Cms: { screen: Cms }
},
{
  initialRouteName: "App",
  navigationOptions: (navigator) => ({
    header: null
  })
});

class Container extends Component {
  
  constructor(props) {
    super(props);
    BackHandler.addEventListener("hardwareBackPress", () => {
      BackHandler.exitApp();
    });
  }

  render() {
    return (
      <TopLevelNavigator
        ref={navigatorRef => NavigationService.setTopLevelNavigator(navigatorRef)}
      />
    );
  }
}

export default Container;