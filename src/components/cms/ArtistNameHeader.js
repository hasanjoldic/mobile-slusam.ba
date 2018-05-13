import React from "react";
import {
  View, Text
} from "react-native";

import { cmsColor } from "../../utils/utils";

const ArtistNameHeader = (props) => {
  return (
    <View style={{padding:5,backgroundColor:cmsColor,alignItems:"center"}}>
      <Text style={{color:"#FFF"}}>{props.artistName}</Text>
    </View>
  );
};

export default ArtistNameHeader;