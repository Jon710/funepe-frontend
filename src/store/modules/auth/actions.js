import api from '../../../services/api';

export function signInRequest(cpfusuario, senha) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: { cpfusuario, senha },
  };
}

export function signInSuccess(token, user) {
  api.post(`historico/`, {
    conteudo: `Acesso ao sistema FUNEPE! - ${user.username}`,
    codUsuario: user.cpfusuario,
  });

  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: { token, user },
  };
}

export function updateUserRequest(user) {
  return {
    type: '@auth/UPDATE_USER_REQUEST',
    payload: { user },
  };
}

export function updateUserSuccess(user) {
  return {
    type: '@auth/UPDATE_USER_SUCCESS',
    payload: { user },
  };
}

export function signUpRequest(cpfusuario, senha) {
  return {
    type: '@auth/SIGN_UP_REQUEST',
    payload: { cpfusuario, senha },
  };
}

export function signFailure() {
  return {
    type: '@auth/SIGN_FAILURE',
  };
}

export function signOut() {
  return {
    type: '@auth/SIGN_OUT',
  };
}
