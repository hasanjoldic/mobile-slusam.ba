import React, { Component } from 'react';
import {
  Text,
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { connect } from "react-redux";
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { login } from "../reducers/auth/actions";
import { selectConversation, importConversations, resetNewInput } from "../reducers/chat/actions";

import {
  Button,
  Input,
  Header
} from "./common";
import Conversation from "./Conversation";
import PostReplyScreen from "./PostReplyScreen";
import ImageViewScreen from "./ImageViewScreen";

class HomeScreen extends Component {
  static navigationOptions = {
    title: "MedFor",
  };

  constructor(props) {
    super(props);
    if (this.props.navigation.state.params && this.props.navigation.state.params.shouldResetFields) {
      this.props.selectConversation(null);
      this.props.resetNewInput();
    }
    this.props.importConversations();
  }

  handleSelectConversation(conversation) {
    this.props.selectConversation(conversation);
    this.props.navigation.navigate('PostReply')
  }

  _onRefresh() {
    this.props.importConversations();
  }

  render() {
    const conversations = this.props.conversations.map((conversation, index) => {
      const { text, staticAssetUid, staticAssetType } = conversation;
      return (
          <View 
            style={{paddingBottom:"5%"}}
            key={"conversation_" + index}
          >
            <Conversation
              conversation={conversation}
              navigation={this.props.navigation}
            />
            <TouchableOpacity 
              style={{}}
              onPress={() => this.handleSelectConversation(conversation)}
            >
              <View style={{backgroundColor:"#0080FF",padding:10,alignItems:"center",alignSelf:"flex-end",width:"80%",marginRight:"5%",marginTop:"10%",borderRadius:5}}>
                <Text style={{color:"#FFF",fontSize:18}}>Antwort schreiben</Text>
              </View>
            </TouchableOpacity>
          </View>
      );
    });
    return (
      <View style={{flex:1}}>
        <ScrollView
        style={{flex:1}}
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          {conversations}
        </ScrollView>
      </View>
    );
  }
}

const styles = {
};

const mapStateToProps = (state) => {
  return {
    conversations: state.chat.conversations,
    selectedConversation: state.chat.selectedConversation,
    refreshing: state.chat.refreshing
  }
};

export default StackNavigator({
  Home: {
    screen: connect(mapStateToProps,{login,selectConversation, importConversations, resetNewInput})(HomeScreen)
  },
  PostReply: {
   screen: PostReplyScreen
  },
  ImageView: {
    screen: ImageViewScreen
  }
},
{
  initialRouteName: 'Home',
  /* The header config from HomeScreen is now here */
  navigationOptions: ({navigation}) => ({
    headerLeft: navigation.state.routeName === "Home" ?
      <TouchableOpacity
        onPress={() => { navigation.navigate('DrawerOpen') }}
      >
        <Icon name="menu" size={40} color="#000"/>
      </TouchableOpacity> : 
      <TouchableOpacity
        onPress={() => {
          if (navigation.state.routeName === "PostReply") {
            navigation.navigate('Home', {shouldResetFields: true});
          } else {
            navigation.goBack();
          }
        }}
      >
        <Icon name="keyboard-backspace" size={40} color="#000"/>
      </TouchableOpacity>,
    headerRight:
      <View style={{flexDirection:"row"}}>
        <TouchableOpacity
          onPress={() => {}}
        >
          <Icon name="dots-vertical" size={40} color="#000"/>
        </TouchableOpacity>
      </View>,
    headerStyle: {
      backgroundColor: "#E5F2FF"
    }
  })
});