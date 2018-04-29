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

public class SlusajMediaPlayerModule extends ReactContextBaseJavaModule {

  private static MediaPlayer mediaPlayer;
  private static Context context;
  private static Callback onCompletionCallback;

  public SlusajMediaPlayerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.context = (Context) reactContext;
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
  public void setOnCompletionCallback(Callback callback) {
    this.onCompletionCallback = callback;
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
        callback.invoke();
      }
    });

    this.mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
      @Override
      public void onCompletion(MediaPlayer player) {
        SlusajMediaPlayerModule.this.onCompletionCallback.invoke();
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
  	this.mediaPlayer.start();
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
}