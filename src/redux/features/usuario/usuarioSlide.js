/* eslint-disable no-console */
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import history from '../../../services/history';
import api from '../../../services/api';

// createSlice makes all action creators and reducers in the same file so no separation of logic is necessary

/** *************STATE SLICE************** */

export const sliceUsuario = createSlice({
  name: 'usuario',
  initialState: {
    token: null,
    signedIn: false,
    loading: false,
    usuario: {},
  },
  reducers: {
    signInSuccess: (state, action) => {
      console.log('signInSuccess Reducer/Action', action);
      const { token, user } = action.payload;
      state.loading = false;
      state.token = token;
      state.usuario = user;
      state.signedIn = true;
    },
    signInRequest: (state, action) => {
      console.log('signInRequest Reducer/Action', state, action.payload);
      const { username, senha } = action.payload;
      state.loading = true;
      state.usuario = { username, senha };
    },
    signOutUser: (state, action) => {
      console.log('SIGN_OUT', action.payload);
      state.loading = false;
      state.token = null;
      state.usuario = {};
      state.signedIn = false;
    },
    signInFailure: (state, action) => {
      console.log('FAILURE', action.payload);
      state.loading = false;
      state.token = null;
      state.usuario = {};
      state.signedIn = false;
    },
    updateRequest: (state, action) => {
      console.log('updateUser Reducer/Action', action);
      const { user } = action.payload;
      state.loading = false;
      state.usuario = user;
      state.signedIn = true;
    },
    updateSuccess: (state, action) => {
      console.log('updateUser Reducer/Action', action);
      const { user } = action.payload;
      state.loading = false;
      state.usuario = user;
      state.signedIn = true;
    },
    updateFailure: (state, action) => {
      console.log('FAILURE', action.payload);
      state.loading = false;
      state.token = null;
      state.usuario = {};
      state.signedIn = false;
    },
  },
});

/** *************EXPORTED ACTIONS & REDUCERS************** */

export const {
  signInRequest,
  signInSuccess,
  signOutUser,
  signInFailure,
  updateRequest,
  updateSuccess,
  updateFailure,
} = sliceUsuario.actions;

export default sliceUsuario.reducer;

// API REQUEST ACTIONS HANDLED WITH REDUX-THUNK MIDDLEWARE BUILT INTO REDUX TOOLKIT -->

/** *************THUNKS************** */

export const getFirstRender = ({ payload }) => {
  console.log('Request in getFirstRender:', payload);
  return async (dispatch) => {
    dispatch(signInRequest({ payload }));
    // redux-thunk
    try {
      const { username, senha } = payload;
      if (!username) {
        toast.error('Nome do Usuário é inválido.');
        return;
      }
      const response = await api.post(`sessions/`, {
        username,
        senha,
      });
      console.log('signInCall getFirstRender', response.data);
      const { token, user } = response.data;
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        // const users = await api.get('usuarios/');
        // console.log('USER: ', users);
        dispatch(signInSuccess({ token, user }));
        history.push('/home');
        return;
      }
    } catch (error) {
      toast.error(
        `ERRO: Falha na atualização do Usuário, verifique seus dados.  ${error}`
      );
      dispatch(signOutUser());
    }
  };
};

export const signUp = ({ payload }) => {
  return async (dispatch) => {
    try {
      const { username, celular, senha, confirmPassword } = payload;

      if (!username) {
        toast.error('Nome do Usuário é inválido.');
      } else if (senha !== confirmPassword) {
        toast.error('Senhas digitadas não conferem.');
      } else {
        await api.put('usuario/update', {
          celular,
          username,
          senha,
          confirmPassword,
        });

        history.push('/login');
      }
    } catch (error) {
      toast.error(`ERRO: ${error.response.data.error}`);
      dispatch(signInFailure());
    }
  };
};

export const setToken = ({ payload }) => {
  console.log('setToken...');
  if (!payload) return;

  const { token } = payload.usuario;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
};

export const signOut = () => {
  toast.success('Usuário signOut!');
  history.push('/');
};

export const updateProfileRequest = ({ payload }) => {
  return async (dispatch) => {
    try {
      const { nome, username, celular, email, ...rest } = payload.data;

      const profile = {
        nome,
        username,
        celular,
        email,
        ...(rest.oldPassword ? rest : {}),
      };

      console.log('updateProfileRequest', profile);

      const response = await api.put('usuarios', profile);

      toast.success('Perfil atualizado com sucesso!');

      dispatch(updateSuccess(response.data));
    } catch (error) {
      toast.error(`ERRO:  ${error.response.data.error}`);
      console.log('ERRO: ', error.response.data.error);
      dispatch(updateFailure());
    }
  };
};
