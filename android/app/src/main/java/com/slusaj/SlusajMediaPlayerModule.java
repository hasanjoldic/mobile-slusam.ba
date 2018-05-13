package com.slusaj;

import android.widget.Toast;
import android.app.Application;
import android.content.Context;


import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.Map;
import java.util.HashMap;

import android.media.MediaPlayer;
import android.net.Uri;

import android.widget.Toast;

import android.media.AudioManager;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.content.Intent;

public class SlusajMediaPlayerModule extends ReactContextBaseJavaModule {

  private MediaPlayer mediaPlayer;
  private Context context;
  private ReactContext reactContext;
  public static int REQ_CODE_PICK_SOUNDFILE = 1;

  private AudioManager.OnAudioFocusChangeListener mAudioFocusListener;

  public SlusajMediaPlayerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.context = (Context) reactContext;
    this.reactContext = reactContext;

    this.mAudioFocusListener = new AudioManager.OnAudioFocusChangeListener() {
      public void onAudioFocusChange(int focusChange) {
        switch (focusChange) {
          case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK:
            if (SlusajMediaPlayerModule.this.mediaPlayer.isPlaying()) {
              SlusajMediaPlayerModule.this.mediaPlayer.setVolume(0.2f, 0.2f);
            }
            break;
          case AudioManager.AUDIOFOCUS_GAIN:
            if (SlusajMediaPlayerModule.this.mediaPlayer.isPlaying()) {
              SlusajMediaPlayerModule.this.mediaPlayer.setVolume(1f, 1f);
            }
            break;
          case AudioManager.AUDIOFOCUS_LOSS:
            if (SlusajMediaPlayerModule.this.mediaPlayer.isPlaying()) {
              SlusajMediaPlayerModule.this.mediaPlayer.pause();
              SlusajMediaPlayerModule.this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("SlusajMediaPlayer_PAUSE", null);
            }
            break;
          case AudioManager.AUDIOFOCUS_LOSS_TRANSIENT:
            if (SlusajMediaPlayerModule.this.mediaPlayer.isPlaying()) {
              SlusajMediaPlayerModule.this.mediaPlayer.pause();
              SlusajMediaPlayerModule.this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("SlusajMediaPlayer_PAUSE", null);
            }
            break;
        }
      }
    };
  }

  @Override
  public String getName() {
    return "SlusajMediaPlayer";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    //constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    //constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  @ReactMethod
  public void init(String url, final Callback callback) {
    if (this.mediaPlayer != null) {
      this.mediaPlayer.release();
    }
    this.mediaPlayer = new MediaPlayer();
    try {
    this.mediaPlayer.setDataSource(url);
    this.mediaPlayer.prepareAsync();
    } catch (Exception e) {
      Toast.makeText(this.context, "mp3 not found", Toast.LENGTH_SHORT).show();
    }

    this.mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
        @Override
      public void onPrepared(MediaPlayer player) {
        callback.invoke(SlusajMediaPlayerModule.this.mediaPlayer.getDuration());
        if (requestAudioFocus()) {
          SlusajMediaPlayerModule.this.mediaPlayer.start();
        }
      }
    });

    this.mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
      @Override
      public void onCompletion(MediaPlayer player) {
        SlusajMediaPlayerModule.this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit("SlusajMediaPlayer_COMPLETION", null);
      }
    });
    this.mediaPlayer.setOnInfoListener(new MediaPlayer.OnInfoListener() {
      @Override
      public boolean onInfo(MediaPlayer player, int what, int extra) {
        if (what == MediaPlayer.MEDIA_INFO_BUFFERING_START) {
          SlusajMediaPlayerModule.this.reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("MEDIA_INFO_BUFFERING_START", null);
            return true;
        } else if (what == MediaPlayer.MEDIA_INFO_BUFFERING_END) {
          SlusajMediaPlayerModule.this.reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("MEDIA_INFO_BUFFERING_END", null);
            return true;
        }
        return false;
      }
    });
  }

  @ReactMethod
  public void pause() {
  	if(this.mediaPlayer.isPlaying()) {
  	  this.mediaPlayer.pause();
    }
  }

  @ReactMethod
  public void start() {
    if (requestAudioFocus()) {
  	  this.mediaPlayer.start();
    }
  }

  @ReactMethod
  public void stop() {
  	this.mediaPlayer.seekTo(0);
  	this.mediaPlayer.pause();
  }

  @ReactMethod
  public void getDuration(Callback callback) {
    callback.invoke(this.mediaPlayer.getDuration());
  }

  @ReactMethod
  public void getCurrentPosition(Callback callback) {
    callback.invoke(this.mediaPlayer.getCurrentPosition());
  }

  @ReactMethod
  public void seekTo(int newPosition) {
  	this.mediaPlayer.seekTo(newPosition);
  }

  private boolean requestAudioFocus() {
    try {
      AudioManager audioManager = (AudioManager) this.context.getSystemService(Context.AUDIO_SERVICE);
      int result = audioManager.requestAudioFocus(this.mAudioFocusListener, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
      if (result == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
        return true;
      }
    }catch (Exception e){
      e.printStackTrace();
    }
    //Could not gain focus
    return false;
  }
}