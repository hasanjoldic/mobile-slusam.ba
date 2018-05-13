import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { cmsColor } from "../../utils/utils";

const AddButtonCircle = props => {
  return (
    <TouchableOpacity
      elevation={10}
      onPress={props.onPress}
      style={{
        position:"absolute",bottom:10,right:10,padding:10,
        backgroundColor:cmsColor,borderRadius:1000,alignItems:"center"
      }}>
      <Icon color="#FFF" name="plus" size={50} />
    </TouchableOpacity>
  );
};

export default AddButtonCircle;