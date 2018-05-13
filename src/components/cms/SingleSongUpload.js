import React, { Component } from "react";
import {
  View, TextInput, Text, TouchableOpacity, ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { Circle } from "react-native-progress";
import getYouTubeID from "get-youtube-id";
import { DocumentPicker, DocumentPickerUtil } from "react-native-document-picker";

import { cmsColor } from "../../utils/utils";
import { 
  transmitStart, transmitFinish, setTransmitProgress, setErrorMessage 
} from "../../reducers/app/actions";
import { cmsChangeUploadType, setStateCmsUploadSong } from "../../reducers/cms/actions";

class SingleSongUpload extends Component {

  state = {
    isUploading: false,
    isUploadingError: false,
    errorMessage: "",
    isUploadingSuccess: false,
    uploadProgress: 0,
    title: false,
    youtubeId: ""
  };

  handleUploadPress() {
    const { song, setStateCmsUploadSong } = this.props;
    if (song.isUploading || song.isUploadingSuccess || (!song.title && song.isYoutube)) return;
    if (song.isUploadingError) {
      setStateCmsUploadSong(song.id, {isUploadingError: false, errorMessage: ""});
      return;
    }
    if (song.isYoutube) {
      if (!song.youtubeUrl) {
        setStateCmsUploadSong(song.id, {youtubeUrl: song.title});
        return;
      }
      if (!song.title) return;
      const body = {
        youtubeId: getYouTubeID(song.youtubeUrl),
        songName: song.title
      };
      setStateCmsUploadSong(song.id, {isUploadingYoutube:true});
      axios.post(`http://46.101.191.69:3000/api/v1/add-song-youtube/${this.props.artistName}`, body).then(res => {
        if (res.data.status !== 200) {
          setStateCmsUploadSong(song.id, {
            isUploadingYoutube: false,
            isUploadingError: true,
            errorMessage: res.data.response
          });
        } else {
          setStateCmsUploadSong(song.id, {
            isUploadingYoutube: false,
            isUploadingSuccess: true
          });
        }
      }).catch(err => {
        setStateCmsUploadSong(song.id, {
          isUploadingYoutube: false,
          isUploadingError: true,
          errorMessage: "Greška prilikom slanja."
        });
      });
    } else {
      if (!song.fileUri) {
        DocumentPicker.show({
          filetype: [DocumentPickerUtil.audio()],
        },(error,response) => {
          if (!response) return;
          this.props.setStateCmsUploadSong(song.id, {
            title: response.fileName,
            fileOrigName: response.fileName,
            fileUri: response.uri,
            size: Math.round(response.fileSize / 1024 / 1024 * 10) / 10
          });
        });
      } else {
        setStateCmsUploadSong(song.id, {isUploading: true});
        const file = {
          uri: song.fileUri,
          type: "audio/mpeg",
          name: "newSong" + new Date().getTime()
        };
        const body = new FormData();
        body.append("song", file);
        body.append("songName", song.title);
        const config = {
          headers: {
            "content-type": "multipart/form-data"
          },
          onUploadProgress: function( progressEvent ) {
            setStateCmsUploadSong(song.id, {
              uploadProgress: progressEvent.loaded/progressEvent.total
            });
          }
        }
        axios.post(`http://46.101.191.69:3000/api/v1/add-song/${this.props.artistName}`, body, config).then(res => {
          if (res.data.status !== 200) {
            setStateCmsUploadSong(song.id, {
              isUploading: false,
              isUploadingError: true,
              errorMessage: res.data.response,
              uploadProgress: 0
            });
          } else {
            setStateCmsUploadSong(song.id, {
              isUploading: false,
              isUploadingSuccess: true,
              uploadProgress: 0
            });
          }
        }).catch(err => {
          setStateCmsUploadSong(song.id, {
            isUploading: false,
            isUploadingError: true,
            errorMessage: "Greška prilikom slanja.",
            uploadProgress: 0
          });
        });
      }
    }
  }

  renderIcon(song) {
    if (song.isUploadingError) {
      return <Icon color="#FF4646" name="alert-circle-outline" size={50} />
    } else if (song.isUploadingSuccess) {
      return <Icon color="#329932" name="check-circle-outline" size={50} />
    } else if (song.isUploadingYoutube) {
      return <ActivityIndicator size="large" color={cmsColor}/>
    }else if (song.isUploading) {
      return <Circle progress={song.uploadProgress} color={cmsColor} size={50} thickness={24}/>
    } else if (!song.youtubeUrl && !song.fileUri) {
      return <Icon color={song.isYoutube && !song.title ? cmsColor : cmsColor} 
        name="plus-circle-outline" size={50} />
    } else {
      return <Icon color={cmsColor} name="arrow-up-bold-circle-outline" size={50} />
    }
  }

  render() {
    const { song, setStateCmsUploadSong } = this.props;
    const disabled = (!song.isYoutube && !song.fileUri) || song.isUploadingSuccess ? true : false;
    const headerText = song.isYoutube ? song.youtubeUrl : song.fileOrigName;
    return (
      <View style={{backgroundColor:"#FFF",padding:10,margin:5}}>
        <View>
          <Text>{headerText}</Text>
        </View>
        <View 
          style={{
            flexDirection:"row",justifyContent:"space-around",alignItems:"center"
          }}>
          <TouchableOpacity
          activeOpacity={song.isUploadingSuccess ? 1 : 0.2}
          onPress={() => {
            if (song.isUploadingSuccess) return;
            setStateCmsUploadSong(song.id, {isYoutube: !this.props.isYoutube});
          }}>
          {song.isYoutube ? 
            <FAIcon color={cmsColor} name="youtube-play" size={40} 
              style={{marginRight:20,paddingLeft:5,paddingRight:5}}/> :
            <Icon color={cmsColor} name="file-music" size={40} 
              style={{marginRight:20,paddingLeft:5,paddingRight:5}}/>
          }
          </TouchableOpacity>
          <TextInput
            placeholder={song.isUploadingSuccess ? "" : song.isYoutube ? song.youtubeUrl ? "Naziv pjesme..." : "Youtube link..."
              : "Naziv pjesme..."}
            editable={!disabled} selectTextOnFocus={!disabled}
            value={song.title}
            onChangeText={(text) => setStateCmsUploadSong(song.id, {title: text})}
            style={{flex:1,backgroundColor:disabled ? "#00000022":"#FFF",borderRadius:10,
              borderWidth:disabled?0:1,borderColor:{cmsColor},paddingLeft:10,marginRight:20}}
          />
          {!song.isYoutube && <Text style={{marginRight:5}}>{song.size} MB</Text>}
          <TouchableOpacity 
            activeOpacity={(song.isYoutube && !song.title) || song.isUploadingSuccess ? 1 : 0.2}
            onPress={this.handleUploadPress.bind(this)}>
            {this.renderIcon(song)}
          </TouchableOpacity>
        </View>
        {song.isUploadingError &&
          <View>
            <Text style={{color:"#FF4646"}}>{song.errorMessage}</Text>
          </View>}
      </View>
    );
  }
}

export default connect(null,{
  setErrorMessage, transmitStart, transmitFinish,
  setTransmitProgress, cmsChangeUploadType, setStateCmsUploadSong
})(SingleSongUpload);