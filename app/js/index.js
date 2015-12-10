import React from 'react';
import ReactDom from 'react-dom';
import thunk from 'redux-thunk';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import IndexReducers from './reducers/index';
import Index from './module/index';
import { devTools, persistState } from 'redux-devtools';

//let store = createStore(IndexReducers);
const finalCreateStore = compose(
    // Enables your middleware:
    applyMiddleware(thunk), // any Redux middleware, e.g. redux-thunk
    // Provides support for DevTools:
    devTools()
    // Lets you write ?debug_session=<name> in address bar to persist debug sessions
    //persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStore);

const store = finalCreateStore(IndexReducers);

var currentUser = undefined;

if(window.CURRENT_USER) {
    currentUser = window.CURRENT_USER;
}
let rootElement = document.getElementById('container');
console.log(currentUser);
ReactDom.render(
    // 为了解决 React 0.13 的问题，
    // 一定要把 child 用函数包起来。
    <Provider store={store} >
      <Index currentUser={currentUser}/>
    </Provider>,
    rootElement
);
