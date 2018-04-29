import React, { Component } from "react";
import {
	Image,
	TouchableOpacity
} from "react-native";
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import EntryStackNavigator from "./EntryStackNavigator";
import StartConversationScreen from "./Screens/StartConversationScreen";
import PostReplyScreen from "./PostReplyScreen";
import SettingsScreen from "./Screens/SettingsScreen";

export default DrawerNavigator({
  Home: {
    screen: EntryStackNavigator
  },
  StartConversationNavigator: {
    screen: StackNavigator({
		  StartConversationNavigatorScreen: {
		    screen: PostReplyScreen
		  }
		},
		{
	  /* The header config from HomeScreen is now here */
	  navigationOptions: ({ navigation }) => ({
	    headerTitle: "Neue Konversation",
	    headerLeft: 
	      <TouchableOpacity
	        onPress={() => { navigation.navigate('DrawerOpen') }}
	      >
	        <Icon name="menu" size={40} />
	      </TouchableOpacity>
	  })
	})
  }},
  {
    initialRouteName: 'Home',
    navigationOptions: ({ navigation }) => ({
	    headerTitle: JSON.stringify(this.props)
	  }),
  	contentOptions: {
	  	activeBackgroundColor: "#E5F2FF",
	  	activeTintColor: "#000",
	}}
);
