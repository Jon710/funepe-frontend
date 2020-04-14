import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import history from '../../../services/history';
import api from '../../../services/api';

// createSlice makes all action creators and reducers in the same file so no separation of logic is necessary
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
      const { token, user } = action.payload;
      state.loading = false;
      state.token = token;
      state.usuario = user;
      state.signedIn = true;
    },
    signInRequest: (state, action) => {
      const { username, senha } = action.payload;
      state.loading = true;
      state.usuario = { username, senha };
    },
    signOutUser: state => {
      state.loading = false;
      state.token = null;
      state.usuario = {};
      state.signedIn = false;
    },
    signInFailure: state => {
      state.loading = false;
      state.token = null;
      state.usuario = {};
      state.signedIn = false;
    },
    updateRequest: (state, action) => {
      const { user } = action.payload;
      state.loading = false;
      state.usuario = user;
      state.signedIn = true;
    },
    updateSuccess: (state, action) => {
      const { user } = action.payload;
      state.loading = false;
      state.usuario = user;
      state.signedIn = true;
    },
    updateFailure: state => {
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

/** *************THUNKS************** */

export const getFirstRender = ({ payload }) => {
  return async dispatch => {
    dispatch(signInRequest({ payload }));

    try {
      const { username, senha } = payload;
      if (!username) {
        toast.error('Nome do Usuário é inválido.');
        return;
      }

      const response = await api.post(`sessions`, {
        username,
        senha,
      });

      const { token, user } = response.data;
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;

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
  return async dispatch => {
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
  return async dispatch => {
    try {
      const { nome, username, celular, email, ...rest } = payload.data;

      const profile = Object.assign(
        { nome, username, celular, email },
        rest.oldPassword ? rest : {}
      );

      const response = await api.put('usuarios', profile);

      toast.success('Perfil atualizado com sucesso!');

      dispatch(updateSuccess(response.data));
    } catch (error) {
      toast.error(`ERRO:  ${error.response.data.error}`);
      dispatch(updateFailure());
    }
  };
};
