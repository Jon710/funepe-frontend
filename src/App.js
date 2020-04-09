/* eslint-disable no-console */
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import { Router } from 'react-router-dom';

// CUSTOM configureStore WITH REDUX-PERSIST & REDUX TOOLKIT
import configureStore from './redux/configure-store';
import Routes from './routes';
import NavBar from '~/pages/usuario/Index/NavBar';
import customHistory from './services/history';

import GlobalStyle from './styles/globals';
// import configureStore from './redux/configure-store';
const [store, persistor] = configureStore();

function App() {
  console.log('Starting App', store);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={customHistory}>
          <GlobalStyle />
          <NavBar />
          <Routes />
          <ToastContainer position="top-center" autoClose={2000} />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
