import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import GlobalStyle from './styles/globals';

import Routes from './routes';
import history from './services/history';

import { store, persistor } from './store';

function App() {
  console.log('Entrou no app.js');
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <GlobalStyle />
          <Routes />
          <ToastContainer position="top-center" autoClose={2000} />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
