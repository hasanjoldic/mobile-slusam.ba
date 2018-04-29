import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  TextInput,
  WebView
} from "react-native";
import { connect } from "react-redux";

import VideoPlayer from 'react-native-video-player';
import FitImage from 'react-native-fit-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { updateLike } from "../reducers/chat/actions";
import { setImageUrl } from "../reducers/app/actions";
import { formatDateWithTime, host, port } from "../utils/utils"; 

const win = Dimensions.get('window');

class Conversation extends Component {
  render() {
    const {
      headerText
    } = this.props;

    const {
      conversationOuterContainer,
      conversationInnerContainer
    } = styles;

    const { createdAt, text, staticAssetType, staticAssetUid, User } = this.props.conversation;
    let Replies = this.props.conversation.Replies;
    const renderReplies = () => {
      Replies = Replies.sort((a, b) => {
        a = new Date(a.createdAt).getTime();
        b = new Date(b.createdAt).getTime();
        return a - b;
      });
      return Replies.map((reply, index) => {
        const { text, staticAssetType, staticAssetUid } = reply;
        const likes = reply.Likes.length;
        let didUserLike = false;
        console.log("REPLY", reply);
        reply.Likes.forEach(like => {
          if (like.userId === this.props.user.id) {
            didUserLike = true;
          }
        });
        return (
          <View 
            style={{marginLeft:"5%", paddingLeft:"10%",paddingBottom:10,borderBottomWidth:1,borderLeftWidth:1,
              borderColor:"#00000011", paddingTop:10}}
            key={`reply_${index}`}
          >
            <View style={{flexDirection:"row",justifyContent:"space-between",marginBottom:0,backgroundColor:"#00000011",
              padding:5}}>
              <Text>{reply.User.name}</Text>
              <Text>{formatDateWithTime(reply.createdAt)}</Text>
            </View>
            {staticAssetType === "image" && 
              <TouchableWithoutFeedback onPress={() => {
                this.props.setImageUrl(`${host}:${port}/assets/${staticAssetUid}.jpg`);
                this.props.navigation.navigate("ImageView")
              }}>
              <FitImage 
                style={{marginBottom:0}}
                source={{uri: `${host}:${port}/assets/${staticAssetUid}_small.jpg`}} 
              />
              </TouchableWithoutFeedback>
            }
            {staticAssetType === "video" && 
              <VideoPlayer 
                style={{marginBottom:0}}
                video={{uri: `${host}:${port}/assets/${staticAssetUid}`}} 
              />
            }
            <Text style={{backgroundColor:"#FFF",padding:5}}>{text}</Text>
            <TouchableOpacity
              style={{marginTop:10,marginRight:20,alignSelf:"flex-end",flexDirection:"row",alignItems:"center"}}
              onPress={() => this.props.updateLike(reply.id)}
            >
              {likes > 0 && <Text style={{fontSize:20,marginRight:5}}>{likes}</Text>}<Icon name={didUserLike > 0 ? "star" : "star-outline"} size={30}/>
            </TouchableOpacity>
          </View>
        );
      });
    };
    return (
      <View style={{}}>
        <View style={{flexDirection:"row",justifyContent:"space-between",backgroundColor:"#00000011",padding:5}}>
          <Text style={{color: "#000"}}>{User ? User.name : "Anonym"}</Text>
          <Text style={{color: "#000"}}>{formatDateWithTime(createdAt)}</Text>
        </View>
        <View style={conversationInnerContainer}>
          {staticAssetType === "image" && 
           <TouchableWithoutFeedback onPress={() => {
              this.props.setImageUrl(`${host}:${port}/assets/${staticAssetUid}.jpg`);
              this.props.navigation.navigate("ImageView")
            }}>
            <FitImage
              style={{marginBottom:0}}
              source={{uri: `${host}:${port}/assets/${staticAssetUid}_small.jpg`}} 
            />
            </TouchableWithoutFeedback>
          }
          {staticAssetType === "video" && 
            <VideoPlayer 
              style={{marginBottom:0}}
              video={{uri: `${host}:${port}/assets/${staticAssetUid}.mp4`}} 
            />
          }
          <Text style={{fontSize: this.props.fontSize,backgroundColor:"#FFF",padding:5}}>
            {text}
          </Text>
        </View>
        <View style={{marginLeft:"5%"}}>
          {renderReplies()}
        </View>
      </View>
    );
  }
};

const styles = {
  conversationOuterContainer: {},
  conversationInnerContainer: {
    paddingTop: 10, paddingBottom: 10
  }
};

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    fontSize: state.app.fontSize
  };
};

export default connect(mapStateToProps, {updateLike, setImageUrl})(Conversation);