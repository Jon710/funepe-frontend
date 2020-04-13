/* eslint-disable no-console */
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import { Router } from 'react-router-dom';

// CUSTOM configureStore WITH REDUX-PERSIST & REDUX TOOLKIT
import configureStore from './redux/configure-store';
import Routes from './routes';
import NavBar from './pages/usuario/Index/NavBar';
import customHistory from './services/history';

import GlobalStyle from './styles/globals';
import ModalContext from './redux/features/context/modal';

const [store, persistor] = configureStore();

function App() {
  const [context, setContext] = useState(false);
  console.log('Starting App', store);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ModalContext.Provider value={[context, setContext]}>
          <Router history={customHistory}>
            <GlobalStyle />
            <NavBar />
            <Routes />
            <ToastContainer position="top-center" autoClose={2000} />
          </Router>
        </ModalContext.Provider>
      </PersistGate>
    </Provider>
  );
}

export default App;
