import React, { Component } from "react";
import {
} from "react-native";
import { StackNavigator } from 'react-navigation';

import {
  CmsArtists, CmsSingleArtist, CmsNewArtist, CmsHeader
} from "./cms";

export default StackNavigator({
  CmsArtists: { screen: CmsArtists },
  CmsSingleArtist: { screen: CmsSingleArtist },
  CmsNewArtist: { screen: CmsNewArtist }
},
{
  initialRouteName: "CmsArtists",
  navigationOptions: ({navigation}) => ({
    header: <CmsHeader headerText="slusam.ba" navigation={navigation} />
  })
});