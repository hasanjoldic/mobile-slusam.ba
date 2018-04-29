import React from "react";
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";

const Header = (props) => {
  const {
    headerText
  } = props;

  const {
    headerTextStyle,
    headerContainerStyle
  } = styles;
  return (
    <View style={{...headerContainerStyle, ...props.headerContainerStyle}}>
      <Text style={{...headerTextStyle, ...props.headerTextStyle}}>{headerText}</Text>
      <TouchableOpacity>
        <Image 
          source={require("../../static/images/more_vert_black.png")}
          style={{ width: 40, height: 40}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  headerTextStyle: {
    fontSize: 20,
    width: "70%"
  },
  headerContainerStyle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFF",
    maxHeight: 200,
  }
};

export { Header };