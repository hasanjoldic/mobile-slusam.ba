import React, { Component } from "react";
import {
	Text, View, TouchableOpacity, ScrollView, RefreshControl, Keyboard, FlatList
} from "react-native";
import { connect } from "react-redux";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DocumentPicker, DocumentPickerUtil } from "react-native-document-picker";

import { cmsColor } from "../../utils/utils";
import { initSong } from "../../reducers/music/actions";
import { setNav } from "../../reducers/nav/actions";
import { cmsAddSong, cmsSetSingleArtist } from "../../reducers/cms/actions";
import { 
  transmitStart, transmitFinish, setTransmitProgress, setErrorMessage 
} from "../../reducers/app/actions";

import AddButtonCircle from "./AddButtonCircle";
import StatusWrapper from "../hoc/StatusWrapper";
import ArtistNameHeader from "./ArtistNameHeader";
import SingleSongUpload from "./SingleSongUpload";

import MusicPlayerControls from "../MusicPlayerControls";

class _CmsSingleArtist extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isKeyboardActive: false
    }
    Keyboard.addListener("keyboardDidShow", () => this.setState({isKeyboardActive: true}));
    Keyboard.addListener("keyboardDidHide", () => this.setState({isKeyboardActive: false}));
  }

  componentDidMount() {
    this.props.setNav("CmsSingleArtist");
  }

  renderList() {
    return this.props.cmsSingleArtist.songs.map((song, index) => {
      return (
        <View
          key={"CmsSingleArtist_song_key"+index}
          style={{
            flexDirection:"row",padding:10,paddingTop:5,paddingBottom:5,
            alignItems:"center",justifyContent:"space-between",
            backgroundColor:cmsColor+"BB",margin:5,borderRadius:5,borderColor:"#FFF",
            marginTop:2,marginBottom:2
          }}>
          <View style={{flexDirection:"row", alignItems:"center"}}>
            <Icon 
              color="#FFF" name="music" size={40} 
              style={{paddingLeft:5,paddingRight:5,marginRight:20}}
            />
            <View>
              <Text style={{color:"#FFF",fontSize:18}}>{song.title}</Text>
            </View>
          </View>
          <View style={{flexDirection:"row"}}>
            <TouchableOpacity onPress={() => this.props.initSong(song)}>
              <Icon color="#FFF" name="play" size={30} style={{marginRight:20}}/>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  }

  renderToUploadList() {
    return this.props.cmsUploadSongList.map((song, index) => {
      return <SingleSongUpload key={"CmsSingleArtist_upload_key"+index} song={song} isYoutube={song.isYoutube}
        artistName={this.props.cmsSingleArtist.artistName} />
    });
  }

  renderItem({item}) {
    if (item.shouldUpload) return this.renderToUploadList(item);
    return this.renderList(item);
  }

  handleButtonPress() {
    const nullState = {
      isUploading: false,
      isUploadingError: false,
      errorMessage: "",
      isUploadingSuccess: false,
      uploadProgress: 0,
      title: false,
      youtubeUrl: "",
      title: "",
      isUploadingYoutube: false,
      shouldUpload: true
    }
    this.props.cmsAddSong({
      ...nullState,
      isYoutube: true,
      id: this.props.cmsUploadSongList.length
    });
    // DocumentPicker.show({
    //   filetype: [DocumentPickerUtil.audio()],
    // },(error,response) => {
    //   this.props.cmsAddSong({
    //     title: response.fileName,
    //     fileUri: response.uri,
    //     size: Math.round(response.fileSize / 1024 / 1024 * 10) / 10
    //   });
    // });
  }

	render() {
		return (
      <StatusWrapper hideLoading={true}>
      <View style={{flex:1}}>
        <ArtistNameHeader artistName={this.props.cmsSingleArtist.artistName} />
        {/*<FlatList
          contentContainerStyle={{paddingBottom:100}}
          data={[...this.props.cmsUploadSongList, ...this.props.cmsSingleArtist.songs]}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={item => item.id || item.name+item.title}
          style={{flex:1}} keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={() => this.props.cmsSetSingleArtist(this.props.cmsSingleArtist.artistName, true)}
            />
          }>
        </FlatList>*/}
        <ScrollView
          style={{flex:1}} keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={() => this.props.cmsSetSingleArtist(this.props.cmsSingleArtist.artistName, true)}
            />
          }>
            {this.renderToUploadList()}
            {this.renderList()}
            <View style={{height:100}}></View>
        </ScrollView>
        {!this.state.isKeyboardActive && <AddButtonCircle onPress={this.handleButtonPress.bind(this)}/>}
      </View>
      </StatusWrapper>
		);
	}
}

const mapStateToProps = state => ({
  cmsSingleArtist: state.cms.cmsSingleArtist,
  isLoading: state.app.isLoading,
  cmsUploadSongList: state.cms.cmsUploadSongList
});

const CmsSingleArtist = connect(mapStateToProps, {
  setNav, initSong, cmsSetSingleArtist,
  setErrorMessage, transmitStart, transmitFinish,
  setTransmitProgress, cmsAddSong
})(_CmsSingleArtist);

export { CmsSingleArtist };