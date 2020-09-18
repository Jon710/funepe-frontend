import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '../../../services/history';
import apiAuth from '../../../services/apiAuth';
import api from '../../../services/api';

import { signInSuccess, signFailure, updateUserSuccess } from './actions';

export function* signIn({ payload }) {
  try {
    const { cpfusuario, senha } = payload;
    const response = yield call(apiAuth.post, 'sessions', {
      cpfusuario,
      senha,
    });

    const { token, user } = response.data;

    yield put(signInSuccess(token, user));

    history.push('/home');
  } catch (err) {
    toast.error('Falha na autenticação, verifique seus dados');
    yield put(signFailure());
  }
}

export function* updateUser({ payload }) {
  try {
    const { cpfusuario, senha, oldPassword, confirmPassword } = payload.user;
    const response = yield call(apiAuth.put, 'usuarios', {
      cpfusuario,
      senha,
      oldPassword,
      confirmPassword,
    });

    const { usuario } = response.data;

    yield put(updateUserSuccess(usuario));

    toast.success('Usuário atualizado!');
    history.push('/home');
  } catch (err) {
    toast.error('Erro ao atualizar!');
    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    apiAuth.defaults.headers.Authorization = `Bearer ${token}`;
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export function signOut() {
  history.push('/');
}

export default all([
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('persist/REHYDRATE', setToken),
  // takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/UPDATE_USER_REQUEST', updateUser),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
