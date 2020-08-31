export function signInRequest(cpfusuario, senha) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: { cpfusuario, senha },
  };
}

export function signInSuccess(token, user) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: { token, user },
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
