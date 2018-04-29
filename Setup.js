import React, { Component } from 'react';
import { Provider } from "react-redux";

import App from "./src/App";
import store from "./src/store/configureStore";

export default class Setup extends Component<Props> {
  render() {
    return (
      <Provider store={store} >
          <App />
      </Provider>
    );
  }
}